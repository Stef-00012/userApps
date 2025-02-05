import type { CommandPermissions, CommandStatus } from "?/permissions";
import type { Client } from "&/DiscordClient";
import { eq } from "drizzle-orm";
import {
	type DiscordAPIError,
	MessageFlags,
	type Interaction,
} from "discord.js";

export default async function (client: Client, int: Interaction) {
	const commandStatusJSON: CommandStatus = await Bun.file(
		`${__dirname}/../data/permissions/commandStatus.json`,
	).json();

	if (
		(int.isChatInputCommand() ||
			int.isMessageContextMenuCommand() ||
			int.isUserContextMenuCommand()) &&
		!commandStatusJSON[int.commandName]
	)
		return int.reply({
			content: "This command is disabled",
			flags: MessageFlags.Ephemeral,
		});

	if (
		int.isChatInputCommand() ||
		int.isUserContextMenuCommand() ||
		int.isMessageContextMenuCommand()
	) {
		const commandPermissionsJSON: CommandPermissions = await Bun.file(
			`${__dirname}/../data/permissions/commandPermissions.json`,
		).json();

		if (!commandPermissionsJSON[int.commandName]) {
			commandPermissionsJSON[int.commandName] = [];

			Bun.write(
				`${__dirname}/../data/permissions/commandPermissions.json`,
				JSON.stringify(commandPermissionsJSON, null, 2),
			);
		}

		if (
			commandPermissionsJSON[int.commandName].length &&
			!commandPermissionsJSON[int.commandName].includes(int.user.id)
		)
			return int.reply({
				flags: MessageFlags.Ephemeral,
				content: "You're not allowed to run this command",
			});

		const cmd = client.commands.get(int.commandName);

		if (!cmd)
			return int.reply({
				flags: MessageFlags.Ephemeral,
				content: "I couldn't find this command",
			});

		try {
			await cmd.execute(client, int);
		} catch (e) {
			const error = e as DiscordAPIError;

			console.log(error);

			if (error.code !== 10062) {
				if (int.deferred) {
					int.editReply({
						content: "Something went wrong...",
						components: [],
						embeds: [],
					});
				} else {
					int.reply({
						content: "Something went wrong...",
					});
				}
			}
		}

		const analyticsSchema = client.dbSchema.analytics;

		const commandAnalytics = await client.db.query.analytics.findFirst({
			where: eq(analyticsSchema.commandName, int.commandName),
		});

		if (commandAnalytics) {
			await client.db
				.update(analyticsSchema)
				.set({
					uses: commandAnalytics.uses + 1,
				})
				.where(eq(analyticsSchema.commandName, int.commandName));
		} else {
			await client.db.insert(analyticsSchema).values({
				commandName: int.commandName,
				uses: 1,
			});
		}
	}

	if (int.isAutocomplete()) {
		const cmd = client.commands.get(int.commandName);

		if (!cmd || !cmd.autocomplete) return;

		try {
			await cmd.autocomplete(client, int);
		} catch (e) {
			const error = e as DiscordAPIError;

			if (error.code !== 10062) {
				await int.respond([]);
			}
		}
	}
}

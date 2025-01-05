import type { CommandPermissions } from "../../../types/permissions";
import type { Client } from "../../../structures/DiscordClient";
import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const commandPermissionsJSON: CommandPermissions = await Bun.file(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
	).json();

	const commandName = int.options.getString("command", true);
	const user = int.options.getString("user", true);

	if (!commandPermissionsJSON[commandName])
		commandPermissionsJSON[commandName] = [];

	if (!user)
		return await int.reply({
			content: "I couldn't find this user",
			flags: MessageFlags.Ephemeral,
		});

	if (commandPermissionsJSON[commandName].includes(user))
		return await int.reply({
			content: `\`${user}\` is already allowed to use this command`,
			flags: MessageFlags.Ephemeral,
		});

	commandPermissionsJSON[commandName] = Array.from(
		new Set([
			user,
			...client.config.owners,
			...commandPermissionsJSON[commandName],
		]),
	);

	Bun.write(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
		JSON.stringify(commandPermissionsJSON, null, 2),
	);

	await int.reply({
		content: `Successfully added \`${user}\` in the users who can run the command \`${commandName}\``,
		flags: MessageFlags.Ephemeral,
	});
}

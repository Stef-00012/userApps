import type { Client } from "../../../structures/DiscordClient";
import type { CommandStatus } from "../../../types/permissions";
import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const commandStatusJSON: CommandStatus = await Bun.file(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
	).json();

	const commandName = int.options.getString("command", true);

	if (!commandStatusJSON[commandName])
		return await int.reply({
			content: `\`${commandName}\` is already disabled`,
			flags: MessageFlags.Ephemeral,
		});

	commandStatusJSON[commandName] = false;

	Bun.write(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	await int.reply({
		content: `Successfully disabled the command \`${commandName}\``,
		flags: MessageFlags.Ephemeral,
	});
}

import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { CommandPermissions } from "?/permissions";
import type { Client } from "&/DiscordClient";

export default async function (
	_client: Client,
	int: ChatInputCommandInteraction,
) {
	const commandPermissionsJSON: CommandPermissions = await Bun.file(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
	).json();

	const commandName = int.options.getString("command", true);
	const user = int.options.getString("user", true);

	if (!commandPermissionsJSON[commandName])
		commandPermissionsJSON[commandName] = [];

	// if (client.config.owners.includes(user)) return int.reply({
	//     content:`\`${user}\` is one of the owners, you can't manage their permissions`,
	//     ephemeral: true
	// })

	if (!commandPermissionsJSON[commandName].includes(user))
		return await int.reply({
			content: `\`${user}\` is already not allowed to use this command`,
			flags: MessageFlags.Ephemeral,
		});

	commandPermissionsJSON[commandName] = commandPermissionsJSON[
		commandName
	].filter((usr) => usr !== user);

	Bun.write(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
		JSON.stringify(commandPermissionsJSON, null, 2),
	);

	await int.reply({
		content: `Successfully removed \`${user}\` from the users who can run the command \`${commandName}\``,
		flags: MessageFlags.Ephemeral,
	});
}

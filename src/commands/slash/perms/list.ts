import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { CommandPermissions } from "../../../types/permissions";
import type { Client } from "../../../structures/DiscordClient";
import commands from "../../../commands"

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const commandPermissionsJSON: CommandPermissions = await Bun.file(
		`${__dirname}/../../../data/permissions/commandPermissions.json`,
	).json();

	const embed = new EmbedBuilder().setTitle("Command Permissions");

	let description = "";

	for (const command of commands) {
		if (
			!commandPermissionsJSON[command.name] ||
			!commandPermissionsJSON[command.name].length
		) {
			description += `## ${command.name}\n- Everyone\n`;
		} else {
			description += `## ${command.name}\n- ${commandPermissionsJSON[
				command.name
			]
				.map((id) => `\`${id}\``)
				.join(", ")}\n`;
		}
	}

	embed.setDescription(description);

	await int.reply({
		embeds: [embed],
		ephemeral: true,
	});
}

import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import {
	EmbedBuilder,
	MessageFlags,
	AttachmentBuilder,
	type UserContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Get User JSON",
	requires: [],

	async execute(_client: Client, int: UserContextMenuCommandInteraction) {
		const plainUserJSON = JSON.stringify(int.targetUser, null, 2);
		const userJSON = JSON.stringify(int.targetUser, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				userJSON.length > 4081 ? `${userJSON.substr(0, 4081)}...` : userJSON
			}\n\`\`\``,
		);

		const attachment = new AttachmentBuilder(Buffer.from(plainUserJSON), {
			name: "user-data.json",
		});

		await int.reply({
			embeds: [embed],
			files: [attachment],
			flags: MessageFlags.Ephemeral,
		});
	},
} as Command;

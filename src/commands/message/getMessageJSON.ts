import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import {
	type MessageContextMenuCommandInteraction,
	AttachmentBuilder,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export default {
	name: "Get Message JSON",
	requires: [],

	async execute(client: Client, int: MessageContextMenuCommandInteraction) {
		const plainMessageJSON = JSON.stringify(int.targetMessage, null, 2)
		const messageJSON = JSON.stringify(int.targetMessage, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				messageJSON.length > 4081
					? `${messageJSON.substr(0, 4081)}...`
					: messageJSON
			}\n\`\`\``,
		);

		const attachment = new AttachmentBuilder(Buffer.from(plainMessageJSON), {
			name: "message-data.json"
		})

		await int.reply({
			embeds: [embed],
			files: [attachment],
			flags: MessageFlags.Ephemeral,
		});
	},
} as Command;

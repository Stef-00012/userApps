import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import {
	EmbedBuilder,
	MessageFlags,
	AttachmentBuilder,
	type UserContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Get Member JSON",
	requires: [],

	async execute(_client: Client, int: UserContextMenuCommandInteraction) {
		const plainMemberJSON = JSON.stringify(int.targetMember, null, 2);
		const memberJSON = JSON.stringify(int.targetMember, null, 2).replaceAll(
			"`",
			"\\`",
		);

		const embed = new EmbedBuilder().setDescription(
			`\`\`\`json\n${
				memberJSON.length > 4081
					? `${memberJSON.substr(0, 4081)}...`
					: memberJSON
			}\n\`\`\``,
		);

		const attachment = new AttachmentBuilder(Buffer.from(plainMemberJSON), {
			name: "member-data.json",
		});

		await int.reply({
			embeds: [embed],
			files: [attachment],
			flags: MessageFlags.Ephemeral,
		});
	},
} as Command;

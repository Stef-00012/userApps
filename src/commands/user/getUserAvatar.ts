import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import {
	EmbedBuilder,
	MessageFlags,
	type UserContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Get User Avatar",
	requires: [],

	async execute(client: Client, int: UserContextMenuCommandInteraction) {
		if (!int.targetUser.avatar)
			return await int.reply({
				content: "The user doesn't have any avatar",
				flags: MessageFlags.Ephemeral,
			});

		const url = int.targetUser.displayAvatarURL();

		const embed = new EmbedBuilder()
			.setTitle("User Avatar")
			.setDescription(url)
			.setImage(url);

		await int.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	},
} as Command;

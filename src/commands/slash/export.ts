import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import path from "node:path";
import fs from "node:fs";
import {
	AttachmentBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "export",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const inputPath = int.options.getString("path", true);

		const filePath = path.join(process.cwd(), inputPath);

		if (!fs.existsSync(filePath))
			return await int.reply({
				content: "This file doesn't exist",
			});

		const attachment = new AttachmentBuilder(filePath, {
			name: path.basename(filePath),
		});

		await int.deferReply();

		await int.editReply({
			content: `<https://github.com/stef-00012/discord-user-installed-apps/blob/main/${
				inputPath.startsWith("/") ? inputPath.replace("/", "") : inputPath
			}>`,
			files: [attachment],
		});
	},
} as Command;

import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import shortenWithZipline from "$/shortenWithZipline";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import config from "$config";

export default {
	name: "shorten",
	requires: ["zipline"],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		if (!config.zipline)
			return await int.reply({
				content: "Missing Zipline auth data",
			});

		const ephemeral = int.options.getBoolean("ephemeral") || false;
		const url = int.options.getString("url", true);
		const vanity = int.options.getString("vanity");
		const maxViews = int.options.getInteger("max-views");
		const password = int.options.getString("password");

		if (["http://", "https://"].every((protocol) => !url.startsWith(protocol)))
			return await int.reply({
				content: "Yo must use a valid URL",
				flags: MessageFlags.Ephemeral,
			});

		await int.deferReply({
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		});

		const shortenedUrl = await shortenWithZipline({
			url,
			vanity,
			password,
			maxViews,
		});

		if (!shortenedUrl)
			return int.editReply({
				content: "Failed to shorten the URL",
			});

		await int.editReply({
			content: `[Your URL](${shortenedUrl}) has been shortened\nURL: ${shortenedUrl}`,
		});
	},
} as Command;

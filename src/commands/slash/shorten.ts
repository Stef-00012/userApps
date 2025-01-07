import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { ZiplineRequestData } from "?/zipline";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import config from "$config";
import axios from "axios";

export default {
	name: "shorten",
	requires: ["zipline"],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		if (!config.zipline)
			return await int.reply({
				content: "Missing Zipline auth data",
			});

		const domain = config.zipline.url;
		const token = config.zipline.token;

		const ephemeral = int.options.getBoolean("ephemeral") || false;
		const url = int.options.getString("url", true);
		const vanity = int.options.getString("vanity");

		if (["http://", "https://"].every((protocol) => !url.startsWith(protocol)))
			return await int.reply({
				content: "Yo must use a valid URL",
				flags: MessageFlags.Ephemeral,
			});

		await int.deferReply({
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		});

		const data = {
			url,
		} as ZiplineRequestData;

		if (vanity) data.vanity = vanity;

		try {
			const shortenResponse = await axios.post(`${domain}/api/shorten`, data, {
				headers: {
					Authorization: token,
					"content-type": "application/json",
				},
			});

			await int.editReply({
				content: `[Your URL](${shortenResponse.data.url}) has been shortened\nURL: ${shortenResponse.data.url}`,
			});
		} catch (e) {
			console.error(e);

			await int.editReply({
				content: "Something went wrong...",
			});
		}
	},
} as Command;

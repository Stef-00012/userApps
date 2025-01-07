import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";

export default {
	name: "http",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const urls = {
			cat: "https://http.cat/{status}",
			dog: "https://httpstatusdogs.com/img/{status}.jpg",
			goat: "https://httpgoats.com/{status}.jpg",
		};

		const type = int.options.getString("type", true);
		const status = int.options.getInteger("status", true);

		await int.reply({
			content: urls[type as keyof typeof urls].replace(
				"{status}",
				String(status),
			),
		});
	},
} as Command;

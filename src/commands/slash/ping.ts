import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";

export default {
	name: "ping",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		await int.reply({
			content: `My ping is ${client.ws.ping}ms`,
		});
	},
} as Command;

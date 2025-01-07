import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";

export default {
	name: "gary",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const subcommand = int.options.getSubcommand();

		const subcommandData = (await import(`./gary/${subcommand}`)).default;

		await subcommandData(client, int);
	},
} as Command;

import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";

export default {
	name: "ptero",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const subcommandGroup = int.options.getSubcommandGroup();
		const subcommand = int.options.getSubcommand();

		let path = "";
		if (subcommandGroup) path += `${subcommandGroup}/`;
		path += subcommand;

		const subcommandData = (await import(`./ptero/${path}`)).default;

		await subcommandData(client, int);
	},
} as Command;

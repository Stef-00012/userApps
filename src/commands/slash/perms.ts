import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from "discord.js";

module.exports = {
	name: "perms",
	requires: [],

	async autocomplete(client: Client, int: AutocompleteInteraction) {
		const value = int.options.getFocused();
		const commands = client.commands;

		let matches = commands
			.map((cmd) => ({
				name: cmd.name,
				value: cmd.name,
			}))
			.filter((cmd) => cmd.name.toLowerCase().startsWith(value.toLowerCase()));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client: Client, int: ChatInputCommandInteraction) {
		const subcommand = int.options.getSubcommand();

		const subcommandData = (await import(`./perms/${subcommand}`)).default;

		await subcommandData(client, int);
	},
} as Command;

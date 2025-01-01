import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import { eq } from "drizzle-orm";
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "tag",
	requires: [],

	async autocomplete(client: Client, int: AutocompleteInteraction) {
		const value = int.options.getFocused();

		const tagsSchema = client.dbSchema.tags;

		const userTags =
			(await client.db.query.tags.findMany({
				where: eq(tagsSchema.id, int.user.id),
			})) || [];

		if (userTags?.length <= 0) return int.respond([]);

		let matches = userTags
			.map((tag) => ({
				name: tag.name,
				value: tag.name,
			}))
			.filter((tag) => tag.name.startsWith(value));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client: Client, int: ChatInputCommandInteraction) {
		const subcommand = int.options.getSubcommand();

		const subcommandData = (await import(`./tag/${subcommand}`)).default;

		await subcommandData(client, int);
	},
} as Command;

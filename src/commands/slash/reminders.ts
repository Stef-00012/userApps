import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import { eq } from "drizzle-orm";
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "reminders",
	requires: [],

	async autocomplete(client: Client, int: AutocompleteInteraction) {
		const value = int.options.getFocused();

		const remindersSchema = client.dbSchema.reminders;

		const userReminders =
			(await client.db.query.reminders.findMany({
				where: eq(remindersSchema.userId, int.user.id),
			})) || [];

		if (userReminders?.length <= 0) return await int.respond([]);

		let matches = userReminders
			.filter((reminder) => reminder.reminderId.startsWith(value))
			.map((reminder) => ({
				name: `${reminder.reminderId} - ${
					reminder.description.length > 80
						? `${reminder.description.substr(0, 80)}...`
						: reminder.description.substr(0, 80)
				}`,
				value: reminder.reminderId,
			}));

		if (matches.length > 25) matches = matches.slice(0, 24);

		await int.respond(matches);
	},
	async execute(client: Client, int: ChatInputCommandInteraction) {
		const subcommand = int.options.getSubcommand();

		const subcommandData = (await import(`./reminders/${subcommand}`)).default;

		await subcommandData(client, int);
	},
} as Command;

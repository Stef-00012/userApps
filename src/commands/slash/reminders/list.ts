import type { Client } from "&/DiscordClient";
import { and, eq } from "drizzle-orm";
import ms from "enhanced-ms";
import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	await int.deferReply({
		flags: MessageFlags.Ephemeral,
	});

	const remindersSchema = client.dbSchema.reminders;

	const userRemiders =
		(await client.db.query.reminders.findMany({
			where: and(eq(remindersSchema.userId, int.user.id)),
		})) || [];

	if (!userRemiders || !userRemiders.length)
		return await int.editReply({
			content: "You have no reminders",
		});

	const remindersString = userRemiders
		.map((reminder) => {
			const lastRun = new Date(reminder.lastRun)
			const nextRun = new Date(reminder.date || lastRun.getTime() + reminder.interval)
			const timeUnix = Math.floor(nextRun.getTime() / 1000);

			const repeatAmount = reminder.repeat ?? 1
			const repetitions = reminder.repetitions ?? 0

			return `[\`${reminder.reminderId}\`] | ${(reminder.date || repeatAmount === 1) ? "" : "Next Run: "}<t:${timeUnix}:R> - ${reminder.description}${(reminder.date || repeatAmount === 1) ? "" : ` | Repeated every ${ms(reminder.interval, {
				shortFormat: true
			})} (${repeatAmount === 0 ? "Unlimited" : `${repetitions}/${repeatAmount}`} runs)`}`;
		})
		.join("\n- ");

	const embed = new EmbedBuilder()
		.setTitle("Your reminders")
		.setDescription(
			remindersString.length > 3995
				? `- ${remindersString.substr(0, 3995)}...`
				: `- ${remindersString}`,
		);

	await int.editReply({
		embeds: [embed],
	});
}

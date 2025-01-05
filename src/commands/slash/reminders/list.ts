import { type ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import type { Client } from "../../../structures/DiscordClient";
import { and, eq } from "drizzle-orm";

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
			const timeUnix = Math.floor(new Date(reminder.date).getTime() / 1000);

			return `[\`${reminder.reminderId}\`] | <t:${timeUnix}:R> - ${reminder.description}`;
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

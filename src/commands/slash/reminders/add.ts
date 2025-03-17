import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import ms from "enhanced-ms";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const time = int.options.getString("time", true);
	const reason = int.options.getString("reason", true);
	const repeatAmount = int.options.getInteger("repeat") ?? 1;

	const msTime: number = ms(time);

	if (!msTime || msTime < 30000)
		return await int.reply({
			content: "Invalid time",
			flags: MessageFlags.Ephemeral,
		});

	let reminderId = randomUUID().slice(0, 8);

	await int.deferReply({
		flags: MessageFlags.Ephemeral,
	});

	let existsReminderWithId = await checkId(client, int, reminderId);

	while (existsReminderWithId) {
		reminderId = randomUUID().slice(0, 8);

		existsReminderWithId = await checkId(client, int, reminderId);
	}

	const remindersSchema = client.dbSchema.reminders;

	await client.db.insert(remindersSchema).values({
		userId: int.user.id,
		reminderId,
		description: reason,
		lastRun: new Date().toISOString(),
		interval: msTime,
		repeat: repeatAmount
	});

	return await int.editReply({
		content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reason}`,
	});
}

async function checkId(
	client: Client,
	int: ChatInputCommandInteraction,
	reminderId: string,
) {
	const remindersSchema = client.dbSchema.reminders;

	const existingReminderWithid = await client.db.query.reminders.findFirst({
		where: and(
			eq(remindersSchema.reminderId, reminderId),
			eq(remindersSchema.userId, int.user.id),
		),
	});

	if (existingReminderWithid) return true;

	return false;
}

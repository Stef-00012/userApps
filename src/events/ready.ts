import axios, { type AxiosError } from "axios";
import type { Client } from "&/DiscordClient";
import packageJson from "../../package.json";
import { EmbedBuilder } from "discord.js";
import { and, eq } from "drizzle-orm";
import Commands from "@/commands";
import config from "$config";

export default async function (client: Client) {
	console.log(
		`\x1b[32mThe app is online (logged as ${client.user?.tag})\x1b[0m`,
	);

	const remindersSchema = client.dbSchema.reminders;

	checkReminders()

	setInterval(checkReminders, 30000);

	async function checkReminders() {
		const reminders = await client.db.query.reminders.findMany();

		for (const reminder of reminders) {
			const lastRun = new Date(reminder.lastRun)
			const nextRun = new Date(reminder.date || lastRun.getTime() + reminder.interval)
			let reminderRepetitions = reminder.repetitions ?? 0
			const repeatAmount = reminder.repeat ?? 1

			if (Date.now() > nextRun.getTime()) {
				try {
					const user = await client.users.fetch(reminder.userId);

					if (!user) {
						return await client.db
							.delete(remindersSchema)
							.where(
								and(
									eq(remindersSchema.reminderId, reminder.reminderId),
									eq(remindersSchema.userId, reminder.userId),
								),
							);
					}

					const embed = new EmbedBuilder()
						.setTitle("Reminder")
						.setDescription(reminder.description);

					await user.send({
						embeds: [embed],
					});

					reminderRepetitions++;

					if (repeatAmount > 0 && reminderRepetitions >= repeatAmount) return await client.db
						.delete(remindersSchema)
						.where(
							and(
								eq(remindersSchema.reminderId, reminder.reminderId),
								eq(remindersSchema.userId, reminder.userId),
							),
						);

					await client.db
						.update(client.dbSchema.reminders)
						.set({
							repetitions: reminderRepetitions,
							lastRun: new Date().toISOString()
						})
						.where(
							and(
								eq(client.dbSchema.reminders.userId, reminder.userId),
								eq(client.dbSchema.reminders.reminderId, reminder.reminderId)
							)
						)
				} catch (e) {
					console.log(e);

					await client.db
						.delete(remindersSchema)
						.where(
							and(
								eq(remindersSchema.reminderId, reminder.reminderId),
								eq(remindersSchema.userId, reminder.userId),
							),
						);
				}
			}
		}
	}

	const commands = await client.application?.commands.fetch();

	try {
		await axios.put(
			`https://discord.com/api/v10/applications/${client.user?.id}/commands`,
			Commands,
			{
				headers: {
					Authorization: `Bot ${config.token}`,
					"Content-Type": "application/json; charset=UTF-8",
					"User-Agent": `DiscordBot (discord.js, ${packageJson.dependencies["discord.js"]} (modified))`,
				},
			},
		);
	} catch (err) {
		const error = err as AxiosError;

		console.error(JSON.stringify(error.response?.data, null, 2));
	}

	if (!commands || commands.size === 0) {
		Bun.write(`${__dirname}/../data/permissions/commandPermissions.json`, "{}");
	}
}

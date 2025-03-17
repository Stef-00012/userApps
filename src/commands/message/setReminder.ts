import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import ms from "enhanced-ms";
import {
	ButtonStyle,
	MessageFlags,
	ModalBuilder,
	ButtonBuilder,
	TextInputStyle,
	TextInputBuilder,
	ActionRowBuilder,
	type ModalSubmitInteraction,
	type MessageContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Set as Reminder",
	requires: [],

	async execute(client: Client, int: MessageContextMenuCommandInteraction) {
		const modal = new ModalBuilder()
			.setTitle("Set as Reminder")
			.setCustomId("setAsReminder");

		const timeInput = new TextInputBuilder()
			.setLabel("Time")
			.setPlaceholder("1d, 20m, 30s etc.")
			.setCustomId("time")
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
			.setMinLength(2);

		const typeInput = new TextInputBuilder()
			.setLabel("Type")
			.setPlaceholder('"content" (default) or "url"')
			.setCustomId("type")
			.setStyle(TextInputStyle.Short)
			.setRequired(false)
			.setMinLength(3)
			.setMaxLength(7);

		const repeatAmount = new TextInputBuilder()
			.setLabel("Repeat")
			.setPlaceholder("How many times repeat this reminder, 0 = unlimited")
			.setCustomId("repeat")
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
			.setMinLength(1)
			.setValue("1");

		const timeRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
			timeInput,
		]);
		const typeRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
			typeInput,
		]);
		const repeatAmountRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
			repeatAmount
		])

		modal.addComponents([timeRow, typeRow, repeatAmountRow]);

		await int.showModal(modal);

		await int
			.awaitModalSubmit({
				filter: (interaction) =>
					interaction.customId === "setAsReminder" &&
					interaction.user.id === int.user.id,
				time: 60e3,
			})
			.then(async (mainModalInteraction) => {
				const time = mainModalInteraction.fields.getTextInputValue("time");
				let type = mainModalInteraction.fields.getTextInputValue("type");
				const repeat = Number.parseInt(mainModalInteraction.fields.getTextInputValue("repeat"));

				if (["content", "url"].every((x) => type !== x)) type = "content";

				const msTime: number = ms(time);

				if (Number.isNaN(repeat)) return await mainModalInteraction.reply({
					content: "Repeat must be a number",
					flags: MessageFlags.Ephemeral,
				});

				if (!msTime || msTime < 30000)
					return await mainModalInteraction.reply({
						content: "Invalid time",
						flags: MessageFlags.Ephemeral,
					});

				if (type === "content") {
					if (
						!int.targetMessage?.content ||
						int.targetMessage?.content?.length <= 0
					)
						return await mainModalInteraction.reply({
							content: "This message has no content",
							flags: MessageFlags.Ephemeral,
						});

					const reminderId = await generateReminderId(
						client,
						mainModalInteraction,
					);

					const modifyButton = new ButtonBuilder()
						.setLabel("Modify content")
						.setCustomId("reminder_modify")
						.setStyle(ButtonStyle.Secondary);

					const saveButton = new ButtonBuilder()
						.setLabel("Save Reminder")
						.setCustomId("reminder_save")
						.setStyle(ButtonStyle.Success);

					const buttonsRow =
						new ActionRowBuilder<ButtonBuilder>().addComponents([
							modifyButton,
							saveButton,
						]);

					const mainModalReply = await mainModalInteraction.reply({
						content: "Do you want to save or modify the reminder content?",
						components: [buttonsRow],
						flags: MessageFlags.Ephemeral,
						fetchReply: true,
					});

					const buttonCollector =
						mainModalReply.createMessageComponentCollector({
							time: 60e3,
						});

					buttonCollector.on("collect", async (buttonInteraction) => {
						const reminder = int.targetMessage.content;

						if (buttonInteraction.customId === "reminder_save") {
							await buttonInteraction.deferUpdate();

							await addReminder(
								client,
								mainModalInteraction,
								reminder,
								msTime,
								reminderId,
								repeat
							);

							return await buttonInteraction.editReply({
								content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reminder}`,
								components: [],
							});
						}

						const contentModal = new ModalBuilder()
							.setTitle("Modify Reminder Content?")
							.setCustomId("modifyReminderContent");

						const reminderInput = new TextInputBuilder()
							.setLabel("Reminder")
							.setCustomId("reminder")
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true)
							.setMaxLength(900)
							.setMinLength(1)
							.setValue(int.targetMessage.content.substr(0, 900));

						const reminderRow =
							new ActionRowBuilder<TextInputBuilder>().addComponents([
								reminderInput,
							]);

						contentModal.addComponents([reminderRow]);

						await buttonInteraction.showModal(contentModal);

						await buttonInteraction
							.awaitModalSubmit({
								filter: (interaction) =>
									interaction.customId === "modifyReminderContent",
								time: 60e3,
							})
							.then(async (contentModalInteraction) => {
								const reminder =
									contentModalInteraction.fields.getTextInputValue("reminder");

								await contentModalInteraction.deferReply({
									flags: MessageFlags.Ephemeral,
								});

								await addReminder(
									client,
									contentModalInteraction,
									reminder,
									msTime,
									reminderId,
									repeat
								);

								return await contentModalInteraction.editReply({
									content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reminder}`,
								});
							});
					});

					buttonCollector.on("end", (_, reason) => {
						if (reason === "time") {
							const disabledSaveButton = saveButton.setDisabled(true);
							const disabledModifyButton = modifyButton.setDisabled(true);

							const disabledRow =
								new ActionRowBuilder<ButtonBuilder>().addComponents([
									disabledModifyButton,
									disabledSaveButton,
								]);

							try {
								return mainModalInteraction.editReply({
									content:
										"~~Do you want to save or modify the reminder content?~~\nYou took too long to reply",
									components: [disabledRow],
								});
							} catch (e) {}
						}
					});

					return;
				}

				const reminder = int.targetMessage.url;

				const reminderId = await generateReminderId(
					client,
					mainModalInteraction,
				);

				await mainModalInteraction.deferReply({
					flags: MessageFlags.Ephemeral,
				});

				await addReminder(
					client,
					mainModalInteraction,
					reminder,
					msTime,
					reminderId,
					repeat
				);

				return await mainModalInteraction.editReply({
					content: `Successfully set the reminder with id \`${reminderId}\` and description\n> ${reminder}`,
				});
			});
	},
} as Command;

async function checkId(
	client: Client,
	int: ModalSubmitInteraction,
	reminderId: string,
): Promise<boolean> {
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

async function generateReminderId(
	client: Client,
	int: ModalSubmitInteraction,
): Promise<string> {
	let reminderId = randomUUID().slice(0, 8);

	let existsReminderWithId = await checkId(client, int, reminderId);

	while (existsReminderWithId) {
		reminderId = randomUUID().slice(0, 8);

		existsReminderWithId = await checkId(client, int, reminderId);
	}

	return reminderId;
}

async function addReminder(
	client: Client,
	int: ModalSubmitInteraction,
	reminder: string,
	time: number,
	reminderId: string,
	repeat?: number,
): Promise<void> {
	const remindersSchema = client.dbSchema.reminders;

	await client.db.insert(remindersSchema).values({
		userId: int.user.id,
		reminderId,
		description: reminder,
		lastRun: new Date().toISOString(),
		interval: time,
		repeat
	});
}

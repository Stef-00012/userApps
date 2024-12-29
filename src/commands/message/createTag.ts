import {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	type MessageContextMenuCommandInteraction,
} from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "Save as Tag",
	requires: [],

	async execute(client: Client, int: MessageContextMenuCommandInteraction) {
		if (
			int.targetMessage.content.length <= 0 &&
			int.targetMessage.embeds.length <= 0
		)
			return await int.reply({
				content: "This message has no content",
				ephemeral: true,
			});

		if (int.targetMessage?.content?.length > 0) {
			const modal = new ModalBuilder()
				.setTitle("Create a Tag")
				.setCustomId("createTag");

			const nameOption = new TextInputBuilder()
				.setCustomId("name")
				.setLabel("Name")
				.setMinLength(1)
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setPlaceholder(int.targetMessage.content.split(" ")[0].substr(0, 25));

			const contentOption = new TextInputBuilder()
				.setCustomId("content")
				.setLabel("Content")
				.setMinLength(1)
				.setRequired(true)
				.setStyle(TextInputStyle.Paragraph)
				.setValue(int.targetMessage.content.substr(0, 2048));

			const nameRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
				nameOption,
			]);

			const contentRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
				[contentOption],
			);

			modal.addComponents([nameRow, contentRow]);

			await int.showModal(modal);

			await int
				.awaitModalSubmit({
					filter: (interaction) =>
						interaction.customId === "createTag" &&
						interaction.user.id === int.user.id,
					time: 60e3,
				})
				.then(async (interaction) => {
					const tagName = interaction.fields.getTextInputValue("name");
					const tagContent = interaction.fields.getTextInputValue("content");

					const tagData = {
						content: tagContent,
						embeds:
							int.targetMessage?.embeds?.map((embed) => embed.data) || null,
					};

					const tagsSchema = client.dbSchema.tags;

					await client.db
						.insert(tagsSchema)
						.values({
							id: int.user.id,
							name: tagName,
							data: JSON.stringify(tagData),
						})
						.onConflictDoUpdate({
							target: [tagsSchema.id, tagsSchema.name],
							set: {
								name: tagName,
								data: JSON.stringify(tagData),
							},
						});

					return await interaction.reply({
						content: `Successfully created/updated the tag "${tagName}" with${
							tagData.embeds?.length > 0
								? ` ${tagData.embeds.length} embeds and`
								: ""
						} the content:\n>>> ${
							tagContent.length >= 2000 - 62 - tagName.length
								? `${tagContent.substr(0, 2000 - 62 - tagName.length)}...`
								: tagContent
						}`,
						ephemeral: true,
					});
				});
		} else {
			const modal = new ModalBuilder()
				.setTitle("Create a Tag")
				.setCustomId("createTag");

			const nameOption = new TextInputBuilder()
				.setCustomId("name")
				.setLabel("Name")
				.setMinLength(1)
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setPlaceholder(int.targetMessage.content.split(" ")[0].substr(0, 25));

			const nameRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
				nameOption,
			]);

			modal.addComponents([nameRow]);

			await int.showModal(modal);

			await int
				.awaitModalSubmit({
					filter: (interaction) =>
						interaction.customId === "createTag" &&
						interaction.user.id === int.user.id,
					time: 60e3,
				})
				.then(async (interaction) => {
					const tagName = interaction.fields.getTextInputValue("name");
					const tagData = {
						content: int.targetMessage?.content || null,
						embeds:
							int.targetMessage?.embeds?.map((embed) => embed.data) || null,
					};

					const tagsSchema = client.dbSchema.tags;

					await client.db
						.insert(tagsSchema)
						.values({
							id: int.user.id,
							name: tagName,
							data: JSON.stringify(tagData),
						})
						.onConflictDoUpdate({
							target: tagsSchema.name,
							set: {
								name: tagName,
								data: JSON.stringify(tagData),
							},
						});

					await interaction.reply({
						content: `Successfully created/updated the tag "${tagName}" with ${tagData.embeds.length} embeds`,
					});
				});
		}
	},
} as Command;

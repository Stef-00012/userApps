import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import {
	ButtonStyle,
	ModalBuilder,
	EmbedBuilder,
	MessageFlags,
	ButtonBuilder,
	TextInputStyle,
	ActionRowBuilder,
	TextInputBuilder,
	type ChatInputCommandInteraction,
	type HexColorString,
	type EmbedField,
} from "discord.js";

export default {
	name: "embed",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const embedTitle = int.options.getString("title") ?? null;
		const embedDescription = int.options.getString("description") ?? null;
		const embedURL = int.options.getString("url") ?? null;
		const embedTimestamp = int.options.getBoolean("timestamp") ?? false;
		const embedColor = int.options.getString("color") ?? null;
		const embedFooterText = int.options.getString("footer-text") ?? null;
		const embedFooterIcon = int.options.getString("footer-icon") ?? null;
		const embedImage = int.options.getString("image") ?? null;
		const embedThumbnail = int.options.getString("thumbnail") ?? null;
		const embedAuthorName = int.options.getString("author-name") ?? null;
		const embedAuthorIcon = int.options.getString("author-icon") ?? null;
		const embedFields = int.options.getBoolean("fields") ?? false;
		const embedJSONString = int.options.getString("json") ?? "{}";
		let embedJSON = {};

		try {
			embedJSON = JSON.parse(embedJSONString) || {};
		} catch (e) {
			return await int.reply({
				content: "Invalid JSON",
				flags: MessageFlags.Ephemeral,
			});
		}

		const hexCodeRegex = /^([A-Fa-f0-9]{6})$/;

		let embed = new EmbedBuilder();

		if (embedTitle) embed.setTitle(embedTitle);
		if (embedDescription) embed.setDescription(embedDescription);
		if (embedURL) embed.setURL(embedURL);
		if (embedTimestamp) embed.setTimestamp();
		if (embedColor && hexCodeRegex.test(embedColor))
			embed.setColor(embedColor as HexColorString);
		if (embedFooterText || (embedFooterText && embedFooterIcon))
			embed.setFooter({
				text: embedFooterText,
				iconURL: embedFooterIcon ?? undefined,
			});
		if (embedImage) embed.setImage(embedImage);
		if (embedThumbnail) embed.setThumbnail(embedThumbnail);
		if (embedAuthorName || (embedAuthorName && embedAuthorIcon))
			embed.setAuthor({
				name: embedAuthorName,
				iconURL: embedAuthorIcon ?? undefined,
			});

		if (!embedFields) {
			embed = EmbedBuilder.from({
				...embed.toJSON(),
				...embedJSON,
			});

			try {
				return await int.reply({
					embeds: [embed],
				});
			} catch (e) {
				return await int.reply({
					content: "I'm unable to send this embed, check the console",
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		const fields: Array<EmbedField> = [];

		const addFieldButton = new ButtonBuilder()
			.setLabel("Add Field")
			.setStyle(ButtonStyle.Success)
			.setCustomId("addField");

		const clearFieldsButton = new ButtonBuilder()
			.setLabel("Clear Fields")
			.setStyle(ButtonStyle.Danger)
			.setCustomId("clearFields");

		const sendButton = new ButtonBuilder()
			.setLabel("Send")
			.setStyle(ButtonStyle.Secondary)
			.setCustomId("send");

		const fieldButtonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			[addFieldButton, clearFieldsButton, sendButton],
		);

		const msg = await int.reply({
			components: [fieldButtonsRow],
			flags: MessageFlags.Ephemeral,
		});

		const buttonCollector = msg.createMessageComponentCollector({
			filter: (inter) =>
				["addField", "clearFields", "send"].includes(inter.customId),
			time: 60e3 * 10,
		});

		buttonCollector.on("collect", async (inter) => {
			if (inter.customId === "send") {
				buttonCollector.stop("sent");

				embed.setFields(fields);

				embed = EmbedBuilder.from({
					...embed.toJSON(),
					...embedJSON,
				});

				try {
					return await inter.reply({
						embeds: [embed],
					});
				} catch (e) {
					return await int.reply({
						content: "I'm unable to send this embed, check the console",
						flags: MessageFlags.Ephemeral,
					});
				}
			}

			if (inter.customId === "clearFields") embed.setFields([]);

			if (inter.customId === "addField") {
				const fieldModal = new ModalBuilder()
					.setCustomId("addField")
					.setTitle("Add a field");

				const fieldName = new TextInputBuilder()
					.setCustomId("name")
					.setLabel("Field Name")
					.setMaxLength(256)
					.setRequired(true)
					.setStyle(TextInputStyle.Paragraph);

				const fieldValue = new TextInputBuilder()
					.setCustomId("value")
					.setLabel("Field Value")
					.setMaxLength(1024)
					.setRequired(true)
					.setStyle(TextInputStyle.Paragraph);

				const fieldNameRow =
					new ActionRowBuilder<TextInputBuilder>().addComponents([fieldName]);

				const fieldValueRow =
					new ActionRowBuilder<TextInputBuilder>().addComponents([fieldValue]);

				fieldModal.addComponents([fieldNameRow, fieldValueRow]);

				await inter.showModal(fieldModal);

				await inter
					.awaitModalSubmit({
						filter: (interaction) => interaction.customId === "addField",
						time: 60e3 * 5,
					})
					.then(async (interaction) => {
						if (!interaction.isFromMessage())
							return interaction.reply({
								content: "Something went wrong...",
								flags: MessageFlags.Ephemeral,
							});

						const fieldName = interaction.fields.getTextInputValue("name");
						const fieldValue = interaction.fields.getTextInputValue("value");

						fields.push({
							name: fieldName,
							value: fieldValue,
							inline: false,
						});

						if (fields.length === 25) {
							const disabledAddRow =
								new ActionRowBuilder<ButtonBuilder>().addComponents([
									addFieldButton.setDisabled(true),
									clearFieldsButton,
									sendButton,
								]);

							return await interaction.update({
								content: `Successfully added the field (${fields.length}/25)`,
								components: [disabledAddRow],
							});
						}

						return await interaction.update({
							content: `Successfully added the field (${fields.length}/25)`,
						});
					});
			}
		});
	},
} as Command;

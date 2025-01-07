import type { Client } from "&/DiscordClient";
import type { Tag, TagData } from "?/tag";
import { and, eq } from "drizzle-orm";
import {
	ButtonStyle,
	EmbedBuilder,
	ModalBuilder,
	MessageFlags,
	ButtonBuilder,
	TextInputStyle,
	TextInputBuilder,
	ActionRowBuilder,
	type ChatInputCommandInteraction,
	type HexColorString,
	type EmbedField,
} from "discord.js";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	await int.deferReply({
		flags: MessageFlags.Ephemeral,
	});

	const tagName = int.options.getString("name", true);
	const removeEmbedIndex = int.options.getInteger("remove-index");

	const tagsSchema = client.dbSchema.tags;

	const tag = (await client.db.query.tags.findFirst({
		where: and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
	})) as Tag | undefined;

	let existingTagData: TagData = {};

	if (tag) existingTagData = JSON.parse(tag.data);

	const tagData: TagData = {
		content: existingTagData?.content || null,
		embeds: existingTagData?.embeds || null,
	};

	if (removeEmbedIndex && !tag)
		return await int.editReply({
			content: "This tag doesn't exist",
		});

	if (removeEmbedIndex && (!tagData?.embeds || tagData?.embeds?.length <= 0))
		return await int.editReply({
			content: "This message already has no embeds",
		});

	if (!tagData.embeds) tagData.embeds = [];

	if (!removeEmbedIndex && tagData?.embeds?.length >= 25)
		return await int.editReply({
			content: "You reached the embed limit for this tag",
		});

	if (removeEmbedIndex && (removeEmbedIndex < 1 || removeEmbedIndex > 25))
		return await int.editReply({
			content: "Embed index must be between 1 and 25",
		});

	if (removeEmbedIndex && tagData?.embeds?.length < removeEmbedIndex)
		return await int.editReply({
			content: `No embed exists at the index ${removeEmbedIndex}`,
		});

	if (removeEmbedIndex) {
		tagData.embeds = tagData.embeds.filter(
			(_embed, index) => index !== removeEmbedIndex - 1,
		);

		if (
			(!tagData?.content || tagData?.content.length <= 0) &&
			(!tagData?.embeds || tagData?.embeds.length <= 0)
		)
			return await int.editReply({
				content: "A tag can not be empty",
			});

		await client.db
			.update(tagsSchema)
			.set({
				data: JSON.stringify(tagData),
			})
			.where(and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)));

		return await int.editReply({
			content: `Successfully removed the embed at the index ${removeEmbedIndex}`,
		});
	}

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
		embedJSON = JSON.parse(embedJSONString);
	} catch (e) {
		return await int.editReply({
			content: "Invalid JSON",
		});
	}

	let embed = new EmbedBuilder();

	if (embedTitle) embed.setTitle(embedTitle);
	if (embedDescription) embed.setDescription(embedDescription);
	if (embedURL) embed.setURL(embedURL);
	if (embedTimestamp) embed.setTimestamp();
	if (embedColor) embed.setColor(embedColor as HexColorString);
	if (embedFooterText || (embedFooterText && embedFooterIcon))
		embed.setFooter({
			text: embedFooterText,
			iconURL: embedFooterIcon || undefined,
		});
	if (embedImage) embed.setImage(embedImage);
	if (embedThumbnail) embed.setThumbnail(embedThumbnail);
	if (embedAuthorName || (embedAuthorName && embedAuthorIcon))
		embed.setAuthor({
			name: embedAuthorName,
			iconURL: embedAuthorIcon || undefined,
		});

	if (!embedFields) {
		embed = EmbedBuilder.from({
			...embed.toJSON(),
			...embedJSON,
		});

		try {
			await int.editReply({
				embeds: [embed],
			});

			if (!tagData.embeds) tagData.embeds = [];

			tagData.embeds.push(embed.data);

			if (tag) {
				return await client.db
					.update(tagsSchema)
					.set({
						data: JSON.stringify(tagData),
					})
					.where(
						and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
					);
			}

			return await client.db.insert(tagsSchema).values({
				name: tagName,
				id: int.user.id,
				data: JSON.stringify(tagData),
			});
		} catch (e) {
			console.log(e);

			return await int.editReply({
				content: "I'm unable to send this embed, check the console",
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

	const saveButton = new ButtonBuilder()
		.setLabel("Save")
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("save");

	const fieldButtonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
		addFieldButton,
		clearFieldsButton,
		saveButton,
	]);

	const msg = await int.editReply({
		components: [fieldButtonsRow],
	});

	const buttonCollector = msg.createMessageComponentCollector({
		filter: (inter) =>
			["addField", "clearFields", "save"].includes(inter.customId),
		time: 60e3 * 10,
	});

	buttonCollector.on("collect", async (inter) => {
		if (inter.customId === "save") {
			buttonCollector.stop("saved");

			embed.setFields(fields);

			embed = EmbedBuilder.from({
				...embed.toJSON(),
				...embedJSON,
			});

			try {
				await inter.reply({
					content: "Sucessfully added this embed to the tag:",
					embeds: [embed],
					flags: MessageFlags.Ephemeral,
				});

				if (!tagData.embeds) tagData.embeds = [];

				tagData.embeds.push(embed.data);

				if (tag) {
					return await client.db
						.update(tagsSchema)
						.set({
							data: JSON.stringify(tagData),
						})
						.where(
							and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
						);
				}

				return await client.db.insert(tagsSchema).values({
					name: tagName,
					id: int.user.id,
					data: JSON.stringify(tagData),
				});
			} catch (e) {
				console.log(e);

				return await int.editReply({
					content:
						"I'm unable to send this embed or to save the database, check the console",
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
						inline: true,
					});

					if (fields.length === 25) {
						const disabledAddRow =
							new ActionRowBuilder<ButtonBuilder>().addComponents([
								addFieldButton.setDisabled(true),
								clearFieldsButton,
								saveButton,
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
}

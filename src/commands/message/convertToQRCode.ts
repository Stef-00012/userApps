import {
	MessageFlags,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	AttachmentBuilder,
	type MessageContextMenuCommandInteraction,
} from "discord.js";
import qrcode from "qrcode-terminal";
import axios from "axios";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";

export default {
	name: "Convert to QR Code",
	requires: [],

	async execute(client: Client, int: MessageContextMenuCommandInteraction) {
		if (int.targetMessage.content.length <= 0)
			return await int.reply({
				content: "This message has no content",
				flags: MessageFlags.Ephemeral,
			});

		const modal = new ModalBuilder()
			.setTitle("Conert to QR Code")
			.setCustomId("convertToQRCode");

		const typeInput = new TextInputBuilder()
			.setLabel("Type")
			.setPlaceholder("text or image, default = text")
			.setCustomId("type")
			.setStyle(TextInputStyle.Short)
			.setRequired(false);

		const textInput = new TextInputBuilder()
			.setLabel("Text")
			.setCustomId("text")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setMaxLength(900)
			.setMinLength(1)
			.setValue(int.targetMessage.content.substr(0, 900));

		const typeRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
			typeInput,
		]);

		const textRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
			textInput,
		]);

		modal.addComponents([textRow, typeRow]);

		await int.showModal(modal);

		await int
			.awaitModalSubmit({
				filter: (interaction) =>
					interaction.customId === "convertToQRCode" &&
					interaction.user.id === int.user.id,
				time: 60e3,
			})
			.then(async (inter) => {
				let type = inter.fields.getTextInputValue("type");
				const text = inter.fields.getTextInputValue("text");

				if (!["text", "image"].includes(type?.toLowerCase())) type = "text";

				switch (type) {
					case "text": {
						qrcode.generate(
							text,
							{
								small: true,
							},
							(code: string) => {
								inter.reply({
									content: `\`\`\`txt\n${code}\n\`\`\``,
								});
							},
						);

						break;
					}

					case "image": {
						const encodedText = encodeURIComponent(text);

						const req = await axios.get(
							`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedText}`,
							{
								responseType: "arraybuffer",
							},
						);

						if (!req.data)
							return await inter.reply({
								content: "The API did not return any QR code",
								flags: MessageFlags.Ephemeral,
							});

						const attachment = new AttachmentBuilder(req.data);

						await inter.reply({
							files: [attachment],
						});

						break;
					}
				}
			});
	},
} as Command;

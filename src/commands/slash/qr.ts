import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import qrcode from "qrcode-terminal";
import axios from "axios";
import {
	MessageFlags,
	AttachmentBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "qr",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const text = int.options.getString("text", true);
		const type = int.options.getString("type") || "text";

		switch (type) {
			case "text": {
				qrcode.generate(
					text,
					{
						small: true,
					},
					(code) => {
						int.reply({
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
					return await int.reply({
						content: "The API did not return any QR code",
						flags: MessageFlags.Ephemeral,
					});

				const attachment = new AttachmentBuilder(req.data);

				await int.reply({
					files: [attachment],
				});

				break;
			}
		}
	},
} as Command;

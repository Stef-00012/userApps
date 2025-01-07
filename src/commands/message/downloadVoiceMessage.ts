import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import oggToMp3 from "$/oggToMp3";
import axios from "axios";
import os from "node:os";
import fs from "node:fs";
import {
	AttachmentBuilder,
	MessageFlags,
	type MessageContextMenuCommandInteraction,
} from "discord.js";

export default {
	name: "Download Voice Message",
	requires: [],

	async execute(_client: Client, int: MessageContextMenuCommandInteraction) {
		const tmpFolder = os.tmpdir();
		const tmpPath = `${tmpFolder}/downloadAudio.ogg`;
		const tmpPathOutput = `${tmpFolder}/downloadAudio.mp3`;

		if (!int.targetMessage.flags.has(MessageFlags.IsVoiceMessage))
			return int.reply({
				content: "This message is not a voice message",
				flags: MessageFlags.Ephemeral,
			});

		const attachment = int.targetMessage.attachments.first();

		if (!attachment)
			return int.reply({
				content: "This message has no files",
				flags: MessageFlags.Ephemeral,
			});

		await int.deferReply({
			flags: MessageFlags.Ephemeral,
		});

		const { data } = await axios.get(attachment.url, {
			responseType: "arraybuffer",
			headers: {
				"Content-Type": "audio/ogg",
			},
		});

		try {
			await Bun.write(tmpPath, data);

			await oggToMp3(tmpPath, tmpPathOutput);
		} catch (e) {
			console.log(e);

			return int.editReply({
				content: "Something went wrong while fetching the voice message...",
			});
		}

		const mp3Attachment = new AttachmentBuilder(tmpPathOutput, {
			name: "voice-message.mp3",
		});

		await int.editReply({
			files: [mp3Attachment],
		});

		fs.unlinkSync(tmpPath);
		fs.unlinkSync(tmpPathOutput);
	},
} as Command;

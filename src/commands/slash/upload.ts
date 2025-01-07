import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import streamToBlob from "stream-to-blob";
import config from "$config";
import path from "node:path";
import axios from "axios";
import fs from "node:fs";

export default {
	name: "upload",
	requires: ["zipline"],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		if (!config.zipline)
			return await int.reply({
				content: "Missing Zipline auth data",
			});

		const domain = config.zipline.url;
		const token = config.zipline.token;
		const chunkSize = config.zipline.chunkSize * 1024 * 1024;
		const maxFileSize = config.zipline.maxFileSize;

		const chunked = int.options.getBoolean("chunked") || false;
		const ephemeral = int.options.getBoolean("ephemeral") || false;
		let fileName = int.options.getString("filename");

		const attachment = int.options.getAttachment("file", true);
		if (!fileName) fileName = attachment.name;
		const filePath = path.join(__dirname, "../../tmp", fileName);

		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(path.dirname(filePath), {
				recursive: true,
			});
		}

		try {
			if (attachment.size > 95 * 1024 * 1024 && !chunked)
				return await int.reply({
					content: "Your file is too big, non-chunked files can be max 95mb",
					flags: MessageFlags.Ephemeral,
				});

			if (attachment.size > maxFileSize * 1024 * 1024)
				return await int.reply({
					content: `Your file is too big, max file size ${maxFileSize}mb`,
					flags: MessageFlags.Ephemeral,
				});

			await int.deferReply({
				flags: ephemeral ? MessageFlags.Ephemeral : undefined,
			});

			const response = await axios.get(attachment.url, {
				responseType: "arraybuffer",
			});

			Bun.write(filePath, response.data);

			await int.editReply({
				content: "File has been downloaded successfully, uploading...",
			});

			if (attachment.size < 95 * 1024 * 1024) {
				const file = fs.createReadStream(filePath);
				const form = new FormData();

				form.append(
					"file",
					await streamToBlob(file, attachment.contentType),
					fileName,
				);

				const uploadResponse = await axios.post(`${domain}/api/upload`, form, {
					headers: {
						Authorization: token,
						"content-type": "multipart/form-data",
						Format: "random",
						Embed: "true",
						"Original-Name": "true",
					},
				});

				await int.editReply({
					content: `[${fileName}](${uploadResponse.data.files}) has been uploaded\nURL: ${uploadResponse.data.files}`,
				});

				fs.unlinkSync(filePath);

				return;
			}

			const numChunks = Math.ceil(attachment.size / chunkSize);

			function generateRandomString() {
				return Math.random().toString(36).substring(2, 6);
			}

			const identifier = generateRandomString();

			for (let i = numChunks - 1; i >= 0; i--) {
				const start = i * chunkSize;
				const end = Math.min(start + chunkSize, attachment.size);
				const chunk = fs.createReadStream(filePath, {
					start,
					end,
				});
				const formData = new FormData();

				formData.append(
					"file",
					await streamToBlob(chunk, attachment.contentType),
					fileName,
				);

				axios
					.post(`${domain}/api/upload`, formData, {
						headers: {
							Authorization: token,
							"Content-Type": "multipart/form-data",
							"Content-Range": `bytes ${start}-${end - 1}/${attachment.size}`,
							"X-Zipline-Partial-Filename": fileName,
							"X-Zipline-Partial-Lastchunk": i === 0 ? "true" : "false",
							"X-Zipline-Partial-Identifier": identifier,
							"X-Zipline-Partial-Mimetype": attachment.contentType,
							Format: "random",
							Embed: "true",
							"Original-Name": "true",
						},
					})
					.then(async (response) => {
						if (response.data.files) {
							await int.editReply({
								content: `[${fileName}](${response.data.files}) has been uploaded\nURL: ${response.data.files}`,
							});

							fs.unlinkSync(filePath);
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		} catch (e) {
			console.error(e);

			await int.editReply({
				content: "Something went wrong...",
			});

			fs.unlinkSync(filePath);
		}
	},
} as Command;

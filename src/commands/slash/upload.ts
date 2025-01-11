import getZiplineFolders from "$/getZiplineFolders";
import { expirations, formats } from "#/zipline";
import uploadToZipline from "$/uploadToZipline";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import { Blob } from "node:buffer";
import config from "$config";
import axios from "axios";
import {
	type AutocompleteInteraction,
	MessageFlags,
	type ChatInputCommandInteraction,
} from "discord.js";
import type { ZiplineUploadConfig } from "?/zipline";

export default {
	name: "upload",
	requires: ["zipline"],

	async autocomplete(_client: Client, int: AutocompleteInteraction) {
		const option = int.options.getFocused(true);

		switch (option.name) {
			case "expiration": {
				let matches = expirations
					.map((match) => ({
						name: match,
						value: match,
					}))
					.filter((expiration) =>
						expiration.value
							?.toLowerCase()
							.startsWith(option.value.toLowerCase()),
					);

				if (matches.length > 25) matches = matches.slice(0, 24);

				return await int.respond(matches);
			}

			case "folder": {
				if (config.zipline?.version !== "v4") return await int.respond([]);

				const folders = (await getZiplineFolders()).map((folder) => ({
					name: folder.name,
					value: folder.id,
				}));

				let matches = folders.filter((folder) =>
					folder.name.toLowerCase().startsWith(option.value.toLowerCase()),
				);

				if (matches.length > 25) matches = matches.slice(0, 24);

				return await int.respond(matches);
			}
		}
	},

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		if (!config.zipline)
			return await int.reply({
				content: "Missing Zipline auth data",
			});

		const maxFileSize = config.zipline.maxFileSize;

		const chunked = int.options.getBoolean("chunked") || false;
		const ephemeral = int.options.getBoolean("ephemeral") || false;
		const attachment = int.options.getAttachment("file");
		const text = int.options.getString("text");
		const password = int.options.getString("password");
		const overrideDomain = int.options.getString("override-domain");
		const originalName = int.options.getBoolean("original-name");
		const expiration = int.options.getString(
			"expiration",
		) as ZiplineUploadConfig["expiration"];
		const maxViews = int.options.getInteger("max-views");
		const compression = int.options.getInteger("compression");
		const format = int.options.getString(
			"format",
		) as ZiplineUploadConfig["nameFormat"];
		const folder = int.options.getString("folder");
		const zeroWidthSpaces = int.options.getBoolean("zero-width-spaces");
		const embed = int.options.getBoolean("embed");
		let fileName = int.options.getString("filename");

		if (!text && !attachment)
			return int.reply({
				content: "You must include one of attachment or text",
				flags: MessageFlags.Ephemeral,
			});

		if (expiration && !expirations.includes(expiration as string))
			return int.reply({
				content: "Invalid Expiration",
				flags: MessageFlags.Ephemeral,
			});

		if (format && !formats.includes(format as string))
			return int.reply({
				content: "Invalid Format",
				flags: MessageFlags.Ephemeral,
			});

		let blob: Blob;

		await int.deferReply({
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		});

		const folders = await getZiplineFolders();

		if (folder && !folders.find((fold) => fold.id === folder))
			return await int.editReply({
				content: "Invalid Folder",
			});

		if (attachment) {
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

			if (!fileName) fileName = attachment.name;

			try {
				const response = await axios.get(attachment.url, {
					responseType: "arraybuffer",
				});

				await int.editReply({
					content: "File has been downloaded successfully, uploading...",
				});

				blob = new Blob([response.data], {
					type: response.headers["content-type"],
				});
			} catch {
				return int.editReply({
					content: "Something went wrong while downloading the file...",
				});
			}
		} else {
			blob = new Blob([text as string], {
				type: "text/plain",
			});
		}

		const fileData = await uploadToZipline(blob, {
			filename: fileName,
			compression,
			embed,
			maxViews,
			folder,
			originalName,
			overrideDomain,
			password,
			zeroWidthSpaces,
			text: !!text,
			nameFormat: format,
			expiration,
		});

		if (!fileData)
			return await int.editReply({
				content: "Failed to upload the file",
			});

		await int.editReply({
			content: `[${fileData.filename}](${fileData.url}) has been uploaded\nURL: ${fileData.url}`,
		});
	},
} as Command;

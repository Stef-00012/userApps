import { execSync, type ExecException } from "node:child_process";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export default {
	name: "console",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const cmd = int.options.getString("command", true);
		const ephemeral = int.options.getBoolean("personal") || false;

		await int.deferReply({
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		});

		const embed = new EmbedBuilder();

		const fields = [
			{
				name: "Command:",
				value: `\`\`\`ansi\n${cmd}\n\`\`\``,
			},
		];

		let output: string;

		try {
			output = execSync(cmd).toString().trim();
		} catch (e) {
			const err = e as ExecException;

			console.log(e);
			let error = err.toString().trim();

			if (error.length > 1000) {
				console.log(`\n\nError Message:\n${error}`);

				error = error.substr(0, 1000);
			}

			fields.push({
				name: "Error:",
				value: `\`\`\`ansi\n${error}\n\`\`\``,
			});

			embed.setFields(fields);

			return await int.editReply({
				embeds: [embed],
			});
		}

		if (output.length > 1000) {
			console.log(`\n\nStdout:\n${output}`);

			output = output.substr(0, 1000);
		}

		fields.push({
			name: "StdOut:",
			value: `\`\`\`ansi\n${output}\n\`\`\``,
		});

		embed.setFields(fields);

		await int.editReply({
			embeds: [embed],
		});
	},
} as Command;

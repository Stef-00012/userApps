import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import { execSync } from "node:child_process";

export default {
	name: "console",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const cmd = int.options.getString("command", true);
		const ephemeral = int.options.getBoolean("personal") || false;

		await int.deferReply({
			ephemeral,
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
			console.log(e)
			let error = e.toString().trim();

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

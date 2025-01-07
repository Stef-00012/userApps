import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import util from "node:util";
import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export default {
	name: "eval",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const code = int.options.getString("code", true);
		const ephemeral = int.options.getBoolean("personal") ?? false;

		const embed = new EmbedBuilder();

		await int.deferReply({
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		});

		const fields = [
			{
				name: "Input:",
				value:
					cleanEvalOutput(code).length > 1000
						? `\`\`\`js\n${cleanEvalOutput(code).substr(0, 1000)}...\n\`\`\``
						: `\`\`\`js\n${cleanEvalOutput(code)}\n\`\`\``,
			},
		];

		try {
			let evaluatedCode = await eval(code);

			if (
				typeof evaluatedCode !== "string" &&
				typeof evaluatedCode?.then === "function"
			) {
				evaluatedCode.then((res: string) => {
					evaluatedCode = res;
				});
			}

			if (typeof evaluatedCode !== "string") {
				evaluatedCode = util.inspect(evaluatedCode);

				fields.push({
					name: "Output:",
					value:
						cleanEvalOutput(evaluatedCode).length > 1000
							? `\`\`\`js\n${cleanEvalOutput(evaluatedCode).substr(
									0,
									1000,
								)}...\n\`\`\``
							: `\`\`\`js\n${cleanEvalOutput(evaluatedCode)}\n\`\`\``,
				});
			} else {
				fields.push({
					name: "Output:",
					value:
						evaluatedCode.length > 1000
							? `\`\`\`js\n${evaluatedCode.substr(0, 1000)}...\n\`\`\``
							: `\`\`\`js\n${evaluatedCode}\n\`\`\``,
				});
			}

			embed.setColor(0x078f12).setFields(fields);

			await int.editReply({
				embeds: [embed],
			});
		} catch (e) {
			const err = e as EvalError;

			let error = cleanEvalOutput(err);

			if (error.length > 1000) {
				console.log(e);

				error = error.substr(0, 1000);
			}
			fields.push({
				name: "Error:",
				value: `\`\`\`js\n${e}\n\`\`\``,
			});

			embed.setColor(0xc10000).setFields(fields);

			await int.editReply({
				embeds: [embed],
			});
		}
	},
} as Command;

function cleanEvalOutput(text: string | EvalError): string {
	if (typeof text === "string")
		return text
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`);

	return text as unknown as string;
}

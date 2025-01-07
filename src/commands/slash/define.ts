import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
// @ts-ignore
import ubdict from "@dmzoneill/urban-dictionary";
import type { Client } from "&/DiscordClient";
import replace from "string-replace-async";
import type { Command } from "?/command";

export default {
	name: "define",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const term = int.options.getString("term", true);
		await int.deferReply();

		try {
			const data = await ubdict.define(term);

			const wordRegex = /\[(.*?)\]/g;

			const definitionData = data[0];

			const definition = await replace(
				definitionData.definition,
				wordRegex,
				async (_, word) => {
					try {
						const wordDefinition = await ubdict.define(word);

						return `[${word}](${wordDefinition[0].permalink})`;
					} catch (e) {
						return word;
					}
				},
			);

			const example = await replace(
				definitionData.example,
				wordRegex,
				async (_, word) => {
					try {
						const wordDefinition = await ubdict.define(word);

						return `[${word}](${wordDefinition[0].permalink})`;
					} catch (e) {
						return word;
					}
				},
			);

			const embed = new EmbedBuilder()
				.setTitle(`Definition: ${term}`)
				.setURL(definitionData.permalink)
				.setTimestamp(new Date(definitionData.written_on))
				.setFooter({
					text: `By ${definitionData.author} | ${definitionData.defid}`,
				})
				.setFields([
					{
						name: "Definition:",
						value: definition,
					},
					{
						name: "Example:",
						value: example,
					},
					{
						name: "Votes",
						value: `${definitionData.thumbs_up} like${
							definitionData.thumbs_up > 1 ? "s" : ""
						} :+1: | ${definitionData.thumbs_down} like${
							definitionData.thumbs_down > 1 ? "s" : ""
						} :-1:`,
					},
				]);

			await int.editReply({
				embeds: [embed],
			});
		} catch (e) {
			await int.editReply({
				content: `No results found for "${term}"`,
			});
		}
	},
} as Command;

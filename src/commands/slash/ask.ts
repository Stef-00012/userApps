import { type ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import axios from "axios";

export default {
	name: "ask",
	requires: ["naviac"],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		if (!client.config.naviac) return await int.reply({
			content: "Missing N.A.V.I.A.C. auth data"
		})

		const question = int.options.getString("question", true);
		const ephemeral = int.options.getBoolean("personal") || false;

		await int.deferReply({
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		});

		try {
			const res = await axios.put(
				"https://naviac-api.onrender.com/generate-response",
				{
					text: question,
				},
				{
					auth: {
						username: client.config.naviac.username,
						password: client.config.naviac.token,
					},
				},
			);

			const prompt = `**Prompt**\n> ${question.split("\n").join("\n> ")}`;
			const response = res.data.response;

			const embed = new EmbedBuilder()
				.setTitle("N.A.V.I.A.C.'s response")
				.setDescription(prompt)
				.setFooter({
					text: `Requested by ${int.user.username} • A mini API interface for N.A.V.I.A.C.`,
				});

			const regex =
				/\[Image generated with the help of Pollinations AI's services\]\((.*?)\)/;

			const match = response.match(regex);

			if (match) {
				embed.setImage(match[1]).setFooter({
					text: `${embed.data.footer?.text} | Image generated with the help of Pollinations AI\'s services`,
					iconURL: "https://cdn.discordapp.com/avatars/975365560298795008/632ac9e6edf7517fa9378454c8600bdf.png?size=4096",
				});

				if (response.replace(regex, "").length > 0) {
					embed.setDescription(
						`${embed.data.description}\n\n**Response**\n${response.replace(
							regex,
							"",
						)}`,
					);
				} else {
					embed.setDescription(
						`${embed.data.description}\n\n**Response**\n\`[If there is no image, please wait as discord caches/loads it]\``,
					);
				}
			} else {
				embed
					.setDescription(
						`${embed.data.description}\n\n**Response**\n${response}`,
					)
					.setThumbnail(
						"https://cdn.discordapp.com/avatars/975365560298795008/632ac9e6edf7517fa9378454c8600bdf.png?size=4096",
					);
			}

			await int.editReply({
				embeds: [embed],
			});
		} catch (e) {
			if (e?.response?.status === 429)
				return await int.editReply({
					content: "You are being ratelimited",
				});

			if (e?.response?.status === 500)
				return await int.editReply({
					content: "The N.A.V.I.A.C. API is currently having issues",
				});

			if (e?.response?.status)
				return await int.editReply({
					content: `The N.A.V.I.A.C. API request failed with status ${e.response.status} (${e.response.statusText})`,
				});

			console.log(e);

			await int.editReply({
				content: "Something went wrong...",
			});
		}
	},
} as Command;

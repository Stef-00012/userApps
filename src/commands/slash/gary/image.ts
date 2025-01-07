import type { ChatInputCommandInteraction } from "discord.js";
import axios, { type AxiosError } from "axios";
import type { Client } from "&/DiscordClient";
import { EmbedBuilder } from "discord.js";

export default async function (
	_client: Client,
	int: ChatInputCommandInteraction,
) {
	await int.deferReply();

	try {
		const res = await axios.get("https://garybot.dev/api/gary");

		const url: string = res.data.url;

		const embed = new EmbedBuilder().setTitle("G A R Y").setImage(url);

		await int.editReply({
			embeds: [embed],
		});
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 429)
			return await int.editReply({
				content: "You are being ratelimited",
			});

		if (error?.response?.status === 500)
			return await int.editReply({
				content: "The Gary API is currently having issues",
			});

		if (error?.response?.status)
			return await int.editReply({
				content: `The Gary API request failed with status ${error.response.status} (${error.response.statusText})`,
			});

		console.log(error);

		await int.editReply({
			content: "Something went wrong...",
		});
	}
}

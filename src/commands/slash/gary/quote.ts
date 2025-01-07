import type { ChatInputCommandInteraction } from "discord.js";
import axios, { type AxiosError } from "axios";
import type { Client } from "&/DiscordClient";

export default async function (
	_client: Client,
	int: ChatInputCommandInteraction,
) {
	await int.deferReply();

	try {
		const res = await axios.get("https://garybot.dev/api/quote");

		const quote: string = res.data.quote;

		await int.editReply({
			content: `Here's your Gary's quote\n> ${quote}`,
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

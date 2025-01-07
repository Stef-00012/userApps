import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { PterodactylAPIServer } from "../../../../types/pterodactyl";
import axios, { type AxiosError } from "axios";
import type { Client } from "&/DiscordClient";
import { eq } from "drizzle-orm";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	await int.deferReply();

	const pteroSchema = client.dbSchema.ptero;

	const userPteroData = await client.db.query.ptero.findFirst({
		where: eq(pteroSchema.id, int.user.id),
	});

	if (!userPteroData)
		return await int.editReply({
			content: "Your Pterodactyl config are incorrect",
		});

	const panelUrl = userPteroData.panelUrl;
	const apiKey = userPteroData.apiKey;

	try {
		const res = await axios.get(`${panelUrl}/api/client`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});

		const data: Array<PterodactylAPIServer> = res.data.data;

		const servers = data
			.map(
				(server) =>
					`- ${server.attributes.name} [\`${server.attributes.identifier}\`]`,
			)
			.join("\n");

		const embed = new EmbedBuilder()
			.setTitle("Your servers")
			.setDescription(
				servers.length > 4096 ? `${servers.substr(0, 4093)}...` : servers,
			);

		await int.editReply({
			embeds: [embed],
		});
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 401)
			return await int.editReply({
				content: "Your API key is not valid",
			});

		console.log(error);

		await int.editReply({
			content: "Something went wrong...",
		});
	}
}

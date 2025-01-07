import type { ChatInputCommandInteraction } from "discord.js";
import axios, { type AxiosError } from "axios";
import type { Client } from "&/DiscordClient";
import { eq } from "drizzle-orm";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const id = int.options.getString("id");
	const command = int.options.getString("command");

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
		await axios.post(
			`${panelUrl}/api/client/servers/${id}/command`,
			{
				command,
			},
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);

		await int.editReply({
			content: `Successfully ran the command \`${command}\` on the server with ID \`${id}\``,
		});
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 401)
			return await int.editReply({
				content: "Your API key is not valid",
			});

		if (error?.response?.status === 502)
			return await int.editReply({
				content: "The server is offline",
			});

		console.log(error);

		await int.editReply({
			content: "Something went wrong...",
		});
	}
}

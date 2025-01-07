import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	let panelUrl = int.options.getString("url", true);
	const apiKey = int.options.getString("key", true);

	if (!panelUrl.startsWith("http://") && !panelUrl.startsWith("https://"))
		return await int.reply({
			content: "The provided panel URL is invalid",
			flags: MessageFlags.Ephemeral,
		});

	panelUrl = panelUrl.split("/").slice(0, 3).join("/");

	if (!apiKey.startsWith("ptlc_"))
		return await int.reply({
			content: "Invalid API key",
			flags: MessageFlags.Ephemeral,
		});

	await int.deferReply({
		flags: MessageFlags.Ephemeral,
	});

	const userPteroData = {
		panelUrl,
		apiKey,
	};

	const pteroSchema = client.dbSchema.ptero;

	await client.db
		.insert(pteroSchema)
		.values({
			id: int.user.id,
			...userPteroData,
		})
		.onConflictDoUpdate({
			target: pteroSchema.id,
			set: userPteroData,
		});

	await int.editReply({
		content: "Successfully saved your pterodactyl config",
	});
}

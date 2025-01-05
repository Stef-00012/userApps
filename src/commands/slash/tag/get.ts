import type { SendTagData, Tag, TagData } from "../../../types/tag";
import type { Client } from "../../../structures/DiscordClient";
import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import { and, eq } from "drizzle-orm";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const tagName = int.options.getString("name", true);
	const ephemeral = int.options.getBoolean("ephemeral") || false;

	const tagsSchema = client.dbSchema.tags;

	const existingTag = (await client.db.query.tags.findFirst({
		where: and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
	})) as Tag | undefined;

	if (!existingTag)
		return await int.reply({
			content: "This tag doesn't exist",
			flags: MessageFlags.Ephemeral,
		});

	const existingTagData: TagData = JSON.parse(existingTag.data);

	if (existingTagData?.embeds)
		existingTagData.embeds = existingTagData.embeds.filter(
			(embed) => Object.entries(embed).length > 0,
		);

	await int.reply({
		...(existingTagData as SendTagData),
		flags: ephemeral ? MessageFlags.Ephemeral : undefined,
	});
}

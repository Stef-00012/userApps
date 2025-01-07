import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Tag, TagData } from "?/tag";
import { and, eq } from "drizzle-orm";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const tagName = int.options.getString("name", true);
	const tagContent = int.options.getString("content") || null;
	const removeContent = int.options.getBoolean("remove") || false;

	const tagsSchema = client.dbSchema.tags;

	const existingTag = (await client.db.query.tags.findFirst({
		where: and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
	})) as Tag | undefined;

	let existingTagData: TagData = {};

	if (existingTag) existingTagData = JSON.parse(existingTag.data);

	const tagData: TagData = {
		content: removeContent ? null : tagContent || null,
		embeds: existingTagData?.embeds || null,
	};

	if (
		(!tagData.content || tagData.content?.length <= 0) &&
		(!tagData.embeds || tagData.embeds?.length <= 0)
	)
		return await int.reply({
			content: "A tag can not be empty",
			flags: MessageFlags.Ephemeral,
		});

	await client.db
		.insert(tagsSchema)
		.values({
			name: tagName,
			id: int.user.id,
			data: JSON.stringify(tagData),
		})
		.onConflictDoUpdate({
			target: [tagsSchema.id, tagsSchema.name],
			set: {
				data: JSON.stringify(tagData),
			},
		});

	await int.reply({
		content: `Successfully created/updated the tag "${tagName}"`,
		flags: MessageFlags.Ephemeral,
	});
}

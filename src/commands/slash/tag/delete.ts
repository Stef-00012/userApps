import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import { eq, and } from "drizzle-orm";
import type { Tag } from "?/tag";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const tagName = int.options.getString("name", true);

	const tagsSchema = client.dbSchema.tags;

	const existingTag = (await client.db.query.tags.findFirst({
		where: and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)),
	})) as Tag | undefined;

	if (!existingTag)
		return await int.reply({
			content: "This tag doesn't exist",
			flags: MessageFlags.Ephemeral,
		});

	await client.db
		.delete(tagsSchema)
		.where(and(eq(tagsSchema.id, int.user.id), eq(tagsSchema.name, tagName)));

	await int.reply({
		content: `Successfully deleted the tag \`${tagName}\``,
		flags: MessageFlags.Ephemeral,
	});
}

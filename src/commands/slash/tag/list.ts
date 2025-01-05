import type { Client } from "../../../structures/DiscordClient";
import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { Tag } from "../../../types/tag";
import { eq } from "drizzle-orm";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const tagsSchema = client.dbSchema.tags;

	const userTags =
		((await client.db.query.tags.findMany({
			where: eq(tagsSchema.id, int.user.id),
		})) as Array<Tag>) || [];

	if (userTags.length === 0)
		return await int.reply({
			content: "You have no tags",
			flags: MessageFlags.Ephemeral,
		});

	const tagsString = userTags.map((tag) => tag.name).join("\n- ");

	await int.reply({
		content: `Your tags are:\n- ${
			tagsString.length > 1950 ? `${tagsString.substr(0, 1950)}...` : tagsString
		}`,
		flags: MessageFlags.Ephemeral,
	});
}

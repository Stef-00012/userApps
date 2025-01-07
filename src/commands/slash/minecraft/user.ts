import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Player } from "?/minecraftPlayer";
import axios from "axios";

export default async function (
	_client: Client,
	int: ChatInputCommandInteraction,
) {
	const player = int.options.getString("player", true);

	await int.deferReply();

	try {
		const playerInfo = await axios.get(
			`https://starlightskins.lunareclipse.studio/info/user/${player}`,
		);

		const playerData = playerInfo.data as Player;

		const embedFields = [
			{
				name: "Skin",
				value: `[View Skin](${playerData.skinUrl})`,
				inline: true,
			},
		];

		if (playerData.processedSkinUrl)
			embedFields.push({
				name: "Processed Skin (32px -> 64px)",
				value: `[View Processed Skin](${playerData.processedSkinUrl})`,
				inline: true,
			});

		embedFields.push(
			{
				name: "Skin Type",
				value: playerData.skinType,
				inline: true,
			},
			{
				name: "Skin Texture Width",
				value: `${playerData.skinTextureWidth}`,
				inline: true,
			},
			{
				name: "Skin Texture Height",
				value: `${playerData.skinTextureHeight}`,
				inline: true,
			},
		);

		const embed = new EmbedBuilder()
			.setTitle(player)
			.addFields(embedFields)
			.setFooter({
				text: playerData.playerUUID,
			});

		await int.editReply({
			embeds: [embed],
		});
	} catch (e) {
		await int.editReply({
			content: "The user was not found",
		});
	}
}

import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { avaibleCropTypes } from "../../../data/constants/lunarEclypse";
import type { Client } from "../../../structures/DiscordClient";
import type { SkinType } from "../../../types/lunarEclypse";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const renderType = int.options.getString("render-type", true);
	const cropType = int.options.getString("crop-type", true);

	const skinType = int.options.getString("skin-type", false) as SkinType || "wide"
	
	const defaultSkin = skinType === "wide" ? "MHF_Steve" : "MHF_Alex"

	const skinUrl = int.options.getString("skin-url", false);
	const player = int.options.getString("player", false) || defaultSkin;

	const urlRegex = /^http:\/\/(.*)?|https:\/\/(.*)?$/;

	if (!avaibleCropTypes[renderType].includes(cropType))
		return await int.reply({
			content: "Invalid crop type",
			ephemeral: true,
		});

	if (skinUrl && !urlRegex.test(skinUrl)) return await int.reply({
		content: "This skin URL is not a valid URL",
		ephemeral: true
	});

	const urlParams = new URLSearchParams({
		skinType
	})

	if (skinUrl) urlParams.append("skinUrl", skinUrl)

	const url = `https://starlightskins.lunareclipse.studio/render/${renderType}/${player}/${cropType}?${urlParams.toString()}`;

	const embed = new EmbedBuilder()
		.setAuthor({
			name: "Minecraft Player Skin",
		})
		.setTitle(skinUrl || player)
		.setImage(url)
		.addFields([
			{
				name: "Render Type",
				value: renderType.replace(/_/g, " "),
				inline: true,
			},
			{
				name: "Crop Type",
				value: cropType,
				inline: true,
			},
		]);

	if (skinUrl) embed.setURL(skinUrl)

	await int.reply({
		embeds: [embed],
	});
}

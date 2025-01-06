import type { Client } from "../../../structures/DiscordClient";
import type { Player } from "../../../types/minecraftPlayer";
import {
	avaibleCropTypes,
	customSkinsConfig,
	renderTypes,
} from "../../../data/constants/minecraftSkin";
import type {
	CropType,
	RenderType,
	SkinType,
} from "../../../types/minecraftSkin";
import axios from "axios";
import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	let renderType: RenderType | "custom" = int.options.getString(
		"render-type",
		true,
	) as RenderType;
	const cropType = int.options.getString("crop-type", true) as CropType;

	let skinType =
		(int.options.getString("skin-type", false) as SkinType) || "wide";

	const defaultSkin = skinType === "wide" ? "MHF_Steve" : "MHF_Alex";

	const skinUrl = int.options.getString("skin-url", false);
	const player = int.options.getString("player", false) || defaultSkin;

	const urlRegex = /^http:\/\/(.*)?|https:\/\/(.*)?$/;

	if (!renderTypes.includes(renderType))
		return int.reply({
			content: "Invalid render type",
			flags: MessageFlags.Ephemeral,
		});

	if (!avaibleCropTypes[renderType].includes(cropType))
		return await int.reply({
			content: "Invalid crop type",
			flags: MessageFlags.Ephemeral,
		});

	if (skinUrl && !urlRegex.test(skinUrl))
		return await int.reply({
			content: "This skin URL is not a valid URL",
			flags: MessageFlags.Ephemeral,
		});

	await int.deferReply();

	try {
		const playerInfo = await axios.get(`https://starlightskins.lunareclipse.studio/info/user/${player}`);

		const playerData = playerInfo.data as Player;

		if (playerData.skinType) skinType = playerData.skinType;
	} catch (e) {}

	const urlParams = new URLSearchParams({
		skinType,
	});

	const skinConfig = customSkinsConfig[renderType];

	if (skinConfig) {
		const url = `${global.baseUrl}/skinModels/${renderType}`;

		urlParams.append("wideModel", `${url}/wide.obj`);
		urlParams.append("slimModel", `${url}/slim.obj`);

		if (skinConfig.cameraPosition)
			urlParams.append(
				"cameraPosition",
				JSON.stringify(skinConfig.cameraPosition),
			);

		if (skinConfig.cameraFocalPoint)
			urlParams.append(
				"cameraFocalPoint",
				JSON.stringify(skinConfig.cameraFocalPoint),
			);

		renderType = "custom";
	}

	if (skinUrl) urlParams.append("skinUrl", skinUrl);

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

	if (skinUrl) embed.setURL(skinUrl);

	await int.reply({
		embeds: [embed],
	});
}

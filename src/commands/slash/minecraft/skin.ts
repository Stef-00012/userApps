import getMinecraftSkin from "$/getMinecraftSkin";
import type { Client } from "&/DiscordClient";
import {
	avaibleCropTypes,
	renderTypes,
} from "#/minecraftSkin";
import type {
	CropType,
	RenderType,
	SkinType,
} from "?/minecraftSkin";
import {
	AttachmentBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export default async function (
	_client: Client,
	int: ChatInputCommandInteraction,
) {
	const renderType: RenderType | "custom" = int.options.getString(
		"render-type",
		true,
	) as RenderType;
	const cropType = int.options.getString("crop-type", true) as CropType;

	const skinType = (int.options.getString("skin-type", false) || "wide") as SkinType;

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

	const res = await getMinecraftSkin({
		renderType,
		skinType,
		cropType,
		skinUrl,
		player,
	})

	if (res.error) return int.editReply({
		content: res.error
	})

	console.log(res)

	const attachment = new AttachmentBuilder(res.image, {
		name: "skin.png",
	})

	const embed = new EmbedBuilder()
		.setAuthor({
			name: "Minecraft Player Skin",
		})
		.setTitle(skinUrl || player)
		.setImage("attachment://skin.png")
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

	await int.editReply({
		embeds: [embed],
		files: [attachment],
	});
}

import type { CropType, RenderType, SkinType } from "?/minecraftSkin";
import { customSkinsConfig } from "../constants/minecraftSkin";
import type { Player } from "?/minecraftPlayer";
import axios, { type AxiosError } from "axios";

export interface Params {
	renderType: RenderType | "custom";
	skinType: SkinType;
	cropType: CropType;
	skinUrl?: string | null;
	player?: string;
}

export default async function getMinecraftSkin({
	renderType,
	skinType,
	cropType,
	skinUrl,
	player,
}: Params): Promise<
	{ error: any; image?: undefined } | { image: any; error?: undefined }
> {
	try {
		const playerInfo = await axios.get(
			`https://starlightskins.lunareclipse.studio/info/user/${player}`,
		);

		const playerData = playerInfo.data as Player;

		if (playerData.skinType) skinType = playerData.skinType;
	} catch (e) {}

	const urlParams = new URLSearchParams({
		skinType,
	});

	const skinConfig = customSkinsConfig[renderType as RenderType];

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

	try {
		const res = await axios.get(url, {
			responseType: "arraybuffer",
		});

		const arrayBuffer = res.data;

		return {
			image: arrayBuffer,
		};
	} catch(e) {
		const err = e as AxiosError;

		const data = err?.response?.data as Buffer;
		const stringifiedError = data.toString()

		try {
			const errorData = JSON.parse(stringifiedError)
			
			return {
				error: errorData.error
			};
		} catch(e) {
			return {
				error: "Something went wrong..."
			}
		}
	}
}

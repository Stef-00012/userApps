import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "minecraft",
	requires: [],

	async autocomplete(client: Client, int: AutocompleteInteraction) {
		const subcommand = int.options.getSubcommand();

		if (subcommand !== "skin") return;

		const option = int.options.getFocused(true);

		switch (option.name) {
			case "render-type": {
				const avaibleRenderTypes = [
					{ name: "Default", value: "default" },
					{ name: "Marching", value: "marching" },
					{ name: "Walking", value: "walking" },
					{ name: "Crouching", value: "crouching" },
					{ name: "Crossed", value: "crossed" },
					{ name: "Criss Cross", value: "criss_cross" },
					{ name: "Ultimate", value: "ultimate" },
					{ name: "Isometric", value: "isometric" },
					{ name: "Head", value: "head" },
					{ name: "Cheering", value: "cheering" },
					{ name: "Relaxing", value: "relaxing" },
					{ name: "Trudging", value: "trudging" },
					{ name: "Cowering", value: "cowering" },
					{ name: "Pointing", value: "pointing" },
					{ name: "Lunging", value: "lunging" },
					{ name: "Dungeons", value: "dungeons" },
					{ name: "Facepalm", value: "facepalm" },
					{ name: "Sleeping", value: "sleeping" },
					{ name: "Dead", value: "dead" },
					{ name: "Archer", value: "archer" },
					{ name: "Kicking", value: "kicking" },
					{ name: "Mojavatar", value: "mojavatar" },
					{ name: "Reading", value: "reading" },
					{ name: "Bitzel", value: "bitzel" },
					{ name: "Pixel", value: "pixel" },
					{ name: "Ornament", value: "ornament" },
					{ name: "Skin", value: "skin" },
				];

				let matches = avaibleRenderTypes.filter((renderType) =>
					renderType.value.toLowerCase().startsWith(option.value.toLowerCase()),
				);

				if (matches.length > 25) matches = matches.slice(0, 24);

				return await int.respond(matches);
			}

			case "crop-type": {
				const renderType = int.options.getString("render-type", true);

				const avaibleCropTypes = {
					default: ["full", "bust", "face"],
					marching: ["full", "bust", "face"],
					walking: ["full", "bust", "face"],
					crouching: ["full", "bust", "face"],
					crossed: ["full", "bust", "face"],
					criss_cross: ["full", "bust", "face"],
					ultimate: ["full", "bust", "face"],
					isometric: ["full", "bust", "face", "head"],
					head: ["full"],
					cheering: ["full", "bust", "face"],
					relaxing: ["full", "bust", "face"],
					trudging: ["full", "bust", "face"],
					cowering: ["full", "bust", "face"],
					pointing: ["full", "bust", "face"],
					lunging: ["full", "bust", "face"],
					dungeons: ["full", "bust", "face"],
					facepalm: ["full", "bust", "face"],
					sleeping: ["full", "bust"],
					dead: ["full", "bust", "face"],
					archer: ["full", "bust", "face"],
					kicking: ["full", "bust", "face"],
					mojavatar: ["full", "bust"],
					reading: ["full", "bust", "face"],
					bitzel: ["full", "bust", "face"],
					pixel: ["full", "bust", "face"],
					ornament: ["full"],
					skin: ["default", "processed"],
				};

				const matches = (avaibleCropTypes[renderType] || [])
					.map((cropType) => ({
						name: cropType,
						value: cropType,
					}))
					.filter((cropType) =>
						cropType.name.toLowerCase().startsWith(option.value.toLowerCase()),
					);

				return await int.respond(matches);
			}
		}
	},

	async execute(client: Client, int: ChatInputCommandInteraction) {
		const subcommand = int.options.getSubcommand();

		const subcommandData = (await import(`./minecraft/${subcommand}`)).default;

		await subcommandData(client, int);
	},
} as Command;

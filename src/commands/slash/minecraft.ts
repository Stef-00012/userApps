import { avaibleCropTypes, avaibleRenderTypes } from "#/minecraftSkin";
import type { CropType, RenderType } from "?/minecraftSkin";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "minecraft",
	requires: [],

	async autocomplete(_client: Client, int: AutocompleteInteraction) {
		const subcommand = int.options.getSubcommand();

		if (subcommand !== "skin") return;

		const option = int.options.getFocused(true);

		switch (option.name) {
			case "render-type": {
				let matches = avaibleRenderTypes.filter((renderType) =>
					renderType.value.toLowerCase().startsWith(option.value.toLowerCase()),
				);

				if (matches.length > 25) matches = matches.slice(0, 24);

				return await int.respond(matches);
			}

			case "crop-type": {
				const renderType = int.options.getString(
					"render-type",
					true,
				) as RenderType;

				const matches = (avaibleCropTypes[renderType] || [])
					.map((cropType: CropType) => ({
						name: cropType,
						value: cropType,
					}))
					.filter(
						(cropType: {
							name: CropType;
							value: CropType;
						}) =>
							cropType.name
								.toLowerCase()
								.startsWith(option.value.toLowerCase()),
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

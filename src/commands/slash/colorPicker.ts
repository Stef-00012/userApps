import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import { createCanvas } from "@napi-rs/canvas";
import color from "color";
import {
	EmbedBuilder,
	AttachmentBuilder,
	type ChatInputCommandInteraction,
	type HexColorString,
} from "discord.js";

export default {
	name: "colorpicker",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const hex = int.options.getString("hex", true).replace("#", "");
		const hexCodeRegex = /^([A-Fa-f0-9]{6})$/.test(hex);

		if (!hex || !hexCodeRegex) {
			await int.reply({
				content:
					"Please provide a valid hex color code. (e.g. `fecdac` or `#fecdac`)",
			});
			return;
		}

		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext("2d");

		ctx["beginPath"]();
		ctx["fillStyle"] = hex.startsWith("#") ? hex : `#${hex}`;
		ctx["fillRect"](0, 0, 250, 250);
		ctx["closePath"]();

		const colorImage = canvas.toBuffer("image/png");

		const attachment = new AttachmentBuilder(colorImage, {
			name: `color_${hex.replace("#", "")}.jpg`,
		});

		const hexColor = color(hex.startsWith("#") ? hex : `#${hex}`);
		const rgb = hexColor.rgb().string();
		const hsl = hexColor.hsl().string();

		const embed = new EmbedBuilder()
			.setTitle("Color Picker")
			.setDescription(`Hex: \`#${hex}\`\nRGB: \`${rgb}\`\nHSL: \`${hsl}\``)
			.setImage(`attachment://color_${hex.replace("#", "")}.jpg`)
			.setColor(hex as HexColorString);

		await int.reply({
			embeds: [embed],
			files: [attachment],
		});
	},
} as Command;

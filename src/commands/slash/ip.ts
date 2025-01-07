import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import axios from "axios";

export default {
	name: "ip",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const ip = int.options.getString("ip", true);

		await int.deferReply();

		const res = await axios.get(`https://we-are-jammin.xyz/json/${ip}`);

		const ipData = res.data;

		if (ipData.status !== "success")
			return await int.editReply({
				content: "The IP address query has failed",
			});

		const embed = new EmbedBuilder();

		const fields = [
			{
				name: "Country",
				value: ipData.country,
			},
			{
				name: "Country Code",
				value: ipData.countryCode,
			},
			{
				name: "Region",
				value: ipData.region,
			},
			{
				name: "Region Name",
				value: ipData.regionName,
			},
			{
				name: "City",
				value: ipData.city,
			},
			{
				name: "ZIP",
				value: ipData.zip,
			},
			{
				name: "Latitute",
				value: `${ipData.lat}`,
			},
			{
				name: "Longitude",
				value: `${ipData.lon}`,
			},
			{
				name: "Timezone",
				value: ipData.timezone,
			},
			{
				name: "ISP",
				value: ipData.isp,
			},
			{
				name: "ORG",
				value: ipData.org,
			},
			{
				name: "AS",
				value: ipData.as,
			},
		];

		embed.setFields(fields);

		await int.editReply({
			embeds: [embed],
		});
	},
} as Command;

import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { WhoisResult } from "?/whois";
import type { Command } from "?/command";
import whoiser from "whoiser";

export default {
	name: "whois",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		await int.deferReply();

		const query = int.options.getString("query", true);

		const queryOutput = await whoiser(query);

		const firstKey = Object.keys(queryOutput)[0];

		const whoisData = queryOutput[firstKey] as unknown as WhoisResult;

		const embedLines = [
			"# Domain Status",
			whoisData["Domain Status"].map((line) => {
				const lineData = line.split(" ");

				return `**${lineData.shift()}**: ${lineData.join(" ")}`;
			}),
			"# Nameservers",
			`- ${whoisData["Name Server"].join("\n- ")}`,
			"",
			`**Domain Name**: ${whoisData["Domain Name"]}`,
			`**Registry Domain ID**: ${whoisData["Registry Domain ID"]}`,
			`**Registrar WHOIS Server**: ${whoisData["Registrar WHOIS Server"]}`,
			`**Registrar URL**: ${whoisData["Registrar URL"]}`,
			`**Updated Date**: ${whoisData["Updated Date"]}`,
			`**Created Date**: ${whoisData["Created Date"]}`,
			`**Expiry Date**: ${whoisData["Expiry Date"]}`,
			`**Registrar**: ${whoisData["Registrar"]}`,
			`**Registrar IANA ID**: ${whoisData["Registrar IANA ID"]}`,
			`**Registrar Abuse Contact Email**: ${whoisData["Registrar Abuse Contact Email"]}`,
			`**Registrar Abuse Contact Phone**: ${whoisData["Registrar Abuse Contact Phone"]}`,
			`**DNSSEC**: ${whoisData["DNSSEC"]}`,
			`**URL of the ICANN Whois Inaccuracy Complaint Form**: ${whoisData["URL of the ICANN Whois Inaccuracy Complaint Form"]}`,
		];

		const embed = new EmbedBuilder().setDescription(embedLines.join("\n"));

		await int.editReply({
			embeds: [embed],
		});
	},
} as Command;

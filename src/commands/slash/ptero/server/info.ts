import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { PterodactylServer } from "../../../../types/pterodactyl";
import type { Client } from "&/DiscordClient";
import axios, { type AxiosError } from "axios";
import { eq } from "drizzle-orm";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const id = int.options.getString("id");

	await int.deferReply();

	const pteroSchema = client.dbSchema.ptero;

	const userPteroData = await client.db.query.ptero.findFirst({
		where: eq(pteroSchema.id, int.user.id),
	});

	if (!userPteroData)
		return await int.editReply({
			content: "Your Pterodactyl config are incorrect",
		});

	const panelUrl = userPteroData.panelUrl;
	const apiKey = userPteroData.apiKey;

	try {
		const res = await axios.get(`${panelUrl}/api/client/servers/${id}`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});

		const data: PterodactylServer = res.data.attributes;

		const allocations = data.relationships.allocations.data
			.map((allocation) => {
				const allocationAttributes = allocation.attributes;

				return `**ID**: \`${allocationAttributes.id}\`\n**URL**: \`${
					allocationAttributes.ip_alias
						? allocationAttributes.ip_alias
						: allocationAttributes.ip
				}:${allocationAttributes.port}\`\n**Default**: ${
					allocationAttributes.is_default ? "Yes" : "No"
				}`;
			})
			.join("\n\n");

		const embed = new EmbedBuilder()
			.setTitle(`${data.name} - [\`${data.identifier}\`]`)
			.addFields([
				{
					name: "Node",
					value: data.node,
					inline: true,
				},
				{
					name: "SFTP",
					value: `\`${data.sftp_details.ip}:${data.sftp_details.port}\``,
					inline: true,
				},
				{
					name: "Suspended?",
					value: data.is_suspended ? "Yes" : "No",
					inline: true,
				},
				{
					name: "Limits",
					value: `**RAM**: \`${
						data.limits.memory === 0 ? "Unlimited" : data.limits.memory
					}\`\n**Swap**: \`${
						data.limits.swap === -1 ? "Unlimited" : data.limits.swap
					}\`\n**Disk**: \`${
						data.limits.disk === 0 ? "Unlimited" : data.limits.disk
					}\`\n**Network**: \`${data.limits.io}\`\n**CPU**: \`${
						data.limits.cpu === 0 ? "Unlimited" : data.limits.cpu
					}\``,
					inline: true,
				},
				{
					name: "Feature Limits",
					value: `**Databases**: \`${data.feature_limits.databases}\`\n**Allocations**: \`${data.feature_limits.allocations}\`\n**Backups**: \`${data.feature_limits.backups}\``,
					inline: true,
				},
				{
					name: "Allocations",
					value:
						allocations.length > 1024
							? `${allocations.substr(0, 1021)}...`
							: allocations,
					inline: true,
				},
			]);

		if (data.description) embed.setDescription(data.description);

		await int.editReply({
			embeds: [embed],
		});
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 401)
			return await int.editReply({
				content: "Your API key is not valid",
			});

		console.log(error);

		await int.editReply({
			content: "Something went wrong...",
		});
	}
}

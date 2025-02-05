import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import type { NaviacConfig, ZiplineConfig } from "@/types/config";
import type { CommandStatus } from "../../../types/permissions";
import type { Client } from "&/DiscordClient";
import config from "$config";

export default async function (
	client: Client,
	int: ChatInputCommandInteraction,
) {
	const commandStatusJSON: CommandStatus = await Bun.file(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
	).json();

	const commandName = int.options.getString("command", true);

	if (commandStatusJSON[commandName])
		return await int.reply({
			content: `\`${commandName}\` is already enabled`,
			flags: MessageFlags.Ephemeral,
		});

	const commandData = client.commands.get(commandName);

	if (!commandData)
		return int.reply({
			content: "Invalid Command",
			flags: MessageFlags.Ephemeral,
		});

	if (
		commandData.requires.includes("naviac") &&
		["username", "token"].some(
			(cfg) => !config?.naviac?.[cfg as keyof NaviacConfig],
		)
	) {
		return await int.reply({
			content:
				"You must add a N.A.V.I.A.C. username and token in order to be able to enable this command",
			flags: MessageFlags.Ephemeral,
		});
	}

	if (
		commandData.requires.includes("zipline") &&
		["token", "url", "chunkSize", "maxFileSize"].some(
			(cfg) => !config?.zipline?.[cfg as keyof ZiplineConfig],
		)
	) {
		return await int.reply({
			content:
				"You must add your zipline token, url and chunk size in order to be able to enable this command",
			flags: MessageFlags.Ephemeral,
		});
	}

	commandStatusJSON[commandName] = true;

	Bun.write(
		`${__dirname}/../../../data/permissions/commandStatus.json`,
		JSON.stringify(commandStatusJSON, null, 2),
	);

	await int.reply({
		content: `Successfully enabled the command \`${commandName}\``,
		flags: MessageFlags.Ephemeral,
	});
}

import type { NaviacConfig, ZiplineConfig } from "?/config";
import type { CommandStatus } from "?/permissions";
import type { Client } from "&/DiscordClient";
import config from "$config";
import path from "node:path";
import joi from "joi";
import express, { type Request, type Response } from "express";

export default function (client: Client) {
	const router = express.Router();

	router.post("/commands", (req: Request, res: Response): any => {
		const commands = client.commands.map((cmd) => cmd.name);
		const inputCommands = req.body.commands;

		if (!inputCommands)
			return res.status(400).json({
				error: '"command" field is missing',
			});

		let validator = joi.object();

		for (const command of commands) {
			validator = validator.append({
				[command]: joi.boolean().default(false),
			});
		}

		const { error, value } = validator.validate(inputCommands) as {
			error: joi.ValidationError | undefined;
			value: CommandStatus;
		};

		if (error)
			return res.status(400).json({
				error: error.details.map((err) => err.message),
			});

		for (const command in value) {
			if (!value[command]) continue;

			const commandData = client.commands.get(command);

			if (!commandData)
				return res.status(400).json({
					error: "Command not found",
				});

			if (
				commandData.requires.includes("naviac") &&
				["username", "token"].some(
					(cfg) => !config?.naviac?.[cfg as keyof NaviacConfig],
				)
			) {
				return res.status(400).json({
					error: `You must add a N.A.V.I.A.C. username and token in order to be able to enable the command "${command}"`,
				});
			}

			if (
				commandData.requires.includes("zipline") &&
				["token", "url", "chunkSize", "maxFileSize"].some(
					(cfg) => !config?.zipline?.[cfg as keyof ZiplineConfig],
				)
			) {
				return res.status(400).json({
					error: `You must add your zipline token, url and chunk size in order to be able to enable the command "${command}"`,
				});
			}
		}

		const commandStatusPath = path.join(
			__dirname,
			"../../../data/permissions/commandStatus.json",
		);

		Bun.write(commandStatusPath, JSON.stringify(value, null, 4));

		return res.sendStatus(204);
	});

	return router;
}

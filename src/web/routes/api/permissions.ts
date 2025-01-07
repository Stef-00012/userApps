import express, { type Request, type Response } from "express";
import type { CommandPermissions } from "?/permissions";
import type { Client } from "&/DiscordClient";
import path from "node:path";
import joi from "joi";

export default function (client: Client) {
	const router = express.Router();

	router.post("/permissions", (req: Request, res: Response): any => {
		const commands = client.commands.map((cmd) => cmd.name);
		const inputPermissions = req.body.permissions;

		let validator = joi.object();

		for (const command of commands) {
			validator = validator.append({
				[command]: joi
					.array()
					.items(
						joi
							.string()
							.regex(/^\d{15,21}$/)
							.optional(),
					)
					.default([]),
			});
		}

		const { error, value } = validator.validate(inputPermissions) as {
			error: joi.ValidationError | undefined;
			value: CommandPermissions;
		};

		if (error)
			return res.status(400).json({
				error: error.details.map((err) => err.message),
			});

		const commandPermissionsPath = path.join(
			__dirname,
			"../../../data/permissions/commandPermissions.json",
		);

		Bun.write(commandPermissionsPath, JSON.stringify(value, null, 4));

		return res.sendStatus(204);
	});

	return router;
}

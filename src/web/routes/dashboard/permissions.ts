import express, { type Request, type Response } from "express";
import type { CommandPermissions } from "?/permissions";
import type { Client } from "&/DiscordClient";
import path from "node:path";

export default function (client: Client) {
	const router = express.Router();

	router.get(
		"/dashboard/permissions",
		async (_req: Request, res: Response): Promise<any> => {
			const username = client.user?.tag || "Unknown#0000";
			const commands = client.commands.map((cmd) => cmd.name);
			const permissionsPath = path.join(
				__dirname,
				"../../../data/permissions/commandPermissions.json",
			);

			try {
				const permissions: CommandPermissions =
					await Bun.file(permissionsPath).json();

				for (const command of commands) {
					if (!permissions[command]) permissions[command] = [];
				}

				for (const command in permissions) {
					if (!commands.includes(command)) delete permissions[command];
				}

				res.render("dashboard/permissions", {
					permissions,
					username,
				});
			} catch (e) {
				return res.sendStatus(500);
			}
		},
	);

	return router;
}

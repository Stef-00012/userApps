import express, { type Request, type Response } from "express";
import type { Client } from "&/DiscordClient";

export default function (client: Client) {
	const router = express.Router();

	router.get("/invite", (_req: Request, res: Response): any => {
		res.redirect(
			`https://discord.com/oauth2/authorize?client_id=${client.user?.id}`,
		);
	});

	return router;
}

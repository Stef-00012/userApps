import type { Client } from "&/DiscordClient";
import express, { type Request, type Response } from "express";

export default function (_client: Client) {
	const router = express.Router();

	router.get("/unauthorized", (_req: Request, res: Response): any => {
		res.render("auth/unauthorized");
	});

	return router;
}

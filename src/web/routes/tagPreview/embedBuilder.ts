import express, { type Request, type Response } from "express";
import type { Client } from "&/DiscordClient";

export default function (client: Client) {
	const router = express.Router();

	router.get("/tags/:id", (req: Request, res: Response): any => {
		try {
			const json = global.conflicts[req.params["id"]];

			if (
				!json ||
				(!json.content && (!json.embeds || json.embeds?.length <= 0))
			)
				return res.sendStatus(400);

			const base64json = btoa(JSON.stringify(json));

			return res.render("tags/preview", {
				json: base64json,
				avatar: client.user?.avatarURL() || "",
				username: client.user?.username || "Unknown#0000",
			});
		} catch (e) {
			console.log(e);
			return res.sendStatus(500);
		}
	});

	return router;
}

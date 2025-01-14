import type { DiscordWebhookBody, DiscordWebhookTemplates } from "?/web";
import express, { type Request, type Response } from "express";
import type { Client } from "&/DiscordClient";
import config from "$config";
import nacl from "tweetnacl";
import axios from "axios";

export default function (client: Client) {
	const router = express.Router();

	const publicKey = config?.web?.discordWebhook?.public_key;

	router.post(
		"/discord/webhook",
		async (req: Request, res: Response): Promise<any> => {
			if (!publicKey) return res.sendStatus(404);

			const body = req.body as DiscordWebhookBody;
			const signature = req.get("X-Signature-Ed25519") as string;
			const timestamp = req.get("X-Signature-Timestamp");
			const rawBody = JSON.stringify(req.body);

			if (!signature || !timestamp || !rawBody) return res.sendStatus(401);

			const isVerified = nacl.sign.detached.verify(
				Buffer.from(timestamp + rawBody),
				Buffer.from(signature, "hex"),
				Buffer.from(publicKey, "hex"),
			);

			if (!isVerified) return res.sendStatus(401);

			if (body.type === 0) return res.sendStatus(204);

			if (body.event?.type === "APPLICATION_AUTHORIZED") {
				res.sendStatus(204);

				const urls = config.web?.discordWebhook?.urls;

				if (!urls || urls.length <= 0) return;

				const titleTemplate =
					config.web?.discordWebhook?.message.title ||
					"A user has just installed {{bot}}";
				const messageTemplate =
					config.web?.discordWebhook?.message.body ||
					"{{user}} ({{user.id}}) has just installed {{bot}} at {{time}}";

				const title = replaceTemplate(titleTemplate, {
					user: body.event.data.user.username,
					bot: client.user?.username as string,
					userId: body.event.data.user.id,
					time: body.event.timestamp,
				});

				const message = replaceTemplate(messageTemplate, {
					user: body.event.data.user.username,
					bot: client.user?.username as string,
					userId: body.event.data.user.id,
					time: body.event.timestamp,
				});

				try {
					await axios.post(
						`${process.env["APPRISE_URL"]}/notify`,
						{
							urls,
							title,
							body: message,
						},
						{
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
				} catch (e) {
					console.log(e);
				}
			}
		},
	);

	return router;
}

function replaceTemplate(
	text: string,
	config: DiscordWebhookTemplates,
): string {
	return text
		.replaceAll("{{user}}", config.user)
		.replaceAll("{{user.id}}", config.userId)
		.replaceAll("{{bot}}", config.bot)
		.replaceAll("{{time}}", new Date(config.time).toLocaleString());
}

import type { Client } from "../../../structures/DiscordClient";
import type { DatabaseUserData } from "../../../types/discord";
import jwt, { type JwtPayload } from "jsonwebtoken";
import getToken from "$/getToken";
import config from "$config";
import express, { type Request, type Response } from "express";
import getAccessToken from "$/getAccessToken";

export default function (client: Client) {
	const router = express.Router();

	router.get("/login", async (req: Request, res: Response): Promise<any> => {
		if (req.query?.["a"] === "1" || !config.web)
			return res.render("auth/notLogged");

		const tokenData: null | DatabaseUserData = await getToken(
			client,
			req.cookies?.["id"],
		);

		if (tokenData) {
			if (!config.owners.includes(tokenData.id))
				return res.redirect("/logout?r=1");

			return res.redirect("/dashboard");
		}

		const code = req.query?.["code"];

		if (!code)
			return res.redirect(
				`https://discord.com/oauth2/authorize?client_id=${
					config.web.auth.clientId
				}&response_type=code&redirect_uri=${encodeURIComponent(
					config.web.auth.redirectURI,
				)}&scope=${config.web.auth.scopes}`,
			);

		const hashedId: string | null = await getAccessToken(
			client,
			code as string,
		);

		if (!hashedId) return res.redirect("/dashboard");

		const decodedAuth = jwt.verify(
			hashedId,
			config.web.jwt.secret,
		) as JwtPayload;

		if (!config.owners.includes(decodedAuth["userId"]))
			return res.redirect("/logout?r=1");

		res.cookie("id", hashedId, {
			httpOnly: true,
			expires: new Date("2038-01-19T04:14:07.000Z"),
			// maxAge: 2_419_200_000 // 28 days in milliseconds
		});
		return res.redirect("/dashboard");
	});

	return router;
}

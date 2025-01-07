import type { RESTPostOAuth2RefreshTokenResult } from "discord.js";
import type { DatabaseTokenData } from "?/discord";
import config from "$config";
import axios from "axios";

export default async function refreshToken(
	token: string,
): Promise<DatabaseTokenData | null> {
	if (!config.web || !config.web.enabled) return null;

	try {
		const newTokenData: RESTPostOAuth2RefreshTokenResult = (
			await axios.post(
				"https://discord.com/api/oauth2/token",
				new URLSearchParams({
					client_id: config.web.auth.clientId,
					client_secret: config.web.auth.clientSecret,
					grant_type: "refresh_token",
					redirect_uri: config.web.auth.redirectURI,
					scope: config.web.auth.scopes,
					refresh_token: token,
				}).toString(),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			)
		).data;

		return {
			accessToken: newTokenData.access_token,
			refreshToken: newTokenData.refresh_token,
			expiresAt: new Date(
				(Math.floor(new Date().getTime() / 1000) + newTokenData.expires_in) *
					1000,
			).toISOString(),
			scopes: newTokenData.scope,
		} as DatabaseTokenData;
	} catch (e) {
		return null;
	}
}

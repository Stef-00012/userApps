import axios, { type AxiosError } from "axios";
import config from "$config";

export default async function revokeAccessToken(
	token: string,
	tokenType: string,
): Promise<boolean | null> {
	if (!config.web || !config.web.enabled) return null;

	try {
		await axios.post(
			"https://discord.com/api/oauth2/token/revoke",
			new URLSearchParams({
				client_id: config.web.auth.clientId,
				client_secret: config.web.auth.clientSecret,
				token,
				token_type_hint: tokenType,
			}).toString(),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		return true;
	} catch (e) {
		const error = e as AxiosError;

		console.error(error?.response?.data || error);
		return false;
	}
}

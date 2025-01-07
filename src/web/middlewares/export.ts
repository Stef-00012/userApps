import DashboardAuthMiddleware from "./dashboard/auth";
import type { Client } from "&/DiscordClient";
import ApiAuthMiddleware from "./api/auth";
import type { Middlewares } from "?/web";

export default function (client: Client): Middlewares {
	const middlewares: Middlewares = {
		dash: {
			auth: DashboardAuthMiddleware(client),
		},
		api: {
			auth: ApiAuthMiddleware(client),
		},
	};

	return middlewares;
}

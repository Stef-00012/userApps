import type { Client } from "../../structures/DiscordClient";
import DashboardAuthMiddleware from "./dashboard/auth";
import type { Middlewares } from "../../types/web";
import ApiAuthMiddleware from "./api/auth";

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

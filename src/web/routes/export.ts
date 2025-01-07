import config from "$config";

import type { Client } from "&/DiscordClient";
import type { Routes } from "?/web";

import DashboardHomeRoute from "./dashboard/home";
import DashboardCommandsRoute from "./dashboard/commands";
import DashboardPermissionsRoute from "./dashboard/permissions";

import ApiCommandsRoute from "./api/commands";
import ApiPermissionsRoute from "./api/permissions";

import AuthLoginRoute from "./auth/login";
import AuthLogoutRoute from "./auth/logout";
import UnautorizedRoute from "./auth/unauthorized";

import TagPreviewRoute from "./tagPreview/embedBuilder";

import InviteRoute from "./misc/invite";
import DiscordWebhook from "./misc/discordWebhook";

export default function (client: Client): Routes {
	const routes: Routes = {
		auth: {
			dashboardHome: DashboardHomeRoute(client),
			dashboardCommands: DashboardCommandsRoute(client),
			dashboardPermissions: DashboardPermissionsRoute(client),
		},
		api: {
			commands: ApiCommandsRoute(client),
			permissions: ApiPermissionsRoute(client),
		},
		noAuth: {
			authLogin: AuthLoginRoute(client),
			authLogout: AuthLogoutRoute(client),
			unauthorized: UnautorizedRoute(client),
			tagPreview: TagPreviewRoute(client),
		},
	};

	if (config.web?.discordWebhook?.enabled) {
		routes["noAuth"]["discordWebhook"] = DiscordWebhook(client);
	}

	if (config.public) {
		routes["noAuth"]["invite"] = InviteRoute(client);
	}

	return routes;
}

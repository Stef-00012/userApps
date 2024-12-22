import type { APIEntitlement, APIGuild, APIUser } from "discord.js";
import type { NextFunction, Request, Response, Router } from "express";

export interface Routes {
	[key: string]: {
		[key: string]: Router;
	};
}

export interface Middlewares {
	[key: string]: {
		[key: string]: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => Promise<any>;
	};
}

export interface DiscordWebhookTemplates {
	userId: string;
	user: string;
    time: string;
	bot: string;
}

export interface DiscordWebhookBody {
	version: number;
	application_id: string;
	type: 0 | 1;
	event?: DiscordWebhookEvent;
}

type DiscordWebhookEvent =
	| DiscordWebhookApplicationAuthorizedEvent
	| DiscordWebhookQuestUserEnrollmentEvent
	| DiscordWebhookEntitlementCreateEvent;

interface DiscordWebhookApplicationAuthorizedEvent {
	type: "APPLICATION_AUTHORIZED";
	timestamp: string;
	data: DiscordWebhookApplicationAuthorizedData;
}

interface DiscordWebhookQuestUserEnrollmentEvent {
	type: "QUEST_USER_ENROLLMENT";
	timestamp: string;
	data: DiscordWebhookQuestUserEnrollmentData;
}

interface DiscordWebhookEntitlementCreateEvent {
	type: "ENTITLEMENT_CREATE";
	timestamp: string;
	data: DiscordWebhookEntitlementCreateData;
}

export interface DiscordWebhookApplicationAuthorizedData {
	integration_type?: 0 | 1;
	scopes: Array<string>;
	guild?: APIGuild;
	user: APIUser;
}

export type DiscordWebhookEntitlementCreateData = APIEntitlement;

export type DiscordWebhookQuestUserEnrollmentData = undefined;

import express, { type Request, type Response } from "express";
import type { NaviacConfig, ZiplineConfig } from "?/config";
import MiddlewaresHandler from "./web/middlewares/export";
import { GatewayIntentBits, Partials } from "discord.js";
import type { CommandStatus } from "?/permissions";
import RoutesHander from "./web/routes/export";
import { Client } from "@/structures/DiscordClient";
import cookieParser from "cookie-parser";
import type { TagData } from "?/tag";
import config from "$config";
import init from "$/init";
import fs from "node:fs";

declare global {
	var baseUrl: string;
	var conflicts: {
		[key: string]: TagData;
	};
	var conflictsInterval: NodeJS.Timeout;
}

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
	],
	partials: [
		Partials.Channel,
		Partials.Reaction,
		Partials.Message,
		Partials.User,
	],
});

global.conflicts = {};

await init();

if (config.web?.enabled) {
	if (
		!config.web.auth ||
		!config.web.auth.clientId ||
		!config.web.auth.clientSecret ||
		!config.web.auth.redirectURI ||
		!config.web.auth.scopes
	) {
		console.log(
			"\x1b[31mYou must setup discord OAuth2 or disable the web UI\x1b[0m",
		);

		process.exit(1);
	}

	if (!config.web.jwt || !config.web.jwt.secret) {
		console.log(
			"\x1b[31mYou must add a JWT secret or disable the web UI\x1b[0m",
		);

		process.exit(1);
	}
}

const {
	auth: authRoutes,
	api: apiRoutes,
	noAuth: noAuthRoutes,
} = RoutesHander(client);

const { dash: dashboardMiddlewares, api: apiMiddlewares } =
	MiddlewaresHandler(client);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", `${__dirname}/web/views`);

app.use(express.static(`${__dirname}/web/public`));

app.get("/", (_req: Request, res: Response): any => {
	return res.redirect("/dashboard");
});

for (const route in noAuthRoutes) {
	app.use("/", noAuthRoutes[route]);

	console.log(
		`\x1b[38;2;131;77;179mLoaded the dashboard route "${route}" [no auth]\x1b[0m`,
	);
}

for (const middleware in dashboardMiddlewares) {
	app.use("/", dashboardMiddlewares[middleware]);

	console.log(
		`\x1b[38;2;131;77;179mLoaded the dashboard middleware "${middleware}"\x1b[0m`,
	);
}

for (const route in authRoutes) {
	app.use("/", authRoutes[route]);

	console.log(
		`\x1b[38;2;131;77;179mLoaded the dashboard route "${route}"\x1b[0m`,
	);
}

for (const middleware in apiMiddlewares) {
	app.use("/api", apiMiddlewares[middleware]);

	console.log(
		`\x1b[38;2;100;37;156mLoaded the API middleware "${middleware}"\x1b[0m`,
	);
}

for (const route in apiRoutes) {
	app.use("/api", apiRoutes[route]);

	console.log(`\x1b[38;2;100;37;156mLoaded the API route "${route}"\x1b[0m`);
}

app.all("*", (_req: Request, res: Response): any => {
	res.sendStatus(404);
});

const events = fs
	.readdirSync(`${__dirname}/events`)
	.filter((file) => file.endsWith(".ts"));

const commandDirs = ["slash", "message", "user"];

const commandStatusJSON: CommandStatus = await Bun.file(
	`${__dirname}/data/permissions/commandStatus.json`,
).json();

for (const dir of commandDirs) {
	const commands = fs
		.readdirSync(`${__dirname}/commands/${dir}`)
		.filter((file) => file.endsWith(".ts"));

	for (const command of commands) {
		const commandData = (
			await import(`${__dirname}/commands/${dir}/${command}`)
		).default;

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("naviac") &&
			["username", "token"].some(
				(cfg) => !config.naviac?.[cfg as keyof NaviacConfig],
			)
		) {
			console.log(
				`\x1b[31mYou must add a N.A.V.I.A.C. username and token or disable the command "${commandData.name}" in "data/permissions/commandStatus.json"\x1b[0m`,
			);

			process.exit(1);
		}

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("zipline") &&
			["token", "url", "chunkSize", "maxFileSize"].some(
				(cfg) => !config.zipline?.[cfg as keyof ZiplineConfig],
			)
		) {
			console.log(
				`\x1b[31mYou must add your zipline token, url and chunk size or disable the command "${commandData.name}" in "data/permissions/commandStatus.json"\x1b[0m`,
			);

			process.exit(1);
		}

		const colors = {
			slash: "\x1b[34m",
			message: "\x1b[38;2;27;87;161m",
			user: "\x1b[38;2;13;67;133m",
		};

		client.commands.set(commandData.name, commandData);

		console.log(
			`${colors[dir as keyof typeof colors]}Loaded the ${dir} command "${
				command.split(".")[0]
			}"\x1b[0m`,
		);
	}
}

for (const event of events) {
	const eventData = (await import(`${__dirname}/events/${event}`)).default;

	client.on(event.split(".")[0], eventData.bind(null, client));

	console.log(
		`\x1b[38;2;21;150;113mLoaded the event "${event.split(".")[0]}"\x1b[0m`,
	);
}

client.login(config.token);

if (config.web?.enabled) {
	if (
		!config.web.hostname ||
		!config.web.port ||
		typeof config.web.secure !== "boolean" ||
		typeof config.web.keepPort !== "boolean" ||
		!config.web.auth ||
		!config.web.auth.clientId ||
		!config.web.auth.clientSecret ||
		!config.web.auth.redirectURI ||
		!config.web.auth.scopes ||
		!config.web.jwt ||
		!config.web.jwt.secret
	) {
		console.log(
			`\x1b[31mYou must fill all the configs inside the "web" object or disable the web dashboard\x1b[0m`,
		);

		process.exit(0);
	}

	global.baseUrl = `http${config.web.secure ? "s" : ""}://${
		config.web.hostname || "localhost"
	}${config.web.keepPort ? `:${config.web.port || 3000}` : ""}`;

	app.listen(config.web.port || 3000, () => {
		console.log(`\x1b[36mThe web UI is online on ${baseUrl}\x1b[0m`);
	});

	global.conflictsInterval = setInterval(
		() => {
			global.conflicts = {};
		},
		1000 * 60 * 10,
	) as NodeJS.Timeout;
}

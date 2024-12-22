import type { Config } from "./src/types/config";

export default {
	token: process.env.BOT_TOKEN,
	owners: process.env.OWNERS?.split(",") || [],
	public: process.env.PUBLIC === "true",

	zipline: {
		token: process.env.ZIPLINE_TOKEN,
		url: process.env.ZIPLINE_URL,
		chunkSize: Number.parseInt(String(process.env.ZIPLINE_CHUNK_SIZE)) || 20,
		maxFileSize:
			Number.parseInt(String(process.env.ZIPLINE_MAX_FILE_SIZE)) || 1024,
	},

	naviac: {
		username: process.env.NAVIAC_USERNAME,
		token: process.env.NAVIAC_TOKEN,
	},

	web: {
		enabled: process.env.DASHBOARD_ENABLED === "true",
		hostname: process.env.DASHBOARD_HOSTNAME || "localhost",
		port: 3000,
		secure: process.env.DASHBOARD_SECURE === "true",
		keepPort: process.env.DASHBOARD_URL_KEEP_PORT === "true",

		auth: {
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			redirectURI:
				process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/login",
			scopes: "identify",
		},

		jwt: {
			secret: process.env.JWT_SECRET,
		},

		discordWebhook: {
			enabled: process.env.DISCORD_WEBHOOK_ENABLED === "true",
			public_key: process.env.DISCORD_WEBHOOK_PUBLIC_KEY,
			urls: process.env.DISCORD_WEBHOOK_NOTIFICATION_URLS?.split(',') || [],
			message: {
				title: process.env.DISCORD_WEBHOOK_MESSAGE_TITLE,
				body: process.env.DISCORD_WEBHOOK_MESSAGE_BODY
			},
		}
	},
} as Config;

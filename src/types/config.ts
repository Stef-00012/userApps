export interface Config {
	token: string;
	owners: Array<string>;
	public: boolean;
	autoUpdateAvatar: string | boolean;
	zipline?: ZiplineConfig;
	naviac?: NaviacConfig;
	web?: WebConfig;
}

export interface ZiplineConfig {
	token: string;
	url: string;
	chunkSize: number;
	maxFileSize: number;
	version: "v3" | "v4";
}

export interface NaviacConfig {
	username: string;
	token: string;
}

export type NaviacConfigKeys = keyof NaviacConfig;

export interface WebConfig {
	enabled: boolean;
	hostname: string;
	port: number;
	secure: boolean;
	keepPort: boolean;
	auth: AuthConfig;
	jwt: JwtConfig;
	discordWebhook?: DiscordWebhookConfig;
}

export interface AuthConfig {
	clientId: string;
	clientSecret: string;
	redirectURI: string;
	scopes: string;
}

export interface JwtConfig {
	secret: string;
}

export interface DiscordWebhookConfig {
	enabled: boolean;
	public_key: string;
	message: DiscordWebhookAppriseMessageConfig;
	urls: Array<string>;
}

export interface DiscordWebhookAppriseMessageConfig {
	title: string;
	body: string;
}

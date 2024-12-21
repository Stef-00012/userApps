export interface Config {
	token: string;
	owners: Array<string>;
	public: boolean,
	zipline?: ZiplineConfig;
	naviac?: NaviacConfig;
	web?: WebConfig;
}

export interface ZiplineConfig {
	token: string;
	url: string;
	chunkSize: number;
	maxFileSize: number;
}

export interface NaviacConfig {
	username: string;
	token: string;
}

export interface WebConfig {
	enabled: boolean;
	hostname: string;
	port: number;
	secure: boolean;
	keepPort: boolean;
	auth: AuthConfig;
	jwt: JwtConfig;
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

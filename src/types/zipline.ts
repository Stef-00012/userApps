type AnyCase<T extends string> = string extends T 
	? string
	: T extends `${infer F1}${infer F2}${infer R}` 
		? `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
		: T extends `${infer F}${infer R}` 
			? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
			: "";

type Nullable<T> = T | null;

export interface ZiplineRequestData {
	url: string;
	vanity?: string;
}

export interface ZiplineUploadConfig {
	maxViews: Nullable<number>;
	compression: Nullable<number>;
	nameFormat: Nullable<AnyCase<"uuid" | "date" | "random" | "name" | "gfycat">>;
	password: Nullable<string>;
	folder: Nullable<string>;
	filename: Nullable<string>;
	text: boolean;
	overrideDomain: Nullable<string>;
	zeroWidthSpaces: Nullable<boolean>;
	originalName: Nullable<boolean>;
	embed: Nullable<boolean>;
	expiration: Nullable<
		| "never"
		| "5m"
		| "10m"
		| "15m"
		| "30m"
		| "1h"
		| "2h"
		| "3h"
		| "4h"
		| "5h"
		| "6h"
		| "8h"
		| "12h"
		| "1d"
		| "3d"
		| "5d"
		| "7d"
		| "1w"
		| "1.5w"
		| "2w"
		| "3w"
		| "1M"
		| "1.5M"
		| "2M"
		| "3M"
		| "6M"
		| "8M"
		| "1y"
	>;
}

export interface ZiplineUploadResponseV3 {
	files: string[];
}

export interface ZiplineUploadResponseV4 {
	files: { url: string }[];
}

export type ZiplineUploadResponse<T extends "v3" | "v4"> = T extends "v3" ? ZiplineUploadResponseV3 : ZiplineUploadResponseV4;

export interface ZiplineShortenResponse {
	url: string;
}

export interface ZiplineFolder {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	public: boolean;
	userId: string;
}
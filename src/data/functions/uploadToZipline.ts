import type { MimeTypesKey } from "?/mimetypes";
import guessMimetype from "$/guessMimetype";
import type { Blob } from "node:buffer";
import config from "$config";
import axios from "axios";
import type {
	ZiplineUploadConfig,
	ZiplineUploadResponse,
	ZiplineUploadResponseV3,
	ZiplineUploadResponseV4,
} from "?/zipline";

const urlRegex = /^http:\/\/(.*)?|https:\/\/(.*)?$/;

export default async function uploadToZipline(
	blob: Blob,
	uploadConfig: ZiplineUploadConfig,
) {
	const hostname = config.zipline?.url;
	const token = config.zipline?.token;
	const apiVersion = config.zipline?.version || "v3";
	const maxUploadSize = config.zipline?.maxFileSize || 75;
	const chunkSize = config.zipline?.chunkSize || 50;

	const maxViews = uploadConfig.maxViews;
	const fileExpiration = uploadConfig.expiration || "never";
	const fileCompression = uploadConfig.compression;
	const fileNameFormat = uploadConfig.nameFormat || "random";
	const password = uploadConfig.password;
	const folder = uploadConfig.folder;
	const overrideDomain = uploadConfig.overrideDomain;
	const zeroWidthSpaces = uploadConfig.zeroWidthSpaces;
	const embed = uploadConfig.embed;
	const originalName = uploadConfig.originalName;
	const filename =
		uploadConfig.filename ||
		`${new Date().toISOString()}.${
			uploadConfig.text
				? "txt"
				: (await guessMimetype(blob.type as MimeTypesKey)) || "png"
		}`;

	if (!hostname) return null;

	if (!urlRegex.test(hostname)) return null;

	if (!token) return null;

	const headers: {
		[key: string]: string;
	} = {};

	const expirationLegend = {
		never: null,
		"5m": new Date(Date.now() + 5 * 60 * 1000).toISOString(),
		"10m": new Date(Date.now() + 10 * 60 * 1000).toISOString(),
		"15m": new Date(Date.now() + 15 * 60 * 1000).toISOString(),
		"30m": new Date(Date.now() + 30 * 60 * 1000).toISOString(),
		"1h": new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
		"2h": new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
		"3h": new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
		"4h": new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
		"5h": new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
		"6h": new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
		"8h": new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
		"12h": new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
		"1d": new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
		"3d": new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
		"5d": new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
		"7d": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		"1w": new Date(Date.now() + 1 * 7 * 24 * 60 * 60 * 1000).toISOString(),
		"1.5w": new Date(Date.now() + 1.5 * 7 * 24 * 60 * 60 * 1000).toISOString(),
		"2w": new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000).toISOString(),
		"3w": new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000).toISOString(),
		"1M": new Date(Date.now() + 1 * 30.44 * 24 * 60 * 60 * 1000).toISOString(), // 30.44 is the average days in 1 month
		"1.5M": new Date(
			Date.now() + 1.5 * 30.44 * 24 * 60 * 60 * 1000,
		).toISOString(),
		"2M": new Date(Date.now() + 2 * 30.44 * 24 * 60 * 60 * 1000).toISOString(),
		"3M": new Date(Date.now() + 3 * 30.44 * 24 * 60 * 60 * 1000).toISOString(),
		"6M": new Date(Date.now() + 6 * 30.44 * 24 * 60 * 60 * 1000).toISOString(),
		"8M": new Date(Date.now() + 8 * 30.44 * 24 * 60 * 60 * 1000).toISOString(),
		"1y": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
	};

	const expiration = expirationLegend[fileExpiration];

	if (apiVersion === "v3") {
		headers["Authorization"] = token;
		headers["Format"] = fileNameFormat.toLowerCase();

		if (fileCompression)
			headers["Image-Compression-Percent"] = String(fileCompression);
		if (maxViews) headers["Max-Views"] = String(maxViews);
		if (password) headers["Password"] = password;
		if (overrideDomain)
			headers["Override-Domain"] = overrideDomain.split("/")[2];
		if (zeroWidthSpaces) headers["Zws"] = "true";
		if (embed) headers["Embed"] = "true";
		if (expiration) headers["Expiration-At"] = `date=${expiration}`;
		if (originalName) headers["Original-Name"] = "true";
	} else if (apiVersion === "v4") {
		headers["Authorization"] = token;
		headers["X-Zipline-Format"] = fileNameFormat.toLowerCase();

		if (fileCompression)
			headers["X-Zipline-Image-Compression-Percent"] = String(fileCompression);
		if (maxViews) headers["X-Zipline-Max-Views"] = String(maxViews);
		if (password) headers["X-Zipline-Password"] = password;
		if (folder && folder !== "noFolder") headers["X-Zipline-Folder"] = folder;
		if (overrideDomain)
			headers["X-Zipline-Domain"] = overrideDomain.split("/")[2];
		if (expiration) headers["X-Zipline-Deletes-At"] = `date=${expiration}`;
		if (originalName) headers["X-Zipline-Original-Name"] = "true";
	}

	if (blob.size > maxUploadSize * 1024 * 1024) return null;

	if (blob.size < 95 * 1024 * 1024) {
		const formData = new FormData();

		formData.append("file", blob, filename);

		try {
			const res = await axios.post(`${hostname}/api/upload`, formData, {
				headers,
			});

			const fetchedData = await res.data;

			if (apiVersion === "v3") {
				const data = fetchedData as ZiplineUploadResponse<typeof apiVersion>;

				const url = data?.files?.[0];

				if (url)
					return {
						filename,
						url,
					};
			} else if (apiVersion === "v4") {
				const data = fetchedData as ZiplineUploadResponse<typeof apiVersion>;

				const url = data?.files?.[0]?.url;

				if (url)
					return {
						filename,
						url,
					};
			}

			return null;
		} catch (e) {
			return null;
		}
	} else {
		const numberOfChunks = Math.ceil(blob.size / (chunkSize * 1024 * 1024));

		const identifier = generateRandomString();

		for (let i = numberOfChunks - 1; i >= 0; i--) {
			const start = i * (chunkSize * 1024 * 1024);
			const end = Math.min(start + chunkSize * 1024 * 1024, blob.size);

			const chunk = blob.slice(start, end);
			const formData = new FormData();

			formData.append("file", chunk, filename);

			headers["Content-Range"] = `bytes ${start}-${end - 1}/${blob.size}`;

			if (apiVersion === "v3") {
				headers["X-Zipline-Partial-Filename"] = filename;
				headers["X-Zipline-Partial-Lastchunk"] = i === 0 ? "true" : "false";
				headers["X-Zipline-Partial-Identifier"] = identifier;
				headers["X-Zipline-Partial-Mimetype"] = blob.type;
			} else if (apiVersion === "v4") {
				headers["X-Zipline-P-Filename"] = filename;
				headers["X-Zipline-P-Lastchunk"] = i === 0 ? "true" : "false";
				headers["X-Zipline-P-Identifier"] = identifier;
				headers["X-Zipline-P-Content-Type"] = blob.type;
				headers["X-Zipline-P-Content-Length"] = String(blob.size);
			}

			try {
				const res = await axios.post(`${hostname}/api/upload`, formData, {
					headers,
				});

				const fetchedData = (await res.data) as
					| ZiplineUploadResponseV3
					| ZiplineUploadResponseV4;

				if (apiVersion === "v3" && fetchedData.files) {
					const data = fetchedData as ZiplineUploadResponse<typeof apiVersion>;

					return {
						url: data.files[0],
						filename,
					};
				}
				if (apiVersion === "v4" && fetchedData.files?.length > 0) {
					const data = fetchedData as ZiplineUploadResponse<typeof apiVersion>;

					return {
						url: data.files?.[0]?.url,
						filename,
					};
				}
			} catch (e) {
				return null;
			}
		}
	}
}

function generateRandomString(): string {
	return Math.random().toString(36).substring(2, 6);
}

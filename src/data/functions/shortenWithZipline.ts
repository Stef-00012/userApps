import config from "$config";
import axios from "axios";

type Nullable<T> = T | null;

const urlRegex = /^http:\/\/(.*)?|https:\/\/(.*)?$/;

interface Props {
    url: string;
    vanity: Nullable<string>;
    password: Nullable<string>;
    maxViews: Nullable<number>;
}

export default async function shortenWithZipline({
	url,
	vanity,
	password: urlPassword,
	maxViews: urlMaxViews,
}: Props) {
	const token = config.zipline?.token
    const hostname = config.zipline?.url
    const apiVersion = config.zipline?.version

	if (!hostname) return null;

	if (!urlRegex.test(hostname)) return null;

	if (!token) return null;

	try {
		let endpoint = "/api/shorten";
		const body: {
            [key: string]: string
        } = {};
		const extraHeaders: {
            [key: string]: string
        } = {};

		if (apiVersion === "v3") {
			endpoint = "/api/shorten";

			body["url"] = url;
			if (vanity) body["vanity"] = vanity;
		} else if (apiVersion === "v4") {
			endpoint = "/api/user/urls";

			body["destination"] = url;
			if (vanity) body["vanity"] = vanity;

			if (urlMaxViews) extraHeaders["X-Zipline-Max-Views"] = String(urlMaxViews);
			if (urlPassword) extraHeaders["X-Zipline-Password"] = urlPassword;
		}

        const res = await axios.post(`${hostname}${endpoint}`, body, {
            headers: {
                Authorization: token,
				"Content-Type": "application/json",
				...extraHeaders,
            }
        })

		const data = await res.data;

		if (data) return data.url;
	} catch (e) {
		return null;
	}
}
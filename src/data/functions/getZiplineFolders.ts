import type { ZiplineFolder } from "?/zipline";
import config from "$config";
import axios from "axios";

export default async function getZiplineFolders(): Promise<
	Array<ZiplineFolder>
> {
	const hostname = config.zipline?.url;
	const token = config.zipline?.token;

	if (!hostname || !token) return [];

	try {
		const res = await axios.get(`${hostname}/api/user/folders?noincl=true`, {
			headers: {
				Authorization: token,
			},
		});

		return res.data as Array<ZiplineFolder>;
	} catch (e) {
		console.log(e);
		return [];
	}
}

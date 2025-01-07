//https://mcstatus.io/docs#routes
import type { McstatusIoJavaServerResponse } from "?/mcstatus.io";
import axios from "axios";

export default async function getMCJavaServerStatus(
	address: string,
): Promise<McstatusIoJavaServerResponse | null> {
	const endpoint = `https://api.mcstatus.io/v2/status/java/${address}`;

	try {
		const req = await axios.get(endpoint);

		return req.data as McstatusIoJavaServerResponse;
	} catch (e) {
		return null;
	}
}

//https://mcstatus.io/docs#routes
import type { McstatusIoBedrockServerResponse } from "?/mcstatus.io";
import axios from "axios";

export default async function getMCBedrockServerStatus(
	address: string,
): Promise<McstatusIoBedrockServerResponse | null> {
	const endpoint = `https://api.mcstatus.io/v2/status/bedrock/${address}`;

	try {
		const req = await axios.get(endpoint);

		return req.data as McstatusIoBedrockServerResponse;
	} catch (e) {
		return null;
	}
}

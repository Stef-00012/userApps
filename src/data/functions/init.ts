import config from "$config";
import type { CommandStatus } from "?/permissions";
import cmds from "@/commands";

export default async function init(): Promise<void> {
	const commandPermissionsFile = Bun.file(
		`${__dirname}/../permissions/commandPermissions.json`,
	);
	const commandPermissionsFileExists = await commandPermissionsFile.exists();

	if (!commandPermissionsFileExists) {
		const commandPermissions = {
			eval: config.owners,
			perms: config.owners,
			status: config.owners,
			console: config.owners,
		};

		Bun.write(
			`${__dirname}/../permissions/commandPermissions.json`,
			JSON.stringify(commandPermissions, null, 4),
		);
	}

	const commandStatusFile = Bun.file(
		`${__dirname}/../permissions/commandStatus.json`,
	);
	const commandStatusFileExists = await commandStatusFile.exists();

	if (!commandStatusFileExists) {
		const commands = cmds.map((cmd) => cmd.name);

		let commandStatus: CommandStatus = {};

		for (const command of commands) {
			commandStatus[command] = true;
		}

		commandStatus = {
			...commandStatus,
			ask: false,
			upload: false,
			shorten: false,
		};

		Bun.write(
			`${__dirname}/../permissions/commandStatus.json`,
			JSON.stringify(commandStatus, null, 4),
		);
	}
}

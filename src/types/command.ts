import type { Client } from "&/DiscordClient";
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
} from "discord.js";

export interface Command {
	name: string;
	requires: string[];
	execute: (
		client: Client,
		int:
			| ChatInputCommandInteraction
			| MessageContextMenuCommandInteraction
			| UserContextMenuCommandInteraction,
	) => any | Promise<any>;
	autocomplete?: (
		client: Client,
		int: AutocompleteInteraction,
	) => any | Promise<any>;
}

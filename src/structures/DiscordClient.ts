import { Client as DiscordClient, Collection } from "discord.js";
import type { Command } from "?/command";
import DbSchema from "@/db/schema";
import Db from "@/db/db";

export class Client extends DiscordClient {
	readonly commands: Collection<string, Command> = new Collection();
	readonly dbSchema = DbSchema;
	readonly db = Db;
}

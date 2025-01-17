import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const analytics = sqliteTable("analytics", {
	commandName: text("command_name").notNull().primaryKey(),
	uses: integer("uses").notNull().default(0),
});

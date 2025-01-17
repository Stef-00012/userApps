import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ptero = sqliteTable("ptero", {
	id: text("id").notNull().primaryKey(),
	panelUrl: text("panel_url").notNull(),
	apiKey: text("api_key").notNull(),
});

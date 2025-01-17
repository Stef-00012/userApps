import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tokens = sqliteTable("tokens", {
	id: text("id").notNull().primaryKey(),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token").notNull(),
	expiresAt: text("expires_at").notNull(),
	scopes: text("scopes"),
});

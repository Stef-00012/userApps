import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tags = sqliteTable(
	"tags",
	{
		id: text("id").notNull(),
		name: text("name").notNull(),
		data: text("data", {
			mode: "json",
		}).notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.id, table.name],
			}),
		};
	},
);

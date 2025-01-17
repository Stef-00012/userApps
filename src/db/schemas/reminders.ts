import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reminders = sqliteTable(
	"reminders",
	{
		userId: text("user_id").notNull(),
		reminderId: text("reminder_id").notNull(),
		description: text("description").notNull(),
		date: text("date").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.userId, table.reminderId],
			}),
		};
	},
);

import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const reminders = sqliteTable(
	"reminders",
	{
		userId: text("user_id").notNull(),
		reminderId: text("reminder_id").notNull(),
		description: text("description").notNull(),
		date: text("date"), // backwards compatibility
		lastRun: text("last_run").notNull(),
		repeat: integer("repeat").notNull().default(1),
		interval: integer("interval").notNull(),
		repetitions: integer("repetitions").notNull().default(0)
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.userId, table.reminderId],
			}),
		};
	},
);

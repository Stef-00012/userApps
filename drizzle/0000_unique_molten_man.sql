CREATE TABLE `analytics` (
	`command_name` text PRIMARY KEY NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ptero` (
	`id` text PRIMARY KEY NOT NULL,
	`panel_url` text NOT NULL,
	`api_key` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`user_id` text NOT NULL,
	`reminder_id` text NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	PRIMARY KEY(`user_id`, `reminder_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`id`, `name`)
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text NOT NULL,
	`expires_at` text NOT NULL,
	`scopes` text
);

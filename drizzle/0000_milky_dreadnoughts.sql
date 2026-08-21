CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`company_id` text NOT NULL,
	`company_name` text NOT NULL,
	`position` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`applied_at` text NOT NULL,
	`stage` text NOT NULL,
	`next_at` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_applications_user_updated` ON `applications` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `follows` (
	`user_id` text NOT NULL,
	`company_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `company_id`)
);

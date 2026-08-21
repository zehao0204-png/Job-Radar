import { index, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  companyId: text('company_id').notNull(),
  companyName: text('company_name').notNull(),
  position: text('position').notNull(),
  location: text('location').notNull().default(''),
  appliedAt: text('applied_at').notNull(),
  stage: text('stage').notNull(),
  nextAt: text('next_at').notNull().default(''),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [index('idx_applications_user_updated').on(table.userId, table.updatedAt)]);

export const follows = sqliteTable('follows', {
  userId: text('user_id').notNull(),
  companyId: text('company_id').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.companyId] })]);

export type Application = typeof applications.$inferSelect;

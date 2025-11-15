import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const fleets = pgTable('fleets', {
  id: varchar('id', { length: 32 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  tags: varchar('tags', { length: 32 }).array().notNull(),
  memo: text('memo').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Fleet = InferSelectModel<typeof fleets>;
export type NewFleet = InferInsertModel<typeof fleets>;

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const fleets = pgTable(
  'fleets',
  {
    id: varchar('id', { length: 32 }).primaryKey(),
    userId: varchar('user_id', { length: 32 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    tags: varchar('tags', { length: 32 }).array().notNull(),
    memo: text('memo').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('user_id_idx').on(table.userId)],
);

export type Fleet = InferSelectModel<typeof fleets>;
export type NewFleet = InferInsertModel<typeof fleets>;

import { pgTable, text, jsonb, timestamp, uuid, integer, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('My Resume'),
  body: jsonb('body').notNull().$type<{
    personal: {
      fullName: string;
      title: string;
      email: string;
      phone: string;
      location: string;
      github: string;
    };
    experience: Array<{ id: number; company: string; position: string; period: string; desc: string }>;
    education: Array<{ id: number; school: string; degree: string; period: string }>;
    skills: string[];
    languages: string;
  }>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));

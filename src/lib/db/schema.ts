import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "member"] })
    .notNull()
    .default("member"),

  // Plan & usage
  plan: text("plan", { enum: ["free", "lite", "premium"] })
    .notNull()
    .default("free"),
  generateCount: integer("generate_count").notNull().default(0),
  generateResetAt: text("generate_reset_at"), // ISO string, reset tiap bulan

  // Payment-ready fields
  paymentCustomerId: text("payment_customer_id"),
  paymentSubscriptionId: text("payment_subscription_id"),
  planExpiresAt: text("plan_expires_at"),

  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
});

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  htmlContent: text("html_content").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishSlug: text("publish_slug").unique(),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()),
});

export const transactions = sqliteTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  plan: text("plan", { enum: ["lite", "premium"] }).notNull(),
  amount: integer("amount").notNull(),
  status: text("status", { enum: ["pending", "success", "failed"] })
    .notNull()
    .default("pending"),
  paymentMethod: text("payment_method"),
  externalId: text("external_id"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

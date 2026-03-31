import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_FILE = path.resolve(
  process.cwd(),
  process.env.DATABASE_URL ?? "sqlite.db"
);

const sqlite = new Database(DB_FILE);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

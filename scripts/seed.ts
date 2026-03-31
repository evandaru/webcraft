import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users } from "../src/lib/db/schema";
import bcrypt from "bcryptjs";

const sqlite = new Database("./sqlite.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite);

async function seed() {
  console.log("🌱 Seeding database...");

  await db
    .insert(users)
    .values([
      {
        name: "Admin WebCraft",
        email: "admin@webcraft.id",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        plan: "premium",
        generateCount: 0,
      },
      {
        name: "Demo Member",
        email: "demo@webcraft.id",
        password: await bcrypt.hash("demo123", 10),
        role: "member",
        plan: "free",
        generateCount: 0,
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed selesai!");
  console.log("   Admin: admin@webcraft.id / admin123");
  console.log("   Demo:  demo@webcraft.id  / demo123");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed gagal:", e);
  process.exit(1);
});

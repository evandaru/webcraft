import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, count, desc, like, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "12"));
    const search = searchParams.get("q") ?? "";
    const offset = (page - 1) * limit;

    const whereClause = search
      ? and(
          eq(projects.userId, session.user.id),
          like(projects.title, `%${search}%`)
        )
      : eq(projects.userId, session.user.id);

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(whereClause)
        .orderBy(desc(projects.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(projects).where(whereClause),
    ]);

    return NextResponse.json({ projects: items, total });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

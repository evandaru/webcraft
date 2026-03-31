import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, projects } from "@/lib/db/schema";
import { count, eq, sum } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      [{ totalUsers }],
      [{ totalProjects }],
      planDistribution,
    ] = await Promise.all([
      db.select({ totalUsers: count() }).from(users),
      db.select({ totalProjects: count() }).from(projects),
      db
        .select({ plan: users.plan, count: count() })
        .from(users)
        .groupBy(users.plan),
    ]);

    const planMap = Object.fromEntries(
      planDistribution.map((p) => [p.plan, p.count])
    ) as Record<string, number>;

    return NextResponse.json({
      totalUsers,
      totalProjects,
      planDistribution: {
        free: planMap.free ?? 0,
        lite: planMap.lite ?? 0,
        premium: planMap.premium ?? 0,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

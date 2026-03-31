import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";

const roleSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Double-check admin role in API handler
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }

    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, params.id))
      .get();

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .update(users)
      .set({
        role: parsed.data.role,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, params.id));

    return NextResponse.json({ role: parsed.data.role });
  } catch (error) {
    console.error("Admin update role error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

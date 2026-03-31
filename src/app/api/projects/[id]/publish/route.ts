import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";
import { NextResponse } from "next/server";

const publishSchema = z.object({
  isPublished: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = publishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
    }

    const { isPublished } = parsed.data;

    // Verify ownership
    const project = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, params.id),
          eq(projects.userId, session.user.id)
        )
      )
      .get();

    if (!project) {
      return NextResponse.json(
        { error: "Project tidak ditemukan" },
        { status: 404 }
      );
    }

    // Generate slug jika publish dan belum ada slug
    let publishSlug = project.publishSlug;
    if (isPublished && !publishSlug) {
      publishSlug = generateSlug(12);
    }

    const [updated] = await db
      .update(projects)
      .set({
        isPublished,
        publishSlug: isPublished ? publishSlug : project.publishSlug,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, params.id))
      .returning();

    return NextResponse.json({
      isPublished: updated.isPublished,
      publishSlug: updated.publishSlug,
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

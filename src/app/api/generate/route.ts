import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, projects } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateLandingPage } from "@/lib/ai";
import { canGenerate } from "@/lib/plan";
import { type Plan } from "@/lib/plan";
import { z } from "zod";
import { NextResponse } from "next/server";

const generateSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt minimal 10 karakter")
    .max(1000, "Prompt maksimal 1000 karakter"),
});

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const body: unknown = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Input tidak valid" },
        { status: 400 }
      );
    }

    const { prompt } = parsed.data;

    // Get FRESH user data from DB (bukan dari session)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .get();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check plan limit
    if (!canGenerate(user.generateCount, user.plan as Plan)) {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          code: "LIMIT_REACHED",
          plan: user.plan,
          limit: user.generateCount,
          message: `Batas generate plan ${user.plan} sudah tercapai`,
        },
        { status: 403 }
      );
    }

    // Generate landing page via Claude API
    const htmlContent = await generateLandingPage(prompt);

    // Extract title from prompt (first 60 chars)
    const title =
      prompt.length > 60 ? prompt.slice(0, 57) + "..." : prompt;

    // Save project to DB
    const [project] = await db
      .insert(projects)
      .values({
        userId: user.id,
        title,
        prompt,
        htmlContent,
        isPublished: false,
      })
      .returning();

    // Increment generateCount
    await db
      .update(users)
      .set({
        generateCount: sql`${users.generateCount} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json(
      {
        projectId: project.id,
        htmlContent: project.htmlContent,
        title: project.title,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

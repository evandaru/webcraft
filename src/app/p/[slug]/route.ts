import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await db
      .select({ htmlContent: projects.htmlContent, isPublished: projects.isPublished })
      .from(projects)
      .where(eq(projects.publishSlug, params.slug))
      .get();

    if (!project || !project.isPublished) {
      return new Response(
        "<!DOCTYPE html><html><head><title>Not Found</title></head><body style='font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fff'><div style='text-align:center'><h1>404</h1><p>Page not found or not published</p><a href='/' style='color:#6366f1'>Kembali ke WebCraft</a></div></body></html>",
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response(project.htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Published page error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

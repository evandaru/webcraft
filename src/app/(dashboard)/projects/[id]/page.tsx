import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectActionButtons } from "@/components/dashboard/ProjectActionButtons";
import { ArrowLeft, Globe, GlobeLock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Project Detail" };

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, params.id), eq(projects.userId, session.user.id))
    )
    .get();

  if (!project) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <Badge
              variant={project.isPublished ? "default" : "secondary"}
              className="gap-1"
            >
              {project.isPublished ? (
                <>
                  <Globe className="h-3 w-3" /> Published
                </>
              ) : (
                <>
                  <GlobeLock className="h-3 w-3" /> Draft
                </>
              )}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dibuat: {formatDate(project.createdAt ?? "")}
          </p>
        </div>
      </div>

      {/* Prompt */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Prompt
        </p>
        <p className="text-sm">{project.prompt}</p>
      </div>

      {/* Action buttons (client component) */}
      <ProjectActionButtons
        projectId={project.id}
        htmlContent={project.htmlContent}
        initialIsPublished={project.isPublished ?? false}
        initialPublishSlug={project.publishSlug ?? null}
        projectTitle={project.title}
      />

      {/* Preview */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <span className="flex-1 text-center text-xs text-muted-foreground">
            {project.title}
          </span>
        </div>
        <iframe
          srcDoc={project.htmlContent}
          sandbox="allow-scripts"
          className="h-[600px] w-full border-0"
          title={project.title}
        />
      </div>
    </div>
  );
}

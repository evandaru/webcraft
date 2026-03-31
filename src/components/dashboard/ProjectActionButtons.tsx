"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Globe, GlobeLock, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ProjectActionButtonsProps {
  projectId: string;
  htmlContent: string;
  initialIsPublished: boolean;
  initialPublishSlug: string | null;
  projectTitle: string;
}

export function ProjectActionButtons({
  projectId,
  htmlContent,
  initialIsPublished,
  initialPublishSlug,
  projectTitle,
}: ProjectActionButtonsProps) {
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [publishSlug, setPublishSlug] = useState(initialPublishSlug);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleDownload = useCallback(() => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [htmlContent, projectTitle]);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (!res.ok) {
        toast.error("Gagal update publish status");
        return;
      }

      const data = await res.json() as {
        publishSlug: string | null;
        isPublished: boolean;
      };
      setIsPublished(data.isPublished);
      setPublishSlug(data.publishSlug);

      if (data.isPublished && data.publishSlug) {
        toast.success(`Published! Buka di /p/${data.publishSlug}`);
      } else {
        toast.success("Unpublished");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsPublishing(false);
    }
  }, [projectId, isPublished]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleDownload} variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Download HTML
      </Button>
      <Button
        onClick={handlePublish}
        variant={isPublished ? "secondary" : "default"}
        disabled={isPublishing}
        className="gap-2"
      >
        {isPublishing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPublished ? (
          <GlobeLock className="h-4 w-4" />
        ) : (
          <Globe className="h-4 w-4" />
        )}
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      {isPublished && publishSlug && (
        <a
          href={`/p/${publishSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          /p/{publishSlug}
        </a>
      )}
    </div>
  );
}

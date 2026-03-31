"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeBanner } from "@/components/shared/UpgradeBanner";
import {
  Sparkles,
  Download,
  Globe,
  GlobeLock,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { Plan } from "@/lib/plan";
import { PLAN_LIMITS } from "@/lib/plan";

interface GenerateFormProps {
  initialGenerateCount: number;
  plan: Plan;
  userId: string;
}

export function GenerateForm({
  initialGenerateCount,
  plan,
  userId,
}: GenerateFormProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [publishSlug, setPublishSlug] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [generateCount, setGenerateCount] = useState(initialGenerateCount);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Tulis prompt terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setIsLimitReached(false);
    setHtmlContent(null);
    setProjectId(null);
    setPublishSlug(null);
    setIsPublished(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 403) {
        setIsLimitReached(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? "Gagal generate, coba lagi");
        return;
      }

      const data = await res.json() as {
        projectId: string;
        htmlContent: string;
      };
      setHtmlContent(data.htmlContent);
      setProjectId(data.projectId);
      setGenerateCount((c) => c + 1);
      toast.success("Landing page berhasil digenerate!");
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, router]);

  const handleDownload = useCallback(() => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-page-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [htmlContent]);

  const handlePublish = useCallback(async () => {
    if (!projectId) return;
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

      const data = await res.json() as { publishSlug: string | null; isPublished: boolean };
      setIsPublished(data.isPublished);
      setPublishSlug(data.publishSlug);

      if (data.isPublished && data.publishSlug) {
        toast.success(`Published! Link: /p/${data.publishSlug}`);
      } else {
        toast.success("Unpublished");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsPublishing(false);
    }
  }, [projectId, isPublished]);

  const limit = PLAN_LIMITS[plan];
  const remaining = Math.max(0, limit - generateCount);

  return (
    <div className="flex flex-col gap-6">
      {/* Input area */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4">
          <Label htmlFor="prompt" className="text-base font-semibold">
            Deskripsikan landing page yang kamu inginkan
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">
            {remaining > 0
              ? `${remaining} generate tersisa bulan ini`
              : "Batas generate tercapai"}
          </p>
        </div>
        <Textarea
          id="prompt"
          placeholder="Contoh: Buatkan landing page untuk aplikasi task manager bernama 'TaskFlow' dengan target profesional muda. Gunakan tema dark dan modern, tampilkan fitur kolaborasi tim, integrasi calendar, dan pricing plan..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4 min-h-[140px] resize-none text-sm"
          disabled={isLoading}
        />
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || remaining === 0}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Landing Page
              </>
            )}
          </Button>
          {htmlContent && (
            <Button
              variant="outline"
              onClick={() => {
                setHtmlContent(null);
                setProjectId(null);
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Limit reached */}
      {isLimitReached && (
        <UpgradeBanner
          currentPlan={plan}
          generatesUsed={generateCount}
          generatesLimit={limit}
        />
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Claude AI sedang generate landing page kamu...
          </div>
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      )}

      {/* Preview */}
      {htmlContent && !isLoading && (
        <div className="space-y-4">
          {/* Action buttons */}
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

          {/* iframe preview */}
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="flex-1 text-center text-xs text-muted-foreground">
                Preview — Generated Landing Page
              </span>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              sandbox="allow-scripts"
              className="h-[600px] w-full border-0"
              title="Generated Landing Page Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

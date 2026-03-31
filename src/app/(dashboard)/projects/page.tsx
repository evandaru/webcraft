"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Sparkles, Search } from "lucide-react";
import type { Project } from "@/lib/db/schema";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const limit = 12;

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { q: search } : {}),
      });
      const res = await fetch(`/api/projects?${params}`);
      if (res.ok) {
        const data = await res.json() as { projects: Project[]; total: number };
        setProjects(data.projects);
        setTotal(data.total);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-sm text-muted-foreground">
            {total} project tersimpan
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/generate">
            <Sparkles className="h-4 w-4" /> Generate Baru
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari project..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Projects grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="mb-3 text-4xl">👀</div>
          <h3 className="mb-1 font-semibold">
            {search ? "Tidak ada project yang cocok" : "Belum ada project"}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {search
              ? "Coba kata kunci lain"
              : "Generate landing page pertamamu sekarang!"}
          </p>
          {!search && (
            <Button asChild className="gap-2">
              <Link href="/generate">
                <Sparkles className="h-4 w-4" /> Generate Sekarang
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDeleted={fetchProjects}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}

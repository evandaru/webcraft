"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  ExternalLink,
  Download,
  Globe,
  GlobeLock,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, truncate } from "@/lib/utils";
import type { Project } from "@/lib/db/schema";

interface ProjectCardProps {
  project: Project;
  onDeleted: () => void;
}

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([project.htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin hapus project ini?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Project dihapus");
        onDeleted();
      } else {
        toast.error("Gagal menghapus project");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base">
            {project.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download HTML
              </DropdownMenuItem>
              {project.isPublished && project.publishSlug && (
                <DropdownMenuItem asChild>
                  <a
                    href={`/p/${project.publishSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Buka Preview
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {truncate(project.prompt, 120)}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-xs text-muted-foreground">
          {formatDate(project.createdAt ?? "")}
        </span>
        <Badge
          variant={project.isPublished ? "default" : "secondary"}
          className="gap-1 text-xs"
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
      </CardFooter>
    </Card>
  );
}

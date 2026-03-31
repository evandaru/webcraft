import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, users } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsageBar } from "@/components/dashboard/UsageBar";
import { Sparkles, FolderOpen, TrendingUp, ArrowRight } from "lucide-react";
import { type Plan, PLAN_LIMITS, remainingGenerates } from "@/lib/plan";
import { formatDate, truncate } from "@/lib/utils";
import { PlanBadge } from "@/components/shared/PlanBadge";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fresh user data from DB
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .get();

  if (!user) redirect("/login");

  // Recent projects
  const recentProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt))
    .limit(5);

  // Total projects count
  const [{ total }] = await db
    .select({ total: count() })
    .from(projects)
    .where(eq(projects.userId, user.id));

  const plan = user.plan as Plan;
  const remaining = remainingGenerates(user.generateCount, plan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Halo, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang di WebCraft Dashboard
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/generate">
            <Sparkles className="h-4 w-4" />
            Generate Baru
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" /> Total Projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Generate Bulan Ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user.generateCount}</div>
            <p className="text-xs text-muted-foreground">
              dari {PLAN_LIMITS[plan]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Plan Saat Ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PlanBadge plan={plan} />
              {plan !== "premium" && (
                <Link
                  href="/pricing"
                  className="text-xs text-primary hover:underline"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage bar */}
      <UsageBar plan={plan} generateCount={user.generateCount} />

      {/* Recent projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Project Terbaru</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/projects">
              Lihat semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recentProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mb-3 text-4xl">🚀</div>
            <h3 className="mb-1 font-semibold">Belum ada project</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Mulai generate landing page pertamamu sekarang!
            </p>
            <Button asChild className="gap-2">
              <Link href="/generate">
                <Sparkles className="h-4 w-4" />
                Generate Sekarang
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-secondary/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{project.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {truncate(project.prompt, 80)}
                  </p>
                </div>
                <div className="ml-4 shrink-0 text-xs text-muted-foreground">
                  {formatDate(project.createdAt ?? "")}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

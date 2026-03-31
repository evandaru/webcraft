import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, projects } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FolderOpen, Sparkles, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/dashboard");

  const [
    [{ totalUsers }],
    [{ totalProjects }],
    planDist,
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(users),
    db.select({ totalProjects: count() }).from(projects),
    db
      .select({ plan: users.plan, count: count() })
      .from(users)
      .groupBy(users.plan),
  ]);

  const planMap = Object.fromEntries(planDist.map((p) => [p.plan, p.count])) as Record<string, number>;
  const free = planMap.free ?? 0;
  const lite = planMap.lite ?? 0;
  const premium = planMap.premium ?? 0;

  const planPercentage = (n: number) =>
    totalUsers > 0 ? Math.round((n / totalUsers) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Statistik penggunaan WebCraft
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" /> Total Projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Paid Users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lite + premium}</div>
            <p className="text-xs text-muted-foreground">
              Lite + Premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Conversion Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {planPercentage(lite + premium)}%
            </div>
            <p className="text-xs text-muted-foreground">Free → Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Plan</CardTitle>
          <CardDescription>
            Breakdown users berdasarkan plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Free", count: free, color: "bg-muted-foreground" },
            { label: "Lite", count: lite, color: "bg-blue-500" },
            { label: "Premium", count: premium, color: "bg-yellow-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.count} users ({planPercentage(item.count)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all ${item.color}`}
                  style={{ width: `${planPercentage(item.count)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Sparkles,
  FolderOpen,
  Crown,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { type Plan } from "@/lib/plan";

const memberNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Sparkles, label: "Generate", href: "/generate" },
  { icon: FolderOpen, label: "My Projects", href: "/projects" },
  { icon: Crown, label: "Upgrade Plan", href: "/pricing" },
];

const adminNav = [
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    plan: string;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">WebCraft</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {/* Member nav */}
        {memberNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {isActive(item.href) && (
              <ChevronRight className="ml-auto h-3 w-3" />
            )}
          </Link>
        ))}

        {/* Admin nav */}
        {user.role === "admin" && (
          <>
            <Separator className="my-2" />
            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </p>
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <div className="mb-3">
          <PlanBadge plan={user.plan as Plan} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

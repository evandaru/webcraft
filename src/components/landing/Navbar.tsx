"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">WebCraft</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Mulai Gratis</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold">WebCraft</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Describe it. Build it. Launch it.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-foreground transition-colors">
              Register
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} WebCraft. Built with Next.js & Claude AI.
        </div>
      </div>
    </footer>
  );
}

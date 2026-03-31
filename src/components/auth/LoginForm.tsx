"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) return;

      setIsLoading(true);
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Email atau password salah");
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch {
        toast.error("Terjadi kesalahan, coba lagi");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, callbackUrl, router]
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">WebCraft</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selamat datang kembali</CardTitle>
            <CardDescription>Login ke akun WebCraft kamu</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password kamu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline"
                >
                  Daftar gratis
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Demo credentials */}
        <div className="mt-4 rounded-lg border border-border bg-card/50 p-4 text-sm">
          <p className="mb-2 font-medium text-muted-foreground">Demo Akun:</p>
          <div className="space-y-1 font-mono text-xs">
            <p>Admin: admin@webcraft.id / admin123</p>
            <p>Member: demo@webcraft.id / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

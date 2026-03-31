import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Zap className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h1 className="text-6xl font-black">404</h1>
        <p className="mt-2 text-xl text-muted-foreground">Halaman tidak ditemukan</p>
      </div>
      <Button asChild>
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}

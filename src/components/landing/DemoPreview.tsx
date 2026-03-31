import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Eye } from "lucide-react";

export function DemoPreview() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Lihat Hasilnya{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sendiri
            </span>
          </h2>
          <p className="text-muted-foreground">
            Contoh output yang dihasilkan AI dari satu prompt
          </p>
        </div>

        {/* Preview container */}
        <div className="relative mx-auto max-w-4xl">
          {/* Browser chrome */}
          <div className="rounded-t-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 rounded-md bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
                landing-page-preview.html
              </div>
            </div>
          </div>

          {/* Blurred preview content */}
          <div className="relative overflow-hidden rounded-b-xl border border-t-0 border-border">
            {/* Mock landing page content (blurred) */}
            <div className="blur-sm select-none">
              <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-12 text-center">
                <div className="mb-4 h-8 w-48 rounded-lg bg-white/20 mx-auto" />
                <div className="mb-6 h-16 w-3/4 rounded-xl bg-white/10 mx-auto" />
                <div className="mb-4 h-4 w-2/3 rounded bg-white/10 mx-auto" />
                <div className="h-4 w-1/2 rounded bg-white/10 mx-auto" />
                <div className="mt-8 flex justify-center gap-4">
                  <div className="h-12 w-36 rounded-full bg-white/30" />
                  <div className="h-12 w-36 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="bg-gray-900 p-12">
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-gray-800 p-6">
                      <div className="mb-3 h-10 w-10 rounded-lg bg-blue-500/30" />
                      <div className="mb-2 h-5 w-32 rounded bg-gray-600" />
                      <div className="h-4 w-full rounded bg-gray-700" />
                      <div className="mt-1 h-4 w-3/4 rounded bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
              <div className="text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 mx-auto">
                  <Lock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Login untuk Generate
                </h3>
                <p className="mb-6 max-w-xs text-sm text-muted-foreground">
                  Daftar gratis dan generate landing page pertamamu sekarang
                </p>
                <Button asChild className="gap-2">
                  <Link href="/register">
                    <Eye className="h-4 w-4" />
                    Lihat Output Saya
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

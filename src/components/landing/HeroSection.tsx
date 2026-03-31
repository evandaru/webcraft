"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleTry = () => {
    if (prompt.trim()) {
      router.push(`/register?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          Powered by Claude AI
        </div>

        {/* Headline */}
        <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
          Describe it.{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Build it.
          </span>{" "}
          Launch it.
        </h1>

        {/* Subtext */}
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Ketik deskripsi bisnis kamu, dan AI kami akan generate landing page
          HTML yang indah, responsif, dan siap dipakai — dalam hitungan detik.
        </p>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl space-y-3">
          <Textarea
            placeholder="Contoh: Buatkan landing page untuk aplikasi manajemen keuangan personal dengan target anak muda..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none border-border/60 bg-card/50 text-base backdrop-blur"
          />
          <div className="flex gap-3">
            <Button
              onClick={handleTry}
              size="lg"
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80 text-base"
            >
              <Sparkles className="h-4 w-4" />
              Mulai Gratis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Gratis untuk 1 generate pertama. Tidak perlu kartu kredit.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">30 detik</div>
            <div>Waktu generate rata-rata</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div>Siap deploy</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">No-code</div>
            <div>Tidak perlu coding</div>
          </div>
        </div>
      </div>
    </section>
  );
}

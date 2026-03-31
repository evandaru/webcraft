import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { PLAN_FEATURES, PLAN_LIMITS, PLAN_PRICES, formatPrice } from "@/lib/plan";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pilih plan yang sesuai dengan kebutuhanmu",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <div className="py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Harga yang Jujur & Transparan
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Mulai gratis, upgrade kapanpun sesuai pertumbuhan bisnis kamu.
            Tidak ada hidden fees.
          </p>
        </div>

        <PricingSection />

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">FAQ</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Apakah bisa upgrade/downgrade kapanpun?",
                  a: "Ya, kamu bisa mengubah plan kapanpun. Perubahan plan diterapkan oleh admin secara manual untuk saat ini.",
                },
                {
                  q: "Generate count reset kapan?",
                  a: "Generate count direset setiap awal bulan secara otomatis.",
                },
                {
                  q: "Output HTML bisa dipakai dimana saja?",
                  a: "Ya! Output adalah file HTML standar yang bisa diupload ke hosting manapun, atau kamu bisa publish langsung ke link publik WebCraft.",
                },
                {
                  q: "Apakah ada free trial?",
                  a: "Plan Free memberikan 1 generate gratis per bulan, tidak perlu kartu kredit.",
                },
              ].map((item, idx) => (
                <div key={idx} className="rounded-lg border border-border p-5">
                  <h3 className="mb-2 font-semibold">{item.q}</h3>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

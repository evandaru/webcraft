import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_FEATURES, PLAN_LIMITS, PLAN_PRICES, formatPrice } from "@/lib/plan";
import { Check } from "lucide-react";

const plans = [
  { key: "free" as const, popular: false },
  { key: "lite" as const, popular: true },
  { key: "premium" as const, popular: false },
];

export function PricingSection() {
  return (
    <section className="py-24" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Harga Transparan</h2>
          <p className="text-muted-foreground">
            Mulai gratis, upgrade kapanpun kamu butuh lebih
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map(({ key, popular }) => (
            <Card
              key={key}
              className={`relative flex flex-col ${
                popular
                  ? "border-primary ring-1 ring-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white text-xs px-3">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl capitalize">{key}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-black">
                    {formatPrice(PLAN_PRICES[key])}
                  </span>
                  {PLAN_PRICES[key] > 0 && (
                    <span className="text-sm text-muted-foreground">/bulan</span>
                  )}
                </div>
                <CardDescription>
                  {PLAN_LIMITS[key]}x generate per bulan
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {PLAN_FEATURES[key].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={popular ? "default" : "outline"}
                >
                  <Link href="/register">
                    {key === "free" ? "Mulai Gratis" : `Pilih ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

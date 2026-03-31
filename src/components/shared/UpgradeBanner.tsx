import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

interface UpgradeBannerProps {
  currentPlan?: string;
  generatesUsed?: number;
  generatesLimit?: number;
}

export function UpgradeBanner({
  currentPlan = "free",
  generatesUsed,
  generatesLimit,
}: UpgradeBannerProps) {
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Batas generate bulan ini tercapai!
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {generatesUsed !== undefined && generatesLimit !== undefined
                ? `Kamu sudah menggunakan ${generatesUsed}/${generatesLimit} generate untuk plan ${currentPlan}.`
                : `Plan ${currentPlan} kamu sudah mencapai batas generate bulan ini.`}{" "}
              Upgrade untuk generate lebih banyak.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0 gap-2">
          <Link href="/pricing">
            Upgrade Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

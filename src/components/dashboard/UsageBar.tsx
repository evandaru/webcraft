import { Progress } from "@/components/ui/progress";
import { PLAN_LIMITS, PLAN_LABELS, type Plan } from "@/lib/plan";
import { Zap } from "lucide-react";

interface UsageBarProps {
  plan: Plan;
  generateCount: number;
}

export function UsageBar({ plan, generateCount }: UsageBarProps) {
  const limit = PLAN_LIMITS[plan];
  const remaining = Math.max(0, limit - generateCount);
  const percentage = Math.min(100, (generateCount / limit) * 100);
  const isAlmostFull = percentage >= 80;
  const isFull = percentage >= 100;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Generate Usage</span>
        </div>
        <span
          className={`text-xs font-medium ${
            isFull
              ? "text-destructive"
              : isAlmostFull
              ? "text-yellow-400"
              : "text-muted-foreground"
          }`}
        >
          {generateCount}/{limit} ({PLAN_LABELS[plan]})
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${
          isFull
            ? "[&>div]:bg-destructive"
            : isAlmostFull
            ? "[&>div]:bg-yellow-400"
            : ""
        }`}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {isFull
          ? "Batas generate bulan ini tercapai. Upgrade untuk generate lebih."
          : `${remaining} generate tersisa bulan ini`}
      </p>
    </div>
  );
}

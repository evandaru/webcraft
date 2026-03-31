import { Badge } from "@/components/ui/badge";
import { type Plan, PLAN_LABELS } from "@/lib/plan";
import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

const planStyles: Record<Plan, string> = {
  free: "border-border text-muted-foreground",
  lite: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  premium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(planStyles[plan], className)}
    >
      {PLAN_LABELS[plan]}
    </Badge>
  );
}

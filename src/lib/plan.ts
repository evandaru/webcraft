export const PLAN_LIMITS = {
  free: 1,
  lite: 5,
  premium: 30,
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export const PLAN_PRICES = {
  free: 0,
  lite: 49000,
  premium: 149000,
} as const;

export const PLAN_LABELS = {
  free: "Free",
  lite: "Lite",
  premium: "Premium",
} as const;

export const PLAN_FEATURES = {
  free: ["1 generate/bulan", "Download HTML", "Publish ke link publik"],
  lite: [
    "5 generate/bulan",
    "Download HTML",
    "Publish ke link publik",
    "Prioritas generate lebih cepat",
  ],
  premium: [
    "30 generate/bulan",
    "Download HTML",
    "Publish ke link publik",
    "Prioritas generate tercepat",
    "Support prioritas",
  ],
} as const;

export function canGenerate(generateCount: number, plan: Plan): boolean {
  return generateCount < PLAN_LIMITS[plan];
}

export function remainingGenerates(generateCount: number, plan: Plan): number {
  return Math.max(0, PLAN_LIMITS[plan] - generateCount);
}

export function formatPrice(price: number): string {
  if (price === 0) return "Gratis";
  return `Rp ${price.toLocaleString("id-ID")}`;
}

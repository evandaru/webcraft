import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GenerateForm } from "@/components/dashboard/GenerateForm";
import { type Plan } from "@/lib/plan";

export const metadata: Metadata = { title: "Generate" };

export default async function GeneratePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get fresh data from DB
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .get();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Generate Landing Page</h1>
        <p className="text-sm text-muted-foreground">
          Deskripsikan bisnis atau produk kamu, dan AI akan generate landing
          page HTML yang siap dipakai.
        </p>
      </div>
      <GenerateForm
        initialGenerateCount={user.generateCount}
        plan={user.plan as Plan}
        userId={user.id}
      />
    </div>
  );
}

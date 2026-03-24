import { db } from "@/db";
import { usageLogs, users, aiModels } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { UsageClient } from "./usage-client";

export const dynamic = "force-dynamic";

export default async function AdminUsagePage() {
  const dbLogs = await db
    .select({
      id: usageLogs.id,
      user: users.email,
      niche: aiModels.nicheName,
      tokensIn: usageLogs.inputTokens,
      tokensOut: usageLogs.outputTokens,
      cost: usageLogs.totalCostDeducted,
      createdAt: usageLogs.createdAt,
    })
    .from(usageLogs)
    .innerJoin(users, eq(usageLogs.userId, users.id))
    .innerJoin(aiModels, eq(usageLogs.modelId, aiModels.id))
    .orderBy(desc(usageLogs.createdAt))
    .limit(100);

  const mappedLogs = dbLogs.map((l: any) => ({
    id: l.id,
    user: l.user,
    niche: l.niche,
    tokensIn: l.tokensIn,
    tokensOut: l.tokensOut,
    cost: parseFloat((l.cost || "0").toString()),
    status: "Success",
    time: new Date(l.createdAt).toLocaleDateString() + " " + new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  const metricsRow = await db
    .select({
      totalCalls: sql<number>`count(*)`.mapWith(Number),
      totalTokens: sql<number>`sum(${usageLogs.inputTokens} + ${usageLogs.outputTokens})`.mapWith(Number),
      grossRevenue: sql<number>`sum(${usageLogs.totalCostDeducted})`.mapWith(Number),
    })
    .from(usageLogs);
    
  const metrics = metricsRow[0] || { totalCalls: 0, totalTokens: 0, grossRevenue: 0 };

  return <UsageClient initialLogs={mappedLogs} initialMetrics={metrics} />;
}

import { db } from "@/db";
import { aiModels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let niches = [];
  try {
    const modelsData = await db
      .select({ id: aiModels.id, name: aiModels.nicheName })
      .from(aiModels)
      .where(eq(aiModels.isActive, true));
    niches = modelsData;
  } catch (e) {
    console.error("Failed to load active models from DB:", e);
  }

  return <HomeClient niches={niches} />;
}

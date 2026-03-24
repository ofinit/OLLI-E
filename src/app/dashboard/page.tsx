import { db } from "@/db";
import { aiModels, users, userS3Configs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HomeClient } from "./home-client";
import { mockUser } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let niches = [];
  let isS3Configured = false;

  try {
    const modelsData = await db
      .select({ id: aiModels.id, name: aiModels.nicheName, icon: aiModels.icon })
      .from(aiModels)
      .where(eq(aiModels.isActive, true));
    niches = modelsData;

    const [u] = await db.select().from(users).where(eq(users.clerkId, mockUser.clerkId)).limit(1);
    if (u) {
      const [s3] = await db.select().from(userS3Configs).where(eq(userS3Configs.userId, u.id)).limit(1);
      if (s3) isS3Configured = true;
    }
  } catch (e) {
    console.error("Failed to load active models from DB:", e);
  }

  return <HomeClient niches={niches} isS3Configured={isS3Configured} />;
}

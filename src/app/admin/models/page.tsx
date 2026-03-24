import { db } from "@/db";
import { aiModels } from "@/db/schema";
import { ModelsClient } from "./models-client";

export const dynamic = "force-dynamic";

export default async function AdminModelsPage() {
  const modelsData = await db.select().from(aiModels);
  
  // Serialize decimal types to string for passing to Client Component
  const parsedModels = modelsData.map((m: any) => ({
    ...m,
    baseCostPer1k: m.baseCostPer1k.toString(),
  }));

  return <ModelsClient initialModels={parsedModels} />;
}

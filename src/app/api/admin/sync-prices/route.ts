import { NextResponse } from "next/server";
import { db } from "@/db";
import { aiModels } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    // 1. Fetch live models from OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) throw new Error("Failed to fetch from OpenRouter");

    const data = await res.json();
    const openRouterModels = data.data;

    const dbModels = await db.select().from(aiModels);
    let syncedCount = 0;

    // 2. Map through our DB niches and update prices natively
    for (const niche of dbModels) {
      const liveModel = openRouterModels.find((m: any) => m.id === niche.providerModelId);
      
      if (liveModel && liveModel.pricing) {
        const promptCost = parseFloat(liveModel.pricing.prompt) || 0;
        const compCost = parseFloat(liveModel.pricing.completion) || 0;
        
        // Calculate average cost per 1k tokens
        const avgCostPerToken = (promptCost + compCost) / 2;
        const costPer1k = avgCostPerToken * 1000;
        
        const finalCost = costPer1k === 0 && promptCost === 0 ? 0 : costPer1k;
        const dbCostStr = finalCost.toFixed(6); // scale 6 precision

        // Optimize DB performance by only writing actual deltas
        if (niche.baseCostPer1k !== dbCostStr) {
          await db.update(aiModels)
            .set({ baseCostPer1k: dbCostStr })
            .where(eq(aiModels.id, niche.id));
          syncedCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: syncedCount, 
      message: `Updated platform base costs against live tokens for ${syncedCount} models.` 
    });

  } catch (error) {
    console.error("Error syncing prices:", error);
    return NextResponse.json({ success: false, error: "Failed to sync prices." }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}

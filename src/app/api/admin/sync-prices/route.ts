import { NextResponse } from "next/server";
import { mockNiches } from "@/lib/mock-data";

export async function POST() {
  try {
    // 1. Fetch live models from OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
         // Optionally include an API key if required for private models, but public models endpoint is unauthenticated
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) throw new Error("Failed to fetch from OpenRouter");

    const data = await res.json();
    const openRouterModels = data.data;

    // 2. Map through our local niches and update prices
    const syncedModels = mockNiches.map(niche => {
      const liveModel = openRouterModels.find((m: any) => m.id === niche.providerModelId);
      
      if (liveModel && liveModel.pricing) {
        // OpenRouter pricing is per token.
        // We calculate base cost per 1k tokens. Assuming blended average of prompt and completion for simplicity.
        const promptCost = parseFloat(liveModel.pricing.prompt) || 0;
        const compCost = parseFloat(liveModel.pricing.completion) || 0;
        
        // Calculate average cost per 1k tokens
        const avgCostPerToken = (promptCost + compCost) / 2;
        const costPer1k = avgCostPerToken * 1000;
        
        // If the model is free (like free llama variations), ensure it doesn't break math
        const finalCost = costPer1k === 0 && promptCost === 0 ? 0 : costPer1k;

        return {
          ...niche,
          baseCostPer1k: Number(finalCost.toFixed(5)),
          lastSyncedAt: new Date().toISOString()
        };
      }
      return niche;
    });

    // In a real application with a database, you would run an UPDATE transaction here.
    // e.g., await db.update(niches).set({ baseCostPer1k: ... }).where(eq(niches.id, id))

    return NextResponse.json({ 
      success: true, 
      count: syncedModels.length, 
      models: syncedModels 
    });

  } catch (error) {
    console.error("Error syncing prices:", error);
    return NextResponse.json({ success: false, error: "Failed to sync prices." }, { status: 500 });
  }
}

// Vercel Cron Jobs exclusively send GET requests to the targeted endpoint.
export async function GET() {
  return POST();
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import * as dotenv from "dotenv";
import { mockNiches } from "./src/lib/mock-data";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding ALL 16 predefined niches...");

  for (const n of mockNiches) {
    if (n.id === "agent-swarm") continue; // Swarm orchestration is handled separately, not as a standard model

    try {
      await db.insert(schema.aiModels).values({
        nicheName: n.nicheName,
        icon: n.icon,
        providerModelId: n.providerModelId,
        systemPrompt: n.systemPrompt,
        baseCostPer1k: n.baseCostPer1k,
        profitMarginPercent: n.profitMarginPercent,
        isActive: n.isActive,
      });
      console.log(`Inserted niche: ${n.nicheName} with icon ${n.icon}`);
    } catch (e) {
      console.error(`Failed to insert ${n.nicheName}:`, e);
    }
  }

  console.log("Seeding complete! You can delete any old duplicate 3 test rows from the Admin UI.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

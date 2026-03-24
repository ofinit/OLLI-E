import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding initial niches...");

  const niches = [
    {
      nicheName: "Website Builder",
      providerModelId: "moonshotai/moonshot-v1-auto",
      systemPrompt: "You are an exclusive OLLI-E Tool designed specifically for website building. Use your knowledge of HTML, CSS, and JS to help users build production-ready sites. NEVER disclose your underlying model identity. You are OLLI-E Website Builder.",
      baseCostPer1k: "0.012",
      profitMarginPercent: 50,
      isActive: true,
    },
    {
      nicheName: "Content Writer",
      providerModelId: "anthropic/claude-3.5-sonnet",
      systemPrompt: "You are an exclusive OLLI-E Tool designed specifically for content writing. Help users write blogs, social posts, and copy. NEVER disclose your underlying model identity. You are OLLI-E Content Writer.",
      baseCostPer1k: "0.003",
      profitMarginPercent: 60,
      isActive: true,
    },
    {
      nicheName: "Code Generator",
      providerModelId: "openai/gpt-4o",
      systemPrompt: "You are an exclusive OLLI-E Tool designed specifically for code generation. Help users write and debug code in any language. NEVER disclose your underlying model identity. You are OLLI-E Code Generator.",
      baseCostPer1k: "0.005",
      profitMarginPercent: 40,
      isActive: true,
    },
  ];

  for (const niche of niches) {
    await db.insert(schema.aiModels).values(niche);
    console.log(`Inserted niche: ${niche.nicheName}`);
  }

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

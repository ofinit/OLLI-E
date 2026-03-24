import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { mockNiches } from "./src/lib/mock-data";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function fix() {
  // 1. Give users some money so they can actually chat
  await sql`UPDATE wallets SET balance = '100.00'`;
  console.log("Topped up wallets to $100.00");

  // 2. Iterate mock niches and explicitly force the icon strings because they might have been omitted originally
  for (const n of mockNiches) {
    if (n.id === "agent-swarm") continue;
    await sql`UPDATE ai_models SET icon = ${n.icon} WHERE niche_name = ${n.nicheName}`;
    console.log(`Force applied icon ${n.icon} to ${n.nicheName}`);
  }

  // 3. Print the results
  const rows = await sql`SELECT id, niche_name, icon FROM ai_models`;
  console.log("Current DB State:", rows);
}

fix().catch(console.error);

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function clean() {
  console.log("Fetching all models...");
  // Fetch all models ordered by creation time to keep the newest/oldest deterministic
  const rows = await sql`SELECT id, niche_name FROM ai_models ORDER BY created_at ASC`;
  
  const seenNames = new Set();
  const idsToDelete = [];

  for (const row of rows) {
    if (seenNames.has(row.niche_name)) {
      idsToDelete.push(row.id);
    } else {
      seenNames.add(row.niche_name);
    }
  }

  console.log(`Found ${idsToDelete.length} duplicates to delete.`);
  
  for (const id of idsToDelete) {
    try {
      await sql`DELETE FROM usage_logs WHERE model_id = ${id}`;
      await sql`DELETE FROM ai_models WHERE id = ${id}`;
      console.log(`Deleted duplicate model ID: ${id}`);
    } catch(e) {
      console.error(`Failed to delete ${id}`, e);
    }
  }

  const finalRows = await sql`SELECT id, niche_name, icon FROM ai_models`;
  console.log(`Final DB count: ${finalRows.length} unique models.`);
}

clean().catch(console.error);

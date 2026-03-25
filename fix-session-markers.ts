/**
 * Run this once to clean up chat_messages rows that have SESSION markers baked in.
 * Execute with: npx ts-node --project tsconfig.json fix-session-markers.ts
 */
import { db } from "./src/db";
import { chatMessages } from "./src/db/schema";
import { like, sql } from "drizzle-orm";

async function fixSessionMarkers() {
  console.log("Fetching rows with SESSION markers...");
  const rows = await db.select({ id: chatMessages.id, content: chatMessages.content })
    .from(chatMessages);
  
  let fixed = 0;
  for (const row of rows) {
    if (row.content.includes('\x00SESSION:')) {
      const cleaned = row.content.replace(/\x00SESSION:[^\x00]+\x00/g, '').trim();
      await db.update(chatMessages)
        .set({ content: cleaned })
        .where(sql`${chatMessages.id} = ${row.id}`);
      fixed++;
      console.log(`Fixed row: ${row.id}`);
    }
  }
  
  console.log(`Done. Fixed ${fixed} rows.`);
  process.exit(0);
}

fixSessionMarkers().catch(console.error);

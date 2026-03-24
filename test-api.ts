import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function test() {
  console.log("Testing API fallback logic...");
  try {
    const [settings] = await db.select({ key: schema.platformSettings.openRouterApiKey }).from(schema.platformSettings).limit(1);
    console.log("Resolved Key (partial):", settings?.key?.substring(0, 10));

    const nicheId = "b141d8e8-9715-43e4-bf2d-da0f7ae929a7"; // from user screenshot
    console.log("Checking niche tool...");
    const [dbNiche] = await db
        .select()
        .from(schema.aiModels)
        .where(eq(schema.aiModels.id, nicheId))
        .limit(1);
    console.log("Found Niche:", dbNiche?.nicheName);

    const userId = "user_2p5X7z9W1V3U4t5S";
    console.log("Checking user...");
    const [u] = await db.select().from(schema.users).where(eq(schema.users.clerkId, userId)).limit(1);
    console.log("Found User:", u?.id);

    if (u) {
        console.log("Checking wallet...");
        const [wallet] = await db.select().from(schema.wallets).where(eq(schema.wallets.userId, u.id)).limit(1);
        console.log("Wallet Balance:", wallet?.balance);
    }
    
    console.log("All DB checks passed without throwing.");
  } catch (e) {
    console.error("API LOGIC FAILED:", e);
  }
}

test().catch(console.error);

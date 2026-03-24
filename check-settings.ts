import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkSettings() {
  console.log("Checking platform_settings...");
  const settings = await sql`SELECT * FROM platform_settings`;
  console.log("Settings:", settings);
}

checkSettings().catch(console.error);

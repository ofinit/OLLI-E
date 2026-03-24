import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function check() {
  console.log("Checking users...");
  const allUsers = await db.select().from(schema.users);
  console.log("All Users:", allUsers);

  console.log("Checking wallets...");
  const allWallets = await db.select().from(schema.wallets);
  console.log("All Wallets:", allWallets);

  console.log("Checking VERCEL ENV...");
  console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 30));
}

check().catch(console.error);

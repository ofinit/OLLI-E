import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { mockUser } from "./src/lib/mock-data";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedUser() {
  console.log("Checking for mock user...");
  const existingUsers = await db.select().from(schema.users).where(eq(schema.users.clerkId, mockUser.clerkId));

  let userId;
  if (existingUsers.length === 0) {
    console.log("Mock user not found. Inserting...");
    const inserted = await db.insert(schema.users).values({
      clerkId: mockUser.clerkId,
      email: mockUser.email,
    }).returning();
    userId = inserted[0].id;
    console.log("Inserted user:", userId);
  } else {
    userId = existingUsers[0].id;
    console.log("Found existing user:", userId);
  }

  const existingWallets = await db.select().from(schema.wallets).where(eq(schema.wallets.userId, userId));

  if (existingWallets.length === 0) {
    console.log("Wallet not found. Creating and funding wallet...");
    await db.insert(schema.wallets).values({
      userId: userId,
      balance: "100.00",
    });
    console.log("Injected $100.00 into new wallet.");
  } else {
    console.log("Wallet exists. Topping up to $100.00...");
    await db.update(schema.wallets).set({ balance: "100.00" }).where(eq(schema.wallets.userId, userId));
    console.log("Wallet topped up to $100.00.");
  }

  console.log("User provisioning complete!");
}

seedUser().catch(console.error);

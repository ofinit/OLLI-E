import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function setupMockUser() {
  const mockClerkId = "user_2p5X7z9W1V3U4t5S";
  
  console.log(`Setting up mock user: ${mockClerkId}...`);

  // 1. Create User
  const [existingUser] = await db.select().from(schema.users).where(eq(schema.users.clerkId, mockClerkId)).limit(1);
  let userId;

  if (!existingUser) {
    const [newUser] = await db.insert(schema.users).values({
      clerkId: mockClerkId,
      email: "local@olli-e.ai",
    }).returning();
    userId = newUser.id;
    console.log("Created mock user.");
  } else {
    userId = existingUser.id;
    console.log("Mock user already exists.");
  }

  // 2. Create Wallet if not exists
  const [existingWallet] = await db.select().from(schema.wallets).where(eq(schema.wallets.userId, userId)).limit(1);
  if (!existingWallet) {
    await db.insert(schema.wallets).values({
      userId: userId,
      balance: "100.0000", // Start with $100 for testing
    });
    console.log("Created mock wallet with $100 balance.");
  }

  // 3. Create mock S3 Config if not exists
  const [existingS3] = await db.select().from(schema.userS3Configs).where(eq(schema.userS3Configs.userId, userId)).limit(1);
  if (!existingS3) {
    await db.insert(schema.userS3Configs).values({
      userId: userId,
      accessKeyId: "MOCK_ACCESS_KEY",
      secretAccessKey: "MOCK_SECRET_KEY",
      region: "us-east-1",
      bucketName: "olli-e-local-mock",
    });
    console.log("Created mock S3 configuration.");
  }

  console.log("Mock setup complete!");
}

setupMockUser().catch(console.error);

import { db } from "@/db";
import { aiModels, users, userS3Configs, wallets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ChatClient } from "./chat-client";
import { redirect } from "next/navigation";
import { mockNiches, mockUser } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: Promise<{ nicheId: string }> }) {
  const { nicheId } = await params;
  
  let niche;

  // UUID Check: length 36 means it's likely a DB UUID request
  if (nicheId.length === 36) {
    try {
      const dbNiche = await db
        .select()
        .from(aiModels)
        .where(eq(aiModels.id, nicheId))
        .limit(1);

      if (dbNiche.length > 0) {
        niche = {
          ...dbNiche[0],
          baseCostPer1k: dbNiche[0].baseCostPer1k.toString()
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Fallback to mock data OR agent-swarm if DB failed
  if (!niche) {
    niche = mockNiches.find(n => n.id === nicheId);
  }
  
  // If absolutely not found, redirect back
  if (!niche && nicheId !== "agent-swarm") {
    redirect("/dashboard");
  }

  // Agent Swarm override
  if (nicheId === "agent-swarm") {
    niche = {
      id: "agent-swarm",
      nicheName: "Agent Swarm",
      icon: "Layers",
      systemPrompt: "You are the Agent Swarm."
    };
  }

  let isS3Configured = false;
  let walletBalance = "0.00";
  try {
    const [u] = await db.select().from(users).where(eq(users.clerkId, mockUser.clerkId)).limit(1);
    if (u) {
      const [s3] = await db.select().from(userS3Configs).where(eq(userS3Configs.userId, u.id)).limit(1);
      if (s3) isS3Configured = true;

      const [w] = await db.select().from(wallets).where(eq(wallets.userId, u.id)).limit(1);
      if (w) walletBalance = w.balance.toString();
    }
  } catch(e) {
    console.error(e);
  }

  return <ChatClient nicheId={nicheId} niche={niche} isS3Configured={isS3Configured} walletBalance={walletBalance} />;
}

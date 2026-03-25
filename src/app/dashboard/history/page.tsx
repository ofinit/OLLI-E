import { db } from "@/db";
import { chatSessions, aiModels } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
// import { auth } from "@clerk/nextjs/server";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
  // const { userId } = await auth();
  // if (!userId) return null;
  const clerkUserId = "user_2p5X7z9W1V3U4t5S";

  // Fetch all sessions for this user, joined with AI model metadata
  const sessions = await db
    .select({
      id: chatSessions.id,
      title: chatSessions.title,
      updatedAt: chatSessions.updatedAt,
      agentId: chatSessions.agentId,
      agentName: aiModels.nicheName,
      agentIcon: aiModels.icon,
    })
    .from(chatSessions)
    .innerJoin(aiModels, eq(chatSessions.agentId, aiModels.id))
    .where(eq(chatSessions.userId, clerkUserId))
    .orderBy(desc(chatSessions.updatedAt));

  return (
    <div className="flex-1 bg-zinc-50 overflow-y-auto w-full h-full relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="relative max-w-7xl mx-auto px-8 py-12">
        <HistoryClient initialSessions={sessions} />
      </div>
    </div>
  );
}

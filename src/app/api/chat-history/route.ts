import { db } from '@/db';
import { chatSessions, chatMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

const CLERK_USER_ID = "user_2p5X7z9W1V3U4t5S";

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ sessions: [] });
  }
  try {
    const sessions = await db
      .select({
        id: chatSessions.id,
        agentName: chatSessions.agentName,
        agentId: chatSessions.agentId,
        title: chatSessions.title,
        updatedAt: chatSessions.updatedAt,
        createdAt: chatSessions.createdAt,
      })
      .from(chatSessions)
      .where(eq(chatSessions.userId, CLERK_USER_ID))
      .orderBy(desc(chatSessions.updatedAt))
      .limit(30);
    return Response.json({ sessions });
  } catch (err: any) {
    console.error('[HISTORY GET]', err);
    return Response.json({ sessions: [], error: err.message });
  }
}

export async function DELETE(req: NextRequest) {
  if (!process.env.DATABASE_URL) return Response.json({ ok: true });
  try {
    const { sessionId } = await req.json();
    await db.delete(chatSessions).where(eq(chatSessions.id, sessionId));
    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

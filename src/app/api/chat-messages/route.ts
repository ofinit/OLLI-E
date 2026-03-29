import { db } from '@/db';
import { chatMessages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  if (!process.env.DATABASE_URL) return Response.json({ ok: true });
  try {
    const { messageId, content } = await req.json();
    if (!messageId || content === undefined) {
      return Response.json({ ok: false, error: 'Missing messageId or content' }, { status: 400 });
    }

    await db.update(chatMessages)
      .set({ content })
      .where(eq(chatMessages.id, messageId));

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error('[MESSAGES PATCH]', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!process.env.DATABASE_URL) return Response.json({ ok: true });
  try {
    const { messageId } = await req.json();
    if (!messageId) {
      return Response.json({ ok: false, error: 'Missing messageId' }, { status: 400 });
    }

    await db.delete(chatMessages).where(eq(chatMessages.id, messageId));

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error('[MESSAGES DELETE]', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

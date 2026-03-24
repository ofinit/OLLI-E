import { db } from '@/db';
import { users, userS3Configs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

const CLERK_USER_ID = "user_2p5X7z9W1V3U4t5S";

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: true });
  }

  try {
    const { bucketName, accessKeyId, secretAccessKey, region, provider } = await req.json();

    // 1. Get our internal user ID from the Clerk ID
    const [u] = await db.select().from(users).where(eq(users.clerkId, CLERK_USER_ID)).limit(1);
    if (!u) {
      return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // 2. Check if config already exists
    const [existing] = await db.select().from(userS3Configs).where(eq(userS3Configs.userId, u.id)).limit(1);

    if (existing) {
      await db.update(userS3Configs)
        .set({
          bucketName,
          accessKeyId,
          secretAccessKey,
          region: region || 'us-east-1',
          createdAt: new Date(), // Update timestamp
        })
        .where(eq(userS3Configs.id, existing.id));
    } else {
      await db.insert(userS3Configs).values({
        userId: u.id,
        bucketName,
        accessKeyId,
        secretAccessKey,
        region: region || 'us-east-1',
      });
    }

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error('[S3 CONFIG SAVE ERROR]', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

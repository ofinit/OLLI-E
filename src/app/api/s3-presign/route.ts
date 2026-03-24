import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, userS3Configs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Mock userId for local bypass
    const userId = "user_2p5X7z9W1V3U4t5S";
    // const { userId } = await auth();
    // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { filename, contentType } = await req.json();

    // Fetch S3 config for this user from DB
    const [config] = await db
      .select()
      .from(userS3Configs)
      .innerJoin(users, eq(users.id, userS3Configs.userId))
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!config) {
      return NextResponse.json({ error: "S3 not configured. Please visit settings." }, { status: 400 });
    }

    const { user_s3_configs: s3Config } = config;

    const s3Client = new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: `user-data/${userId}/${Date.now()}-${filename}`,
      ContentType: contentType,
    });

    // Generate the pre-signed URL (valid for 5 minutes)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return NextResponse.json({ signedUrl, key: command.input.Key });
  } catch (error) {
    console.error("S3 Presign Error:", error);
    return NextResponse.json({ error: "Failed to generate pre-signed URL" }, { status: 500 });
  }
}

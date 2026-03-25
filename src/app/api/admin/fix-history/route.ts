import { NextResponse } from "next/server";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select({ id: chatMessages.id, content: chatMessages.content })
      .from(chatMessages);
    
    let fixed = 0;
    for (const row of rows) {
      if (row.content.includes('\x00SESSION:') || row.content.includes('SESSION:')) {
        const cleaned = row.content
          .replace(/\x00SESSION:[^\x00]+\x00/g, '')
          .replace(/^SESSION:[a-f0-9-]+\s*/g, '')
          .trim();
        await db.update(chatMessages)
          .set({ content: cleaned })
          .where(sql`${chatMessages.id} = ${row.id}`);
        fixed++;
      }
    }
    
    return NextResponse.json({ success: true, fixed, total: rows.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { content, filename, type } = await req.json();

    if (!content || !filename) {
      return NextResponse.json({ error: "Missing content or filename" }, { status: 400 });
    }

    const mimeType = type === "html" ? "text/html" : "text/plain";
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    return new Response(content, {
      headers: {
        "Content-Type": `${mimeType}; charset=utf-8`,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

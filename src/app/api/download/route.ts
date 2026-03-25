import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let content = '';
    let filename = 'download.txt';
    let type = 'txt';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      content = body.content;
      filename = body.filename;
      type = body.type;
    } else {
      // Parse form submission (hidden form POST)
      const formData = await req.formData();
      content = formData.get('content') as string;
      filename = formData.get('filename') as string;
      type = formData.get('type') as string;
    }

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

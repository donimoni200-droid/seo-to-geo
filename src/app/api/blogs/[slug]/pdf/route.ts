import { readFileSync, existsSync, statSync } from "node:fs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* Public PDF download for a blog post: /api/blogs/<slug>/pdf */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let guide = null;
  try {
    guide = await db.guide.findUnique({ where: { slug } });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  if (!guide || !guide.published || !guide.pdfPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    if (!existsSync(guide.pdfPath) || !statSync(guide.pdfPath).isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const buf = readFileSync(guide.pdfPath);
    const asciiName =
      (guide.pdfName || `${slug}.pdf`)
        .replace(/[^\x20-\x7E]/g, "_")
        .replace(/["\\]/g, "_") || "download.pdf";
    const encodedName = encodeURIComponent(guide.pdfName || `${slug}.pdf`);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(buf.length),
        "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not read the file" }, { status: 500 });
  }
}

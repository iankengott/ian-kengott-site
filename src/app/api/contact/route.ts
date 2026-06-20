import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, message } = parsed.data;

  // Light spam guard
  if (/https?:\/\//i.test(name) || (message.match(/https?:\/\//g)?.length ?? 0) > 5) {
    return NextResponse.json({ error: "Spam detected" }, { status: 422 });
  }

  try {
    const entry = await db.contactMessage.create({
      data: { name, email, message },
      select: { id: true, createdAt: true },
    });

    console.log(`[contact] message from ${name} <${email}> (${entry.id})`);

    return NextResponse.json({
      ok: true,
      id: entry.id,
      note: "Thanks — I read every message and will reply when I can.",
    });
  } catch (err) {
    console.error("[contact] db error:", err);
    return NextResponse.json(
      { error: "Could not store message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Public, read-only index (no message bodies exposed) for transparency.
  try {
    const recent = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, createdAt: true },
    });
    const count = await db.contactMessage.count();
    return NextResponse.json({ count, recent });
  } catch (err) {
    console.error("[contact] db read error:", err);
    return NextResponse.json({ count: 0, recent: [] });
  }
}

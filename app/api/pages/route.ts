import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { Page } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const items = await Page.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  blocks: z.array(z.any()).default([]),
  seo: z.any().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function POST(req: Request) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = createSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const created = await Page.create({ ...body.data, updatedAtISO: new Date().toISOString() });
  return NextResponse.json({ item: created }, { status: 201 });
}

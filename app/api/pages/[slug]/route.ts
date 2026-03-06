import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Page } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: any) {
  await connectDB();
  const item = await Page.findOne({ slug: params.slug } as any).lean();
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const updateSchema = z.object({
  title: z.string().optional(),
  blocks: z.array(z.any()).optional(),
  seo: z.any().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function PUT(req: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await Page.findOneAndUpdate(
    { slug: params.slug } as any,
    { $set: { ...body.data, updatedAtISO: new Date().toISOString() } },
    { new: true } as any
  );
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: any) {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  await Page.findOneAndDelete({ slug: params.slug } as any);
  return NextResponse.json({ ok: true });
}

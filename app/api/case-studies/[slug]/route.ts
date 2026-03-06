import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { CaseStudy } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: any) {
  await connectDB();
  const item = await CaseStudy.findOne({ slug: params.slug } as any).lean();
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const updateSchema = z.object({
  title: z.string().optional(),
  client: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  testimonial: z.object({ quote: z.string().optional(), author: z.string().optional(), position: z.string().optional() }).optional(),
  featured: z.boolean().optional(),
  completedAt: z.string().optional(),
});

export async function PUT(req: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await CaseStudy.findOneAndUpdate({ slug: params.slug } as any, { $set: body.data }, { new: true } as any);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: any) {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  await CaseStudy.findOneAndDelete({ slug: params.slug } as any);
  return NextResponse.json({ ok: true });
}

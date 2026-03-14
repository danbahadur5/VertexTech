import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { CaseStudy } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const item = await CaseStudy.findOne({ slug } as any).lean();
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const updateSchema = z.object({
  title: z.string().optional(),
  client: z.string().optional(),
  clientId: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional(),
  status: z.enum(["in-progress", "completed"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  features: z.array(z.object({
    label: z.string(),
    status: z.enum(["pending", "in-progress", "completed"])
  })).optional(),
  testimonial: z.object({ quote: z.string().optional(), author: z.string().optional(), position: z.string().optional() }).optional(),
  featured: z.boolean().optional(),
  completedAt: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await CaseStudy.findOneAndUpdate({ slug } as any, { $set: body.data }, { returnDocument: "after" } as any);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  await CaseStudy.findOneAndDelete({ slug } as any);
  return NextResponse.json({ ok: true });
}

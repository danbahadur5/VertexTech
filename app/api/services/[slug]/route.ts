import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Service } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: any) {
  await connectDB();
  const item = await Service.findOne({ slug: params.slug } as any).lean();
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  icon: z.string().optional(),
  features: z.array(z.string()).optional(),
  capabilities: z
    .array(
      z.object({
        label: z.string(),
        value: z.number().min(0).max(100),
      })
    )
    .optional(),
  pricing: z
    .object({
      basic: z.number().optional(),
      professional: z.number().optional(),
      enterprise: z.number().optional(),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
});

export async function PUT(req: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await Service.findOneAndUpdate({ slug: params.slug } as any, { $set: body.data }, { returnDocument: "after" } as any);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: any) {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  await Service.findOneAndDelete({ slug: params.slug } as any);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { Service } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const items = await Service.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  tagline: z.string().optional(),
  icon: z.string().optional(),
  features: z.array(z.string()).default([]),
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

export async function POST(req: Request) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = createSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const created = await Service.create(body.data);
  return NextResponse.json({ item: created }, { status: 201 });
}

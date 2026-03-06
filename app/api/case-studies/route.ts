import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { CaseStudy } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const items = await CaseStudy.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  client: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  testimonial: z.object({ quote: z.string().optional(), author: z.string().optional(), position: z.string().optional() }).optional(),
  featured: z.boolean().optional(),
  completedAt: z.string().optional(),
});

export async function POST(req: Request) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = createSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const created = await CaseStudy.create(body.data);
  return NextResponse.json({ item: created }, { status: 201 });
}

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { CaseStudy } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');
  const clientName = searchParams.get('clientName');
  await connectDB();
  
  let query = {};
  if (clientId || clientName) {
    const conditions = [];
    if (clientId) conditions.push({ clientId });
    if (clientName) conditions.push({ client: clientName });
    query = { $or: conditions };
  }

  const items = await CaseStudy.find(query as any).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  client: z.string().min(1),
  clientId: z.string().optional(),
  description: z.string().min(1),
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

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { BlogPost } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();
  const items = await BlogPost.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.object({ id: z.string().optional(), name: z.string().optional(), avatar: z.string().optional() }).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  publishedAt: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function POST(req: Request) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = createSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const created = await BlogPost.create(body.data);
  return NextResponse.json({ item: created }, { status: 201 });
}

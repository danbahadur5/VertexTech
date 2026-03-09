import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { BlogPost } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: any) {
  await connectDB();
  const item = await BlogPost.findOne({ slug: params.slug } as any).lean();
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const updateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
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

export async function PUT(req: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await BlogPost.findOneAndUpdate({ slug: params.slug } as any, { $set: body.data }, { returnDocument: "after" } as any);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: any) {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  await BlogPost.findOneAndDelete({ slug: params.slug } as any);
  return NextResponse.json({ ok: true });
}

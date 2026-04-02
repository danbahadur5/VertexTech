import { connectDB } from "../../lib/db";
import { BlogPost } from "../../models";
import { requireRole } from "../../lib/rbac";
import { apiResponse } from "../../lib/api-response";
import { logger } from "../../lib/logger";
import { logActivity } from "../../lib/activity-logger";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const items = await BlogPost.find().sort({ publishedAt: -1 }).lean();
    return apiResponse.success({ items });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z.string().trim().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().trim().max(500).optional(),
  featuredImage: z.string().url('Featured image must be a valid URL').optional(),
  category: z.string().trim().max(50).optional(),
  tags: z.array(z.string().trim().max(30)).optional(),
  featured: z.boolean().default(false).optional(),
  author: z.object({ 
    id: z.string().optional(), 
    name: z.string().optional(), 
    avatar: z.string().optional() 
  }).optional(),
  seo: z.object({
    metaTitle: z.string().trim().max(100).optional(),
    metaDescription: z.string().trim().max(200).optional(),
    keywords: z.array(z.string().trim().max(50)).optional(),
    ogImage: z.string().url().optional().or(z.literal('')),
  }).optional(),
  publishedAt: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft").optional(),
});

export async function POST(req: Request) {
  try {
    const ctx = await requireRole(["admin", "editor"]);
    if (!ctx) return apiResponse.error("Unauthorized access", 403, "FORBIDDEN");
    
    const json = await req.json();
    const body = createSchema.safeParse(json);
    
    if (!body.success) {
      return apiResponse.error("Invalid input data", 400, "VALIDATION_ERROR", body.error.format());
    }
    
    await connectDB();
    
    // Check for existing slug
    const existing = await BlogPost.findOne({ slug: body.data.slug } as any);
    if (existing) {
      return apiResponse.error("A blog post with this slug already exists", 409, "CONFLICT_ERROR");
    }

    const created = await BlogPost.create({
      ...body.data,
      author: {
        id: ctx.profile.authUserId,
        name: ctx.profile.name,
        avatar: ctx.profile.avatar,
      },
      publishedAt: body.data.status === 'published' ? new Date().toISOString() : undefined,
    });
    
    logger.info(`Blog post created: ${body.data.title} by ${ctx.profile.name}`);
    
    // Log Activity
    await logActivity({
      userId: ctx.profile.authUserId,
      action: `Published blog post: ${body.data.title}`,
      type: "content",
      targetId: created._id.toString(),
      targetName: body.data.title,
    });

    return apiResponse.success({ item: created }, "Blog post created successfully", 201);
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

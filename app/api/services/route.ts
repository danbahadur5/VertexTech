import { connectDB } from "../../lib/db";
import { Service } from "../../models";
import { requireRole } from "../../lib/rbac";
import { apiResponse } from "../../lib/api-response";
import { logger } from "../../lib/logger";
import { logActivity } from "../../lib/activity-logger";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const items = await Service.find().sort({ createdAt: -1 }).lean();
    return apiResponse.success({ items });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100),
  slug: z.string().trim().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().trim().min(1, 'Description is required'),
  tagline: z.string().trim().max(200).optional(),
  icon: z.string().trim().max(100).optional(),
  features: z.array(z.string().trim().max(100)).default([]),
  capabilities: z.array(
    z.object({
      label: z.string().trim().max(50),
      value: z.number().min(0).max(100),
    })
  ).optional(),
  pricing: z.object({
    basic: z.number().nonnegative().optional(),
    professional: z.number().nonnegative().optional(),
    enterprise: z.number().nonnegative().optional(),
  }).optional(),
  seo: z.object({
    metaTitle: z.string().trim().max(100).optional(),
    metaDescription: z.string().trim().max(200).optional(),
    keywords: z.array(z.string().trim().max(50)).optional(),
    ogImage: z.string().url().optional().or(z.literal('')),
  }).optional(),
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
    
    const existing = await Service.findOne({ slug: body.data.slug } as any);
    if (existing) {
      return apiResponse.error("A service with this slug already exists", 409, "CONFLICT_ERROR");
    }

    const created = await Service.create({
      ...body.data,
      createdAtISO: new Date().toISOString()
    });
    
    logger.info(`Service created: ${body.data.title} by ${ctx.profile.name}`);
    
    // Log Activity
    await logActivity({
      userId: ctx.profile.authUserId,
      action: `Created new service: ${body.data.title}`,
      type: "content",
      targetId: created._id.toString(),
      targetName: body.data.title,
    });

    return apiResponse.success({ item: created }, "Service created successfully", 201);
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

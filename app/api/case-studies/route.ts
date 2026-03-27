import { connectDB } from "../../lib/db";
import { CaseStudy } from "../../models";
import { requireRole, requireSession } from "../../lib/rbac";
import { apiResponse } from "../../lib/api-response";
import { logActivity } from "../../lib/activity-logger";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const clientName = searchParams.get('clientName');
    
    const session = await requireSession();
    const ctx = await requireRole(["admin", "editor", "client"]);
    
    await connectDB();
    
    let query: any = {};
    
    // If user is a client, they can only see their own projects
    if (ctx && ctx.profile.role === 'client') {
      query.clientId = ctx.profile.authUserId;
    } else if (clientId || clientName) {
      // Admin/Editor or Public (if allowed) filtering
      const conditions = [];
      if (clientId) conditions.push({ clientId });
      if (clientName) conditions.push({ client: clientName });
      query = { $or: conditions };
    }

    const items = await CaseStudy.find(query).sort({ createdAt: -1 }).lean();
    return apiResponse.success({ items });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

const createSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  client: z.string().trim().min(1),
  clientId: z.string().optional(),
  description: z.string().trim().min(1),
  technologies: z.array(z.string().trim()).optional(),
  gallery: z.array(z.string().url()).optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(["in-progress", "completed"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  features: z.array(z.object({
    label: z.string().trim(),
    status: z.enum(["pending", "in-progress", "completed"])
  })).optional(),
  testimonial: z.object({ 
    quote: z.string().trim().optional(), 
    author: z.string().trim().optional(), 
    position: z.string().trim().optional() 
  }).optional(),
  featured: z.boolean().optional(),
  completedAt: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ctx = await requireRole(["admin", "editor"]);
    if (!ctx) return apiResponse.error("Forbidden", 403, "FORBIDDEN");
    
    const json = await req.json();
    const body = createSchema.safeParse(json);
    if (!body.success) return apiResponse.error("Invalid input", 400, "VALIDATION_ERROR", body.error.format());
    
    await connectDB();
    const created = await CaseStudy.create(body.data);

    // Log Activity
    await logActivity({
      userId: ctx.profile.authUserId,
      action: `Added new case study: ${body.data.title}`,
      type: "content",
      targetId: created._id.toString(),
      targetName: body.data.title,
    });

    return apiResponse.success({ item: created }, "Case study created successfully", 201);
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

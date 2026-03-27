import { connectDB } from "../../lib/db";
import { Enquiry } from "../../models";
import { requireRole } from "../../lib/rbac";
import { apiResponse } from "../../lib/api-response";
import { logger } from "../../lib/logger";
import { logActivity } from "../../lib/activity-logger";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    const ctx = await requireRole(["admin", "editor"]);
    if (!ctx) return apiResponse.error("Unauthorized access", 403, "FORBIDDEN");
    
    await connectDB();
    const items = await Enquiry.find().sort({ createdAt: -1 }).lean();
    
    return apiResponse.success({ items });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

const createSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address'),
  company: z.string().trim().max(100).optional(),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createSchema.safeParse(json);
    
    if (!body.success) {
      return apiResponse.error("Invalid input data", 400, "VALIDATION_ERROR", body.error.format());
    }
    
    await connectDB();
    const created = await Enquiry.create({ 
      ...body.data, 
      status: "new",
      createdAtISO: new Date().toISOString() 
    });
    
    logger.info(`New enquiry received from ${body.data.email}`);
    
    // Log as system activity (public action)
    // We don't have a userId here since it's a public contact form, 
    // but we can log it if we want to track it in Recent Activity.
    // However, logActivity requires a userId. For public actions, we might use a 'system' user or skip.
    // Let's skip public enquiries for now to keep the log focused on authenticated actions.
    
    return apiResponse.success({ item: created }, "Enquiry submitted successfully", 201);
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

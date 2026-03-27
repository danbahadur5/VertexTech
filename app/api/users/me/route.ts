import { connectDB } from "../../../lib/db";
import { AppUser } from "../../../models";
import { requireSession } from "../../../lib/rbac";
import { apiResponse } from "../../../lib/api-response";
import { logActivity } from "../../../lib/activity-logger";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session) return apiResponse.error("Unauthorized", 401, "UNAUTHORIZED");
    
    await connectDB();
    let user = await AppUser.findOne({ authUserId: session.user.id } as any);
    
    if (!user) {
      user = await AppUser.create({
        authUserId: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
        role: "client",
        status: "active",
      });

      // Log new user registration
      await logActivity({
        userId: session.user.id,
        action: "Account registered",
        type: "user",
      });
    }
    
    if (user && user.status === 'inactive') {
      return apiResponse.error("Account inactive", 403, "ACCOUNT_INACTIVE");
    }
    
    return apiResponse.success({ user });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await requireSession();
    if (!session) return apiResponse.error("Unauthorized", 401, "UNAUTHORIZED");
    
    const json = await req.json();
    const body = updateSchema.safeParse(json);
    if (!body.success) return apiResponse.error("Invalid input", 400, "VALIDATION_ERROR");
    
    await connectDB();
    const updated = await AppUser.findOneAndUpdate(
      { authUserId: session.user.id } as any,
      { $set: { ...body.data } },
      { returnDocument: "after", upsert: true } as any
    );

    // Log profile update
    await logActivity({
      userId: session.user.id,
      action: "Updated profile information",
      type: "user",
    });

    return apiResponse.success({ user: updated });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

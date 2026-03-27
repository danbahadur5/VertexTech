import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Activity } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { apiResponse } from "../../../lib/api-response";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const ctx = await requireRole(["admin", "editor"]);
    if (!ctx) return apiResponse.error("Forbidden", 403, "FORBIDDEN");

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");

    await connectDB();
    
    const query: any = {};
    if (type) query.type = type;

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return apiResponse.success({ activities });
  } catch (error) {
    return apiResponse.handleError(error);
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { SiteSetting } from "../../../models";
import { requireRole, requireSession } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

const settingsSchema = z.record(z.string(), z.any());

// Sensitive keys that should only be visible to admins
const SENSITIVE_KEYS = ["smtp_password", "cloudinary_api_secret", "mongodb_uri"];

export async function GET(_: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  
  // If it's a sensitive key, require admin
  if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
    const adminCtx = await requireRole(["admin"]);
    if (!adminCtx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await connectDB();
  const item = await SiteSetting.findOne({ key } as any).lean();
  
  if (!item) return NextResponse.json({ item: { key, data: {} } });

  // Filter out any potential secrets from data object if not admin
  const session = await requireSession();
  const isAdmin = session && (await requireRole(["admin"]));

  if (!isAdmin && item.data) {
    const filteredData = { ...item.data };
    SENSITIVE_KEYS.forEach(k => delete filteredData[k]);
    item.data = filteredData;
  }

  return NextResponse.json({ item });
}

export async function PUT(req: Request, ctx: { params: Promise<{ key: string }> }) {
  const authCtx = await requireRole(["admin", "editor"]);
  if (!authCtx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  
  const { key } = await ctx.params;
  
  try {
    const json = await req.json();
    await connectDB();
    const existing = await SiteSetting.findOne({ key } as any);

    // Handle revert functionality
    if (json.revertToRevisionId) {
      if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
      
      const revision = (existing.revisions as any[]).find(r => r._id.toString() === json.revertToRevisionId);
      if (!revision) return NextResponse.json({ error: "revision_not_found" }, { status: 404 });
      
      // Push current data to revisions before reverting
      existing.revisions.unshift({
        data: existing.data,
        updatedBy: authCtx.profile.authUserId,
        updatedAt: new Date(),
        comment: `Before reverting to revision ${json.revertToRevisionId}`
      });
      
      existing.data = revision.data;
      existing.updatedAtISO = new Date().toISOString();
      
      // Keep revisions manageable (max 20)
      if (existing.revisions.length > 20) existing.revisions.pop();
      
      await existing.save();
      return NextResponse.json({ item: existing });
    }

    // Normal update
    const updateData = json.data || json;
    const validated = settingsSchema.safeParse(updateData);
    
    if (!validated.success) {
      return NextResponse.json({ error: "invalid_input", details: validated.error.format() }, { status: 400 });
    }

    if (existing) {
      // Add current state to revisions
      existing.revisions.unshift({
        data: existing.data,
        updatedBy: authCtx.profile.authUserId,
        updatedAt: new Date(),
        comment: json.comment || "Updated setting"
      });
      
      // Limit to 20 revisions
      if (existing.revisions.length > 20) existing.revisions.pop();
      
      existing.data = validated.data;
      existing.updatedAtISO = new Date().toISOString();
      await existing.save();
      return NextResponse.json({ item: existing });
    } else {
      const newItem = await SiteSetting.create({
        key,
        data: validated.data,
        updatedAtISO: new Date().toISOString(),
        revisions: []
      });
      return NextResponse.json({ item: newItem });
    }
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { SiteSetting } from "../../../models";
import { requireRole, requireSession } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

const settingsSchema = z.record(z.any());

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
  const auth = await requireRole(["admin", "editor"]);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  
  const { key } = await ctx.params;
  
  try {
    const json = await req.json();
    const validated = settingsSchema.safeParse(json);
    
    if (!validated.success) {
      return NextResponse.json({ error: "invalid_input", details: validated.error.format() }, { status: 400 });
    }

    await connectDB();
    const updated = await SiteSetting.findOneAndUpdate(
      { key } as any,
      { $set: { data: validated.data, updatedAtISO: new Date().toISOString() } },
      { returnDocument: "after", upsert: true } as any
    );
    return NextResponse.json({ item: updated });
  } catch (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

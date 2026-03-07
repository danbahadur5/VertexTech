import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { SiteSetting } from "../../../models";
import { requireRole } from "../../../lib/rbac";

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  await connectDB();
  const item = await SiteSetting.findOne({ key } as any).lean();
  return NextResponse.json({ item: item || { key, data: {} } });
}

export async function PUT(req: Request, ctx: { params: Promise<{ key: string }> }) {
  const session = await requireRole(["admin", "editor"]);
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { key } = await ctx.params;
  const json = await req.json();
  await connectDB();
  const updated = await SiteSetting.findOneAndUpdate(
    { key } as any,
    { $set: { data: json, updatedAtISO: new Date().toISOString() } },
    { returnDocument: "after", upsert: true } as any
  );
  return NextResponse.json({ item: updated });
}

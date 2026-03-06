import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { MediaFile } from "../../models";
import { requireRole } from "../../lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const items = await MediaFile.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

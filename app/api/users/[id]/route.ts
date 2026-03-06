import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { AppUser } from "../../../models";
import { requireRole } from "../../../lib/rbac";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: any) {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const updated = await AppUser.findByIdAndUpdate(params.id as any, { $set: { status: "inactive" } }, { new: true } as any);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ user: updated });
}


import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/rbac";
import { cloudinary } from "../../../lib/cloudinary";
import { connectDB } from "../../../lib/db";
import { MediaFile } from "../../../models";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await cloudinary.uploader.destroy(publicId);
  await connectDB();
  await MediaFile.findOneAndDelete({ publicId } as any);
  return NextResponse.json({ ok: true });
}

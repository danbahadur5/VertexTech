import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/rbac";
import { cloudinary } from "../../../lib/cloudinary";
import { connectDB } from "../../../lib/db";
import { MediaFile } from "../../../models";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });

  // File validation
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "file_too_large", message: "Max size is 10MB" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "invalid_file_type", message: "Unsupported file format" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const upload = await new Promise<{ public_id: string; secure_url: string; resource_type: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "vertextech" }, (err, result) => {
      if (err || !result) return reject(err);
      resolve({ public_id: result.public_id, secure_url: result.secure_url, resource_type: result.resource_type });
    });
    stream.end(buffer);
  });
  await connectDB();
  const saved = await MediaFile.create({
    publicId: upload.public_id,
    url: upload.secure_url,
    type: upload.resource_type,
    uploadedBy: ctx.profile.id,
  });
  return NextResponse.json({ item: saved }, { status: 201 });
}

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { AppUser } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const users = await AppUser.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users });
}

const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["admin", "editor", "client"]),
});

export async function PUT(req: Request) {
  const ctx = await requireRole(["admin"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = roleSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await AppUser.findByIdAndUpdate(body.data.userId as any, { $set: { role: body.data.role } }, { new: true } as any);
  return NextResponse.json({ user: updated });
}

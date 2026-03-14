import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { AppUser } from "../../../models";
import { requireSession } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
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
  }
  return NextResponse.json({ user });
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export async function PUT(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await AppUser.findOneAndUpdate(
    { authUserId: session.user.id } as any,
    { $set: { ...body.data } },
    { returnDocument: "after", upsert: true } as any
  );
  return NextResponse.json({ user: updated });
}

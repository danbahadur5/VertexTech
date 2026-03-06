import { NextResponse } from "next/server";
import { requireSession } from "../../../lib/rbac";
import { connectDB } from "../../../lib/db";
import { AppUser } from "../../../models";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = req.headers.get("x-bootstrap-token");
  const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await connectDB();
  const adminExists = await AppUser.findOne({ role: "admin" } as any).lean();
  if (adminExists) {
    return NextResponse.json({ error: "admin_exists" }, { status: 409 });
  }
  const updated = await AppUser.findOneAndUpdate(
    { authUserId: session.user.id } as any,
    {
      $set: {
        authUserId: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
        role: "admin",
        status: "active",
      },
    },
    { new: true, upsert: true } as any
  );
  return NextResponse.json({ user: updated });
}


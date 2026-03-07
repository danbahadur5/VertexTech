import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { Enquiry } from "../../models";
import { requireRole } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const items = await Enquiry.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json();
  const body = createSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const created = await Enquiry.create({ ...body.data, status: "new" });
  return NextResponse.json({ item: created }, { status: 201 });
}

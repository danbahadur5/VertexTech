import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { SupportTicket } from "../../models";
import { requireRole, requireSession } from "../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  const adminCtx = await requireRole(["admin", "editor"]);
  await connectDB();
  if (adminCtx) {
    const items = await SupportTicket.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  }
  const sessionCtx = await requireSession();
  if (!sessionCtx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await SupportTicket.find({ userId: sessionCtx.user.id } as any).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  subject: z.string().min(3),
  description: z.string().min(3),
  priority: z.enum(["low", "medium", "high"]).default("medium").optional(),
});

export async function POST(req: Request) {
  const sessionCtx = await requireSession();
  if (!sessionCtx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const json = await req.json();
  const body = createSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const item = await SupportTicket.create({
    userId: sessionCtx.user.id,
    subject: body.data.subject,
    description: body.data.description,
    priority: body.data.priority || "medium",
  });
  return NextResponse.json({ item }, { status: 201 });
}


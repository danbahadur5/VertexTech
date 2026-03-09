import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Enquiry } from "../../../models";
import { requireRole } from "../../../lib/rbac";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const item = await Enquiry.findOne({ _id: params.id } as any).lean();
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

const updateSchema = z.object({
  status: z.enum(["new", "read"]).optional(),
});

export async function PUT(req: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const json = await req.json();
  const body = updateSchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await connectDB();
  const updated = await Enquiry.findOneAndUpdate({ _id: params.id } as any, { $set: body.data }, { new: true } as any);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: any) {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  await Enquiry.findOneAndDelete({ _id: params.id } as any);
  return NextResponse.json({ ok: true });
}

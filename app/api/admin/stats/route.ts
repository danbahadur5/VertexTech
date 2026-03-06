import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { AppUser, Page, BlogPost, CaseStudy, SupportTicket } from "../../../models";
import { requireRole } from "../../../lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const [users, pages, posts, projects, tickets] = await Promise.all([
    AppUser.countDocuments({} as any),
    Page.countDocuments({ status: "published" } as any),
    BlogPost.countDocuments({} as any),
    CaseStudy.countDocuments({} as any),
    SupportTicket.countDocuments({} as any),
  ]);
  return NextResponse.json({ users, pages, posts, projects, tickets });
}


import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { AppUser, Page, BlogPost, CaseStudy, SupportTicket } from "../../../models";
import { requireRole } from "../../../lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await requireRole(["admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await connectDB();
  const [
    usersTotal,
    adminCount,
    editorCount,
    clientCount,
    pagesDraft,
    pagesPublished,
    postsDraft,
    postsPublished,
    projects,
    ticketsOpen,
    ticketsInProgress,
    ticketsResolved,
    ticketsTotal
  ] = await Promise.all([
    AppUser.countDocuments({} as any),
    AppUser.countDocuments({ role: "admin" } as any),
    AppUser.countDocuments({ role: "editor" } as any),
    AppUser.countDocuments({ role: "client" } as any),
    Page.countDocuments({ status: "draft" } as any),
    Page.countDocuments({ status: "published" } as any),
    BlogPost.countDocuments({ status: "draft" } as any),
    BlogPost.countDocuments({ status: "published" } as any),
    CaseStudy.countDocuments({} as any),
    SupportTicket.countDocuments({ status: "open" } as any),
    SupportTicket.countDocuments({ status: "in-progress" } as any),
    SupportTicket.countDocuments({ status: "resolved" } as any),
    SupportTicket.countDocuments({} as any),
  ]);
  return NextResponse.json({
    users: usersTotal,
    usersByRole: { admin: adminCount, editor: editorCount, client: clientCount },
    pages: pagesPublished,
    pagesByStatus: { draft: pagesDraft, published: pagesPublished },
    posts: postsDraft + postsPublished,
    postsByStatus: { draft: postsDraft, published: postsPublished },
    projects,
    tickets: ticketsTotal,
    ticketsByStatus: { open: ticketsOpen, inProgress: ticketsInProgress, resolved: ticketsResolved },
  });
}

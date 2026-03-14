import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { CaseStudy, SupportTicket, MediaFile } from "../../../models";
import { requireRole } from "../../../lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await requireRole(["client", "admin", "editor"]);
  if (!ctx) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  
  const { profile } = ctx;
  await connectDB();

  // For clients, we filter by their specific association.
  // In SupportTicket, it's userId.
  // In CaseStudy, it's the client name (as per schema). 
  // In MediaFile, it's uploadedBy.

  const [
    activeProjects,
    openTickets,
    mediaShared
  ] = await Promise.all([
    CaseStudy.countDocuments({ 
      $or: [
        { clientId: profile.authUserId },
        { client: profile.name }
      ], 
      status: "in-progress" 
    } as any),
    SupportTicket.countDocuments({ userId: profile.authUserId, status: { $ne: "resolved" } } as any),
    MediaFile.countDocuments({ uploadedBy: profile.authUserId } as any)
  ]);

  return NextResponse.json({
    projects: activeProjects,
    tickets: openTickets,
    media: mediaShared,
    invoices: 1, // Placeholder for now as billing model is not defined
    trends: {
      projects: "+0",
      tickets: "+0",
      media: "+0",
      invoices: "0"
    }
  });
}

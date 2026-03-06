import { headers } from "next/headers";
import { auth } from "./auth";
import { connectDB } from "./db";
import { AppUser } from "../models";

export async function requireSession() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) {
    return null;
  }
  return session;
}

export async function requireRole(roles: Array<"admin" | "editor" | "client">) {
  const session = await requireSession();
  if (!session) return null;
  await connectDB();
  const profile = await AppUser.findOne({ authUserId: session.user.id } as any);
  if (!profile) return null;
  if (!roles.includes(profile.role)) return null;
  return { session, profile };
}

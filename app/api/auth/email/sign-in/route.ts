import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const result = await auth.api.signInEmail({ body });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "sign_in_failed" }, { status: 400 });
  }
}


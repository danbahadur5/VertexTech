import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { rateLimit } from "./app/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
});

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const path = request.nextUrl.pathname;

  // Rate limiting for auth endpoints
  if (path.startsWith("/api/auth")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "anonymous";
    try {
      await limiter.check(10, ip); // 10 requests per minute per IP
    } catch {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  if (path.startsWith("/dashboard")) {
    if (!sessionCookie) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }

  // Prevent logged-in users from accessing login/register pages
  if (sessionCookie && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/api/auth/:path*"],
};


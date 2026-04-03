import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { rateLimit } from "./app/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
});

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    
    // Create response
    const response = NextResponse.next();

    // Rate limiting for auth and sensitive endpoints
    if (path.startsWith("/api/auth") || path.startsWith("/api/enquiries") || path.startsWith("/api/users")) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "anonymous";
      try {
        await limiter.check(10, ip); 
      } catch {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    }

    // Session check - safer way
    const sessionCookie = getSessionCookie(request);

    if (path.startsWith("/dashboard")) {
      if (!sessionCookie) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(url);
      }
    }

    // Prevent logged-in users from accessing login/register pages
    if (sessionCookie && (path === "/login" || path === "/register" || path === "/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/login", "/register", "/signup"],
};


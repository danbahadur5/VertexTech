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

    // Add Security Headers
    const securityHeaders = {
      'X-DNS-Prefetch-Control': 'on',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://raw.githubusercontent.com https://plus.unsplash.com; font-src 'self' data:; connect-src 'self' https://api.cloudinary.com; frame-ancestors 'none'; upgrade-insecure-requests;",
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

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
        const redirectResponse = NextResponse.redirect(url);
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }
    }

    // Prevent logged-in users from accessing login/register pages
    if (sessionCookie && (path === "/login" || path === "/register" || path === "/signup")) {
      const redirectResponse = NextResponse.redirect(new URL("/", request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
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


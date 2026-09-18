import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// In-memory sliding window rate limiter
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const now = Date.now();

  // 1. Rate Limiting for Authentication and Upload endpoints
  const isTest = process.env.NODE_ENV === "test" || request.headers.get("x-playwright-test") === "true" || process.env.PLAYWRIGHT_TEST === "true";
  if (!isTest && (pathname.startsWith("/api/auth") || pathname.startsWith("/api/upload") || pathname === "/admin-login")) {
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = pathname.startsWith("/api/auth/callback") ? 15 : 30;

    const record = rateLimitStore.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > windowMs) {
      record.count = 1;
      record.lastReset = now;
    } else {
      record.count += 1;
    }
    rateLimitStore.set(ip, record);

    if (record.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down and try again." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60"
          }
        }
      );
    }
  }

  // 2. Admin Route Protection
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-for-development";
    const token = await getToken({ req: request, secret });

    if (!token) {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if ((token as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/upload/:path*",
    "/admin-login"
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "your-secret-key-change-in-production"
);

const COOKIE_NAME = "bus_pass_token";

type JWTPayload = { userId: number; email: string; role: "student" | "admin" };

async function getPayload(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const payload = await getPayload(request);

  // Public routes
  if (pathname === "/" || pathname.startsWith("/api/auth")) {
    if (payload && (pathname === "/login" || pathname === "/register")) {
      const redirect = payload.role === "admin" ? "/admin" : "/student";
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return NextResponse.next();
  }

  // Student routes
  if (pathname.startsWith("/student")) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("role", "student");
      return NextResponse.redirect(url);
    }
    if (payload.role !== "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("role", "admin");
      return NextResponse.redirect(url);
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Login/register pages - redirect if already logged in
  if (pathname === "/login" || pathname === "/register") {
    if (payload) {
      const redirect = payload.role === "admin" ? "/admin" : "/student";
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/login", "/register", "/"],
};

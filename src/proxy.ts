import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { getPasswordHash } from "@/lib/admin-password";

// Public API calls that visitors make on the website (no login needed).
const PUBLIC_API_GET = /^\/api\/(health|products|services|projects|testimonials|profile|site)$/;
const PUBLIC_API_POST = /^\/api\/(orders|inquiries|subscribers)$/;
const PUBLIC_AUTH = /^\/api\/auth\/(login|logout|form-login)$/;

async function hasSession(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return false;
  return isValidSession(cookie, await getPasswordHash());
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (PUBLIC_AUTH.test(pathname)) return NextResponse.next();
    if (request.method === "GET" && PUBLIC_API_GET.test(pathname)) return NextResponse.next();
    if (request.method === "POST" && PUBLIC_API_POST.test(pathname)) return NextResponse.next();
    if (!(await hasSession(request))) {
      return NextResponse.json(
        { error: "Nicht angemeldet. Bitte im Admin-Bereich einloggen." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (await hasSession(request)) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !(await hasSession(request))) {
    const justLoggedIn = request.nextUrl.searchParams.get("login") === "ok";
    const qs = new URLSearchParams({ next: pathname });
    if (justLoggedIn) qs.set("error", "cookie");
    return NextResponse.redirect(new URL(`/admin/login?${qs.toString()}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

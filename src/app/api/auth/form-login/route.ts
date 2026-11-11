import { NextResponse } from "next/server";
import { isHttps, sessionValue, SESSION_COOKIE, SESSION_MAX_AGE, verifyPassword } from "@/lib/auth";
import { getPasswordHash } from "@/lib/admin-password";

export const dynamic = "force-dynamic";

// Plain HTML form login. Works even if JavaScript fails to load in the browser.

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { fails: number; lockedUntil: number }>();

function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/admin";
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

// Relative Location headers: the browser resolves them against the public address,
// so we never send it to the internal host (0.0.0.0) behind the hosting proxy.
function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

function back(error: string, next: string) {
  const qs = new URLSearchParams({ error, next });
  return redirectTo(`/admin/login?${qs.toString()}`);
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = typeof form?.get("password") === "string" ? (form!.get("password") as string) : "";
  const next = safeNext(form?.get("next"));

  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const record = failures.get(ip);
  if (record && record.lockedUntil > now) {
    return back("locked", next);
  }

  const hash = await getPasswordHash();
  if (!password || !verifyPassword(password, hash)) {
    const fails = (record?.fails ?? 0) + 1;
    failures.set(ip, {
      fails: fails >= MAX_FAILS ? 0 : fails,
      lockedUntil: fails >= MAX_FAILS ? now + LOCK_MS : 0,
    });
    return back("wrong", next);
  }

  failures.delete(ip);
  // "login=ok" lets the admin pages tell "login worked but the browser dropped the cookie" apart from a wrong password.
  const target = `${next}${next.includes("?") ? "&" : "?"}login=ok`;
  const res = new NextResponse(null, { status: 303, headers: { Location: target } });
  res.cookies.set(SESSION_COOKIE, sessionValue(hash), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(request),
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

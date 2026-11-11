import { NextResponse } from "next/server";
import { isHttps, sessionValue, SESSION_COOKIE, SESSION_MAX_AGE, verifyPassword } from "@/lib/auth";
import { getPasswordHash } from "@/lib/admin-password";

export const dynamic = "force-dynamic";

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { fails: number; lockedUntil: number }>();

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const record = failures.get(ip);
  if (record && record.lockedUntil > now) {
    const mins = Math.ceil((record.lockedUntil - now) / 60000);
    return NextResponse.json(
      { error: `Zu viele Fehlversuche. Bitte in ${mins} Minute(n) erneut versuchen.` },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const given = typeof body.password === "string" ? body.password : "";
  const hash = await getPasswordHash();

  if (!verifyPassword(given, hash)) {
    const fails = (record?.fails ?? 0) + 1;
    failures.set(ip, {
      fails: fails >= MAX_FAILS ? 0 : fails,
      lockedUntil: fails >= MAX_FAILS ? now + LOCK_MS : 0,
    });
    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  failures.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionValue(hash), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(request),
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

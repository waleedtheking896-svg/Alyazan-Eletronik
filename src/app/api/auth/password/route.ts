import { NextResponse } from "next/server";
import {
  hashPassword,
  isHttps,
  MIN_PASSWORD_LENGTH,
  sessionValue,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifyPassword,
} from "@/lib/auth";
import { getPasswordHash, setPasswordHash } from "@/lib/admin-password";

export const dynamic = "force-dynamic";

// Changes the admin password. The proxy already makes sure only logged-in admins reach this route.
export async function PUT(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };
  const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const next = typeof body.newPassword === "string" ? body.newPassword : "";

  const hash = await getPasswordHash();
  if (!verifyPassword(current, hash)) {
    return NextResponse.json({ error: "Das aktuelle Passwort ist falsch." }, { status: 401 });
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Das neue Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.` },
      { status: 400 }
    );
  }
  if (next === current) {
    return NextResponse.json({ error: "Das neue Passwort ist identisch mit dem alten." }, { status: 400 });
  }

  const newHash = hashPassword(next);
  await setPasswordHash(newHash);

  // Keep the current browser logged in; all other sessions become invalid.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionValue(newHash), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(request),
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

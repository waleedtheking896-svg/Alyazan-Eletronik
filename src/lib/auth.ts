import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "alyazen_admin";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
export { MIN_PASSWORD_LENGTH } from "@/lib/auth-constants";

/** Hashes a password with scrypt. Format: scrypt$<salt>$<hash> */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === candidate.length && timingSafeEqual(candidate, expected);
}

/**
 * Session cookie value. It is derived from the stored password hash,
 * so changing the password automatically logs out every existing session.
 */
export function sessionValue(storedHash: string): string {
  return createHmac("sha256", storedHash).update("alyazen-admin-session-v2").digest("hex");
}

export function isValidSession(cookieValue: string | undefined, storedHash: string): boolean {
  if (!cookieValue) return false;
  const expected = Buffer.from(sessionValue(storedHash));
  const got = Buffer.from(cookieValue);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

export function isHttps(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  const proto = forwarded ?? new URL(request.url).protocol.replace(":", "");
  return proto.split(",")[0].trim() === "https";
}

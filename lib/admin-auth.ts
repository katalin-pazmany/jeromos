import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Admin authentication for the dog manager.
//
// The password is read from ADMIN_PASSWORD (.env.local) — there is NO built-in
// default, so admin actions are refused unless a secret is configured
// (fail-closed). After login a signed, httpOnly session cookie is issued; the
// password itself is never stored in the browser nor sent on every request.
//
// This is adequate for a local / single-owner site served over HTTPS. For a
// public multi-user deployment, use a real auth provider.

// Trim so a stray space pasted into the env value can't lock the owner out.
const PW = (process.env.ADMIN_PASSWORD || "").trim();
export const adminConfigured = PW.length > 0;
export const SESSION_COOKIE = "jeromos_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  if (!PW) return false;
  return safeEqual(input.trim(), PW);
}

/** Opaque session token derived from the secret (cannot be forged without it). */
export function sessionToken(): string | null {
  if (!PW) return null;
  return crypto
    .createHmac("sha256", PW)
    .update("jeromos-admin-session-v1")
    .digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, token);
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function unauthorized() {
  return NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
}

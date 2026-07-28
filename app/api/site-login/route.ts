import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE = "site_gate";
const SALT = "::jeromos-site";

function sitePassword(): string {
  return (process.env.SITE_PASSWORD || "jeromos2026").trim();
}

function token(): string {
  return crypto.createHash("sha256").update(sitePassword() + SALT).digest("hex");
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password =
    typeof body.password === "string" ? body.password.trim() : "";

  if (password !== sitePassword()) {
    return NextResponse.json({ error: "Hibás jelszó." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // No maxAge/expires → session cookie: the gate re-prompts once the
    // browser is fully closed and reopened.
  });
  return res;
}

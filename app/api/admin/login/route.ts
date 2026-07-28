import { NextResponse } from "next/server";
import {
  adminConfigured,
  checkPassword,
  sessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminConfigured) {
    return NextResponse.json(
      { error: "Az admin jelszó nincs beállítva a szerveren (.env.local)." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Hibás jelszó." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken()!, sessionCookieOptions());
  return res;
}

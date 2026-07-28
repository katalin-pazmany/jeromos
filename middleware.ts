import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Site-wide password gate. Until a visitor enters the site password (default
// "jeromos2026", override with SITE_PASSWORD in .env.local) nothing is shown —
// every page redirects to /belepes. This is a simple "not public yet" wall,
// separate from the /admin password.

const COOKIE = "site_gate";
const SALT = "::jeromos-site";

function sitePassword(): string {
  return process.env.SITE_PASSWORD || "jeromos2026";
}

async function expectedToken(): Promise<string> {
  const bytes = new TextEncoder().encode(sitePassword() + SALT);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Paths reachable without the password (the login page, its API, branding).
const ALLOW = new Set([
  "/belepes",
  "/favicon.ico",
  "/icon.svg",
  "/jeromos_logo.svg",
  "/jeromos_title.svg",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    ALLOW.has(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/site-login")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  if (token && token === (await expectedToken())) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/belepes";
  url.search = `?from=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

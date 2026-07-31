import { headers } from "next/headers";
import { sql } from "@/lib/db";

// Basic, dependency-free spam defense for the public apply/help forms:
// a honeypot field, a minimum fill-time check, and a DB-backed rate limit
// per IP. Not as strong as a CAPTCHA, but stops the vast majority of
// unsophisticated bot traffic without requiring a third-party account.

const RATE_LIMIT_WINDOW_MINUTES = 60;
const RATE_LIMIT_MAX = 5;
const MIN_FILL_TIME_MS = 2500;

let ensured = false;

async function ensureTable(): Promise<void> {
  if (ensured) return;
  await sql.query(`
    CREATE TABLE IF NOT EXISTS form_submission_log (
      id          SERIAL PRIMARY KEY,
      ip          TEXT NOT NULL,
      form        TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await sql.query(
    `CREATE INDEX IF NOT EXISTS form_submission_log_lookup_idx ON form_submission_log (ip, form, created_at)`
  );
  ensured = true;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export interface SpamCheckResult {
  blocked: boolean;
  reason?: "honeypot" | "too-fast" | "rate-limited";
}

export async function checkSpam(
  form: "apply" | "help",
  body: Record<string, unknown>
): Promise<SpamCheckResult> {
  // Honeypot: a hidden field real users never see or fill.
  if (String(body.website ?? "").trim()) {
    return { blocked: true, reason: "honeypot" };
  }

  // Too-fast: bots often submit within milliseconds of the page loading.
  const startedAt = Number(body.formStartedAt);
  if (startedAt && Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return { blocked: true, reason: "too-fast" };
  }

  await ensureTable();
  const ip = await clientIp();
  const threshold = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000
  ).toISOString();

  const rows = (await sql`
    SELECT count(*)::int AS count FROM form_submission_log
    WHERE ip = ${ip} AND form = ${form} AND created_at > ${threshold}
  `) as { count: number }[];

  if ((rows[0]?.count ?? 0) >= RATE_LIMIT_MAX) {
    return { blocked: true, reason: "rate-limited" };
  }

  // Log this attempt regardless of what happens next, so retries still count.
  await sql`INSERT INTO form_submission_log (ip, form) VALUES (${ip}, ${form})`;

  // Opportunistic cleanup so the log table doesn't grow forever.
  if (Math.random() < 0.05) {
    await sql`DELETE FROM form_submission_log WHERE created_at < now() - interval '2 days'`;
  }

  return { blocked: false };
}

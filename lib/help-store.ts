import { sql } from "@/lib/db";
import type { HelpCategory } from "@/lib/help-categories";

export interface HelpRequest {
  id: string;
  createdAt: string;
  category: HelpCategory;
  name: string;
  email: string;
  phone: string;
  availability: string;
  message: string;
  handled: boolean;
}

let ensured = false;

async function ensureTable(): Promise<void> {
  if (ensured) return;
  await sql.query(`
    CREATE TABLE IF NOT EXISTS help_requests (
      id            TEXT PRIMARY KEY,
      created_at    TIMESTAMPTZ NOT NULL,
      category      TEXT NOT NULL,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT NOT NULL,
      availability  TEXT NOT NULL DEFAULT '',
      message       TEXT NOT NULL
    )
  `);
  // Self-healing for tables created before the `availability` column existed.
  await sql.query(
    `ALTER TABLE help_requests ADD COLUMN IF NOT EXISTS availability TEXT NOT NULL DEFAULT ''`
  );
  await sql.query(
    `ALTER TABLE help_requests ADD COLUMN IF NOT EXISTS handled BOOLEAN NOT NULL DEFAULT false`
  );
  await sql.query(
    `CREATE INDEX IF NOT EXISTS help_requests_created_at_idx ON help_requests (created_at DESC)`
  );
  ensured = true;
}

export async function saveHelpRequest(
  req: Omit<HelpRequest, "handled">
): Promise<void> {
  await ensureTable();
  await sql`
    INSERT INTO help_requests (id, created_at, category, name, email, phone, availability, message)
    VALUES (${req.id}, ${req.createdAt}, ${req.category}, ${req.name}, ${req.email}, ${req.phone}, ${req.availability}, ${req.message})
  `;
}

interface HelpRequestRow {
  id: string;
  created_at: string;
  category: HelpCategory;
  name: string;
  email: string;
  phone: string;
  availability: string;
  message: string;
  handled: boolean;
}

function fromRow(r: HelpRequestRow): HelpRequest {
  return {
    id: r.id,
    createdAt: r.created_at,
    category: r.category,
    name: r.name,
    email: r.email,
    phone: r.phone,
    availability: r.availability,
    message: r.message,
    handled: r.handled,
  };
}

export async function getAllHelpRequests(): Promise<HelpRequest[]> {
  await ensureTable();
  const rows = (await sql`
    SELECT * FROM help_requests ORDER BY created_at DESC
  `) as HelpRequestRow[];
  return rows.map(fromRow);
}

export async function setHelpRequestHandled(
  id: string,
  handled: boolean
): Promise<boolean> {
  await ensureTable();
  const rows = (await sql`
    UPDATE help_requests SET handled = ${handled} WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

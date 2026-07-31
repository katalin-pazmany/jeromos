import { sql } from "@/lib/db";

export interface Application {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  garden: string;
  otherPets: string;
  dog: string;
  intro: string;
  handled: boolean;
}

let ensured = false;

// Self-healing for rows/tables created before `handled` existed — mirrors
// the pattern already used in lib/help-store.ts.
async function ensureHandledColumn(): Promise<void> {
  if (ensured) return;
  await sql.query(
    `ALTER TABLE applications ADD COLUMN IF NOT EXISTS handled BOOLEAN NOT NULL DEFAULT false`
  );
  ensured = true;
}

// Keep a record of every application so nothing is lost even if email
// delivery isn't configured. Contains personal data — keep it private.
export async function saveApplication(
  app: Omit<Application, "handled">
): Promise<void> {
  await ensureHandledColumn();
  await sql`
    INSERT INTO applications (id, created_at, name, email, phone, city, garden, other_pets, dog, intro)
    VALUES (
      ${app.id}, ${app.createdAt}, ${app.name}, ${app.email}, ${app.phone}, ${app.city},
      ${app.garden}, ${app.otherPets}, ${app.dog}, ${app.intro}
    )
  `;
}

interface ApplicationRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  garden: string;
  other_pets: string;
  dog: string;
  intro: string;
  handled: boolean;
}

function fromRow(r: ApplicationRow): Application {
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    phone: r.phone,
    city: r.city,
    garden: r.garden,
    otherPets: r.other_pets,
    dog: r.dog,
    intro: r.intro,
    handled: r.handled,
  };
}

export async function getAllApplications(): Promise<Application[]> {
  await ensureHandledColumn();
  const rows = (await sql`
    SELECT * FROM applications ORDER BY created_at DESC
  `) as ApplicationRow[];
  return rows.map(fromRow);
}

export async function setApplicationHandled(
  id: string,
  handled: boolean
): Promise<boolean> {
  await ensureHandledColumn();
  const rows = (await sql`
    UPDATE applications SET handled = ${handled} WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAuthed, unauthorized } from "@/lib/admin-auth";
import { seedDogs } from "@/data/dogs";

// TEMPORARY one-time endpoint: creates the dogs/applications tables and
// seeds the 11 launch dogs, pointing at the photos already uploaded to
// Blob. Runs with the runtime's real DATABASE_URL (unlike a local script,
// which can't reliably reach the correct Vercel-provisioned database).
// Delete this file after running it once.

export const dynamic = "force-dynamic";

const BLOB_HOST = "https://npa5pgcsgpe4ibee.public.blob.vercel-storage.com";

export async function POST() {
  if (!(await isAuthed())) return unauthorized();

  await sql.query(`
    CREATE TABLE IF NOT EXISTS dogs (
      slug              TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      image             TEXT NOT NULL,
      photo_alt         TEXT NOT NULL,
      sex               TEXT NOT NULL,
      age_years         INTEGER NOT NULL DEFAULT 0,
      age_group         TEXT NOT NULL,
      size              TEXT NOT NULL,
      energy            TEXT NOT NULL,
      breed             TEXT NOT NULL,
      traits            TEXT[] NOT NULL DEFAULT '{}',
      good_with_gyerek  BOOLEAN,
      good_with_kutya   BOOLEAN,
      good_with_macska  BOOLEAN,
      status            TEXT NOT NULL,
      tagline           TEXT NOT NULL DEFAULT '',
      story             TEXT NOT NULL DEFAULT '',
      sort_order        INTEGER NOT NULL DEFAULT 0,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await sql.query(`CREATE INDEX IF NOT EXISTS dogs_sort_order_idx ON dogs (sort_order)`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id          TEXT PRIMARY KEY,
      created_at  TIMESTAMPTZ NOT NULL,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL,
      city        TEXT NOT NULL,
      garden      TEXT NOT NULL,
      other_pets  TEXT NOT NULL,
      dog         TEXT NOT NULL,
      intro       TEXT NOT NULL
    )
  `);
  await sql.query(
    `CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications (created_at DESC)`
  );

  const seeded: string[] = [];
  for (const [index, dog] of seedDogs.entries()) {
    const filename = dog.image.replace("/dogs/", "");
    const url = `${BLOB_HOST}/dogs/${filename}`;

    await sql`
      INSERT INTO dogs (
        slug, name, image, photo_alt, sex, age_years, age_group, size, energy, breed,
        traits, good_with_gyerek, good_with_kutya, good_with_macska, status, tagline, story,
        sort_order
      ) VALUES (
        ${dog.slug}, ${dog.name}, ${url}, ${dog.photoAlt}, ${dog.sex}, ${dog.ageYears},
        ${dog.ageGroup}, ${dog.size}, ${dog.energy}, ${dog.breed}, ${dog.traits},
        ${dog.goodWith.gyerek}, ${dog.goodWith.kutya}, ${dog.goodWith.macska}, ${dog.status},
        ${dog.tagline}, ${dog.story}, ${index}
      )
      ON CONFLICT (slug) DO UPDATE SET
        image = EXCLUDED.image, name = EXCLUDED.name, photo_alt = EXCLUDED.photo_alt,
        sex = EXCLUDED.sex, age_years = EXCLUDED.age_years, age_group = EXCLUDED.age_group,
        size = EXCLUDED.size, energy = EXCLUDED.energy, breed = EXCLUDED.breed,
        traits = EXCLUDED.traits, good_with_gyerek = EXCLUDED.good_with_gyerek,
        good_with_kutya = EXCLUDED.good_with_kutya, good_with_macska = EXCLUDED.good_with_macska,
        status = EXCLUDED.status, tagline = EXCLUDED.tagline, story = EXCLUDED.story,
        sort_order = EXCLUDED.sort_order
    `;
    seeded.push(dog.slug);
  }

  return NextResponse.json({ ok: true, seeded });
}

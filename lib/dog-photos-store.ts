// Server-side data store for a dog's additional gallery photos, backed by
// Postgres (Neon, via lib/db.ts). The dog's single `image` column remains
// the cover photo (unaffected); this table holds extras shown in the public
// gallery/lightbox. Only import this from server code.

import { sql } from "@/lib/db";

export interface DogPhoto {
  id: number;
  dogSlug: string;
  url: string;
  alt: string;
  sortOrder: number;
  createdAt: string;
}

type DogPhotoRow = {
  id: number;
  dog_slug: string;
  url: string;
  alt: string;
  sort_order: number;
  created_at: string;
};

function rowToPhoto(r: DogPhotoRow): DogPhoto {
  return {
    id: r.id,
    dogSlug: r.dog_slug,
    url: r.url,
    alt: r.alt,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  };
}

let ensured = false;

async function ensureTable(): Promise<void> {
  if (ensured) return;
  await sql.query(`
    CREATE TABLE IF NOT EXISTS dog_photos (
      id          BIGSERIAL PRIMARY KEY,
      dog_slug    TEXT NOT NULL REFERENCES dogs(slug) ON DELETE CASCADE,
      url         TEXT NOT NULL,
      alt         TEXT NOT NULL DEFAULT '',
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await sql.query(
    `CREATE INDEX IF NOT EXISTS dog_photos_dog_slug_idx ON dog_photos (dog_slug, sort_order, id)`
  );
  ensured = true;
}

export async function getPhotosForDog(slug: string): Promise<DogPhoto[]> {
  await ensureTable();
  const rows = (await sql`
    SELECT * FROM dog_photos WHERE dog_slug = ${slug} ORDER BY sort_order ASC, id ASC
  `) as DogPhotoRow[];
  return rows.map(rowToPhoto);
}

/**
 * Appends one photo, placed after the dog's current highest sort_order.
 * Call sequentially (not Promise.all) when adding several at once so the
 * MAX(sort_order) lookup can't race with itself.
 */
export async function addDogPhoto(
  slug: string,
  url: string,
  alt: string
): Promise<DogPhoto> {
  await ensureTable();
  const rows = (await sql`
    INSERT INTO dog_photos (dog_slug, url, alt, sort_order)
    VALUES (
      ${slug}, ${url}, ${alt},
      (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM dog_photos WHERE dog_slug = ${slug})
    )
    RETURNING *
  `) as DogPhotoRow[];
  return rowToPhoto(rows[0]);
}

export async function deleteDogPhoto(
  slug: string,
  id: number
): Promise<DogPhoto | undefined> {
  await ensureTable();
  const rows = (await sql`
    DELETE FROM dog_photos WHERE id = ${id} AND dog_slug = ${slug} RETURNING *
  `) as DogPhotoRow[];
  return rows[0] ? rowToPhoto(rows[0]) : undefined;
}

// Server-side data store for dogs, backed by Postgres (Neon, via lib/db.ts).
// Only import this from server code (route handlers / server components),
// never from a client component.

import { sql } from "@/lib/db";
import type { Dog } from "@/data/dogs";

type DogRow = {
  slug: string;
  name: string;
  image: string;
  photo_alt: string;
  sex: string;
  age_years: number;
  age_group: string;
  size: string;
  energy: string;
  breed: string;
  traits: string[];
  good_with_gyerek: boolean | null;
  good_with_kutya: boolean | null;
  good_with_macska: boolean | null;
  status: string;
  tagline: string;
  story: string;
};

function rowToDog(r: DogRow): Dog {
  return {
    slug: r.slug,
    name: r.name,
    image: r.image,
    photoAlt: r.photo_alt,
    sex: r.sex as Dog["sex"],
    ageYears: r.age_years,
    ageGroup: r.age_group as Dog["ageGroup"],
    size: r.size as Dog["size"],
    energy: r.energy as Dog["energy"],
    breed: r.breed,
    traits: r.traits,
    goodWith: {
      gyerek: r.good_with_gyerek,
      kutya: r.good_with_kutya,
      macska: r.good_with_macska,
    },
    status: r.status as Dog["status"],
    tagline: r.tagline,
    story: r.story,
  };
}

export async function getAllDogs(): Promise<Dog[]> {
  const rows = (await sql`SELECT * FROM dogs ORDER BY sort_order ASC`) as DogRow[];
  return rows.map(rowToDog);
}

export async function getDogBySlug(slug: string): Promise<Dog | undefined> {
  const rows = (await sql`SELECT * FROM dogs WHERE slug = ${slug} LIMIT 1`) as DogRow[];
  return rows[0] ? rowToDog(rows[0]) : undefined;
}

export async function addDog(dog: Dog): Promise<void> {
  await sql`
    INSERT INTO dogs (
      slug, name, image, photo_alt, sex, age_years, age_group, size, energy, breed,
      traits, good_with_gyerek, good_with_kutya, good_with_macska, status, tagline, story,
      sort_order
    ) VALUES (
      ${dog.slug}, ${dog.name}, ${dog.image}, ${dog.photoAlt}, ${dog.sex}, ${dog.ageYears},
      ${dog.ageGroup}, ${dog.size}, ${dog.energy}, ${dog.breed}, ${dog.traits},
      ${dog.goodWith.gyerek}, ${dog.goodWith.kutya}, ${dog.goodWith.macska}, ${dog.status},
      ${dog.tagline}, ${dog.story},
      (SELECT COALESCE(MIN(sort_order), 1) - 1 FROM dogs)
    )
  `;
}

/** Full update of every editable field, keyed by the (unchanged) slug. */
export async function updateDog(
  slug: string,
  dog: Omit<Dog, "slug">
): Promise<Dog | undefined> {
  const rows = (await sql`
    UPDATE dogs SET
      name = ${dog.name},
      image = ${dog.image},
      photo_alt = ${dog.photoAlt},
      sex = ${dog.sex},
      age_years = ${dog.ageYears},
      age_group = ${dog.ageGroup},
      size = ${dog.size},
      energy = ${dog.energy},
      breed = ${dog.breed},
      traits = ${dog.traits},
      good_with_gyerek = ${dog.goodWith.gyerek},
      good_with_kutya = ${dog.goodWith.kutya},
      good_with_macska = ${dog.goodWith.macska},
      status = ${dog.status},
      tagline = ${dog.tagline},
      story = ${dog.story}
    WHERE slug = ${slug}
    RETURNING *
  `) as DogRow[];
  return rows[0] ? rowToDog(rows[0]) : undefined;
}

export async function deleteDog(slug: string): Promise<Dog | undefined> {
  const rows = (await sql`DELETE FROM dogs WHERE slug = ${slug} RETURNING *`) as DogRow[];
  return rows[0] ? rowToDog(rows[0]) : undefined;
}

const CHAR_MAP: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ö: "o", ő: "o", ú: "u", ü: "u", ű: "u",
};

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[áéíóöőúüű]/g, (c) => CHAR_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "kutya";
}

/** Return a slug that is not already taken. */
export async function uniqueSlug(name: string): Promise<string> {
  const rows = (await sql`SELECT slug FROM dogs`) as { slug: string }[];
  const taken = new Set(rows.map((r) => r.slug));
  const base = slugify(name);
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

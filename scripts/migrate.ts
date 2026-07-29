// One-off, idempotent script: uploads each seed dog's local photo to Vercel
// Blob and upserts the row into the `dogs` table. Run after pulling env vars:
//   vercel env pull .env.local
//   npx tsx scripts/migrate.ts
//
// Uploads go through the `vercel blob put` CLI command rather than the
// @vercel/blob SDK: this project's Blob store trusts OIDC only for
// Production/Preview at the platform level, so a local script (outside
// `vercel dev`) can't authenticate via the SDK directly. The CLI uses its own
// logged-in session instead, sidestepping that restriction. Note the store
// always appends a random suffix to the pathname regardless of the
// `--add-random-suffix` flag — cosmetic only, since we always store whatever
// URL is actually returned.

import { config } from "dotenv";
config({ path: ".env.local" });

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { seedDogs } from "../data/dogs";

const execAsync = promisify(exec);
const sql = neon(process.env.DATABASE_URL!);

async function uploadPhoto(localImagePath: string, slug: string, ext: string): Promise<string> {
  const command = `npx --yes vercel blob put "${localImagePath}" -p "dogs/${slug}.${ext}" --access public --allow-overwrite true`;
  const { stdout, stderr } = await execAsync(command);
  const match = (stdout + stderr).match(/Success!\s+(\S+)/);
  if (!match) throw new Error(`Could not parse blob URL from CLI output:\n${stdout}\n${stderr}`);
  return match[1];
}

async function main() {
  for (const [index, dog] of seedDogs.entries()) {
    const localPath = path.join(process.cwd(), "public", dog.image);
    const ext = path.extname(dog.image).slice(1) || "jpg";

    const url = await uploadPhoto(localPath, dog.slug, ext);

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
        sort_order = EXCLUDED.sort_order;
    `;

    console.log(`migrated ${dog.slug} -> ${url}`);
  }
}

main()
  .then(() => console.log("done"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

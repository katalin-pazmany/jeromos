// Server-side data store for dogs. The live data lives in data/dogs.json;
// on first access it is seeded from seedDogs (data/dogs.ts).
//
// NOTE: this file-based store is intended for local / self-hosted use with
// `next dev` or `next start`. It is not suitable for serverless hosting
// (read-only filesystem). Only import it from server code (route handlers /
// server components), never from a client component.

import { promises as fs } from "fs";
import path from "path";
import { seedDogs, type Dog } from "@/data/dogs";

const DATA_PATH = path.join(process.cwd(), "data", "dogs.json");
export const DOGS_IMAGE_DIR = path.join(process.cwd(), "public", "dogs");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, JSON.stringify(seedDogs, null, 2), "utf8");
  }
}

export async function getAllDogs(): Promise<Dog[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Dog[];
}

export async function getDogBySlug(slug: string): Promise<Dog | undefined> {
  const dogs = await getAllDogs();
  return dogs.find((d) => d.slug === slug);
}

export async function saveAllDogs(dogs: Dog[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(dogs, null, 2), "utf8");
}

export async function addDog(dog: Dog): Promise<void> {
  const dogs = await getAllDogs();
  dogs.unshift(dog);
  await saveAllDogs(dogs);
}

export async function deleteDog(slug: string): Promise<Dog | undefined> {
  const dogs = await getAllDogs();
  const idx = dogs.findIndex((d) => d.slug === slug);
  if (idx === -1) return undefined;
  const [removed] = dogs.splice(idx, 1);
  await saveAllDogs(dogs);
  return removed;
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
  const dogs = await getAllDogs();
  const taken = new Set(dogs.map((d) => d.slug));
  const base = slugify(name);
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

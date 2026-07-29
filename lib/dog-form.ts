// Shared admin form parsing for both creating and editing a dog.

import type { Dog, Size, Energy, Sex, AgeGroup, Status, GoodWith } from "@/data/dogs";

export function triState(value: FormDataEntryValue | null): boolean | null {
  if (value === "igen") return true;
  if (value === "nem") return false;
  return null;
}

export const ALLOWED_IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

/** Every Dog field except slug/image, parsed from the admin form. */
export function parseDogFields(form: FormData, name: string): Omit<Dog, "slug" | "image"> {
  const traits = String(form.get("traits") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const goodWith: GoodWith = {
    gyerek: triState(form.get("goodKids")),
    kutya: triState(form.get("goodDogs")),
    macska: triState(form.get("goodCats")),
  };

  return {
    name,
    photoAlt: String(form.get("photoAlt") ?? `${name}, mentett kutya`),
    sex: String(form.get("sex") || "kan") as Sex,
    ageYears: Number(form.get("ageYears") ?? 0) || 0,
    ageGroup: String(form.get("ageGroup") || "felnőtt") as AgeGroup,
    size: String(form.get("size") || "közepes") as Size,
    energy: String(form.get("energy") || "kiegyensúlyozott") as Energy,
    breed: String(form.get("breed") ?? "keverék"),
    traits,
    goodWith,
    status: String(form.get("status") || "gazdit keres") as Status,
    tagline: String(form.get("tagline") ?? ""),
    story: String(form.get("story") ?? ""),
  };
}

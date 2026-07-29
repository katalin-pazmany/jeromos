import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAllDogs, addDog, uniqueSlug } from "@/lib/dogs-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";
import type {
  Dog,
  Size,
  Energy,
  Sex,
  AgeGroup,
  Status,
  GoodWith,
} from "@/data/dogs";

export const dynamic = "force-dynamic";

export async function GET() {
  const dogs = await getAllDogs();
  return NextResponse.json(dogs);
}

function triState(value: FormDataEntryValue | null): boolean | null {
  if (value === "igen") return true;
  if (value === "nem") return false;
  return null;
}

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

export async function POST(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "A név megadása kötelező." }, { status: 400 });
  }

  const slug = await uniqueSlug(name);

  // --- Optional image upload ---
  let image = "/dogs/placeholder.svg";
  const file = form.get("image");
  if (file && file instanceof File && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: "Nem támogatott képformátum." },
        { status: 400 }
      );
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const blob = await put(`dogs/${slug}.${ext}`, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    image = blob.url;
  }

  const traits = String(form.get("traits") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const goodWith: GoodWith = {
    gyerek: triState(form.get("goodKids")),
    kutya: triState(form.get("goodDogs")),
    macska: triState(form.get("goodCats")),
  };

  const dog: Dog = {
    slug,
    name,
    image,
    photoAlt: String(form.get("photoAlt") ?? `${name}, mentett kutya`),
    sex: (String(form.get("sex") || "kan") as Sex),
    ageYears: Number(form.get("ageYears") ?? 0) || 0,
    ageGroup: (String(form.get("ageGroup") || "felnőtt") as AgeGroup),
    size: (String(form.get("size") || "közepes") as Size),
    energy: (String(form.get("energy") || "kiegyensúlyozott") as Energy),
    breed: String(form.get("breed") ?? "keverék"),
    traits,
    goodWith,
    status: (String(form.get("status") || "gazdit keres") as Status),
    tagline: String(form.get("tagline") ?? ""),
    story: String(form.get("story") ?? ""),
  };

  await addDog(dog);
  return NextResponse.json(dog, { status: 201 });
}

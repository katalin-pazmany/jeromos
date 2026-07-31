import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAllDogs, addDog, uniqueSlug } from "@/lib/dogs-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";
import { parseDogFields, ALLOWED_IMAGE_EXT } from "@/lib/dog-form";
import type { Dog } from "@/data/dogs";

export const dynamic = "force-dynamic";

export async function GET() {
  const dogs = await getAllDogs();
  return NextResponse.json(dogs);
}

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
    if (!ALLOWED_IMAGE_EXT.has(ext)) {
      return NextResponse.json(
        { error: "Nem támogatott képformátum." },
        { status: 400 }
      );
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const blob = await put(`dogs/${slug}.${ext}`, bytes, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.type || undefined,
    });
    image = blob.url;
  }

  const dog: Dog = { slug, image, ...parseDogFields(form, name) };

  await addDog(dog);
  return NextResponse.json(dog, { status: 201 });
}

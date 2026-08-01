import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getDogBySlug } from "@/lib/dogs-store";
import { addDogPhoto, getPhotosForDog } from "@/lib/dog-photos-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";
import { ALLOWED_IMAGE_EXT } from "@/lib/dog-form";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthed())) return unauthorized();

  const { slug } = await params;
  const photos = await getPhotosForDog(slug);
  return NextResponse.json(photos);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthed())) return unauthorized();

  const { slug } = await params;
  const dog = await getDogBySlug(slug);
  if (!dog) {
    return NextResponse.json({ error: "Nincs ilyen kutya." }, { status: 404 });
  }

  const form = await request.formData();
  const files = form.getAll("photos").filter(
    (f): f is File => f instanceof File && f.size > 0
  );
  if (files.length === 0) {
    return NextResponse.json({ error: "Nincs feltöltendő fájl." }, { status: 400 });
  }

  // Validate every file before uploading any, so a bad one among several
  // doesn't leave a partial upload behind.
  for (const file of files) {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_IMAGE_EXT.has(ext)) {
      return NextResponse.json(
        { error: "Nem támogatott képformátum." },
        { status: 400 }
      );
    }
  }

  const created = [];
  for (const file of files) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const bytes = Buffer.from(await file.arrayBuffer());
    const blob = await put(`dogs/${slug}/photo.${ext}`, bytes, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
    created.push(await addDogPhoto(slug, blob.url, dog.photoAlt));
  }

  return NextResponse.json(created, { status: 201 });
}

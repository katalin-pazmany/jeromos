import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { deleteDog, getDogBySlug, updateDog } from "@/lib/dogs-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";
import { parseDogFields, ALLOWED_IMAGE_EXT } from "@/lib/dog-form";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthed())) return unauthorized();

  const { slug } = await params;
  const existing = await getDogBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Nincs ilyen kutya." }, { status: 404 });
  }

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "A név megadása kötelező." }, { status: 400 });
  }

  // --- Optional replacement image (kept as-is if none uploaded) ---
  let image = existing.image;
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
    if (existing.image.includes(".blob.vercel-storage.com") && existing.image !== blob.url) {
      try {
        await del(existing.image);
      } catch {
        // already gone — ignore
      }
    }
    image = blob.url;
  }

  const updated = await updateDog(slug, { image, ...parseDogFields(form, name) });
  if (!updated) {
    return NextResponse.json({ error: "Nincs ilyen kutya." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthed())) return unauthorized();

  const { slug } = await params;
  const removed = await deleteDog(slug);
  if (!removed) {
    return NextResponse.json({ error: "Nincs ilyen kutya." }, { status: 404 });
  }

  // Best-effort removal of the uploaded image blob.
  if (removed.image && removed.image.includes(".blob.vercel-storage.com")) {
    try {
      await del(removed.image);
    } catch {
      // already gone — ignore
    }
  }

  return NextResponse.json({ ok: true, slug });
}

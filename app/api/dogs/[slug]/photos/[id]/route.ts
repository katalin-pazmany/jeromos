import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { deleteDogPhoto } from "@/lib/dog-photos-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  if (!(await isAuthed())) return unauthorized();

  const { slug, id } = await params;
  const photoId = Number(id);
  if (!Number.isInteger(photoId)) {
    return NextResponse.json({ error: "Érvénytelen azonosító." }, { status: 400 });
  }

  const removed = await deleteDogPhoto(slug, photoId);
  if (!removed) {
    return NextResponse.json({ error: "Nincs ilyen fénykép." }, { status: 404 });
  }

  if (removed.url.includes(".blob.vercel-storage.com")) {
    try {
      await del(removed.url);
    } catch {
      // already gone — ignore
    }
  }

  return NextResponse.json({ ok: true, id: photoId });
}

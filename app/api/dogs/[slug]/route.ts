import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { deleteDog } from "@/lib/dogs-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

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

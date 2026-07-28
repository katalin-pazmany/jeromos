import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { deleteDog, DOGS_IMAGE_DIR } from "@/lib/dogs-store";
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

  // Best-effort removal of the uploaded image (skip seed images referenced elsewhere).
  if (removed.image && removed.image.startsWith("/dogs/")) {
    const filename = removed.image.replace("/dogs/", "");
    try {
      await fs.unlink(path.join(DOGS_IMAGE_DIR, filename));
    } catch {
      // image already gone or shared — ignore
    }
  }

  return NextResponse.json({ ok: true, slug });
}

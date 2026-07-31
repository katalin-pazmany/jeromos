import { NextResponse } from "next/server";
import { setApplicationHandled } from "@/lib/applications-store";
import { isAuthed, unauthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return unauthorized();

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const handled = Boolean(body.handled);

  const updated = await setApplicationHandled(id, handled);
  if (!updated) {
    return NextResponse.json({ error: "Nincs ilyen jelentkezés." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id, handled });
}

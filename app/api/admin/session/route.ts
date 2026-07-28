import { NextResponse } from "next/server";
import { adminConfigured, isAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    configured: adminConfigured,
    authed: await isAuthed(),
  });
}

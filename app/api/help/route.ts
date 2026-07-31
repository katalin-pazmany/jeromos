import { NextResponse } from "next/server";
import { sendMail, SHELTER_EMAIL } from "@/lib/mailer";
import { saveHelpRequest, getAllHelpRequests } from "@/lib/help-store";
import { HELP_CATEGORIES, type HelpCategory } from "@/lib/help-categories";
import { isAuthed, unauthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  const helpRequests = await getAllHelpRequests();
  return NextResponse.json(helpRequests);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const category = clean(body.category) as HelpCategory;
  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const availability = clean(body.availability);
  const message = clean(body.message);

  const categoryEntry = HELP_CATEGORIES.find((c) => c.value === category);
  if (!categoryEntry) {
    return NextResponse.json(
      { ok: false, error: "Kérjük, válassz egy érvényes kategóriát." },
      { status: 400 }
    );
  }
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Kérjük, töltsd ki a név, e-mail és üzenet mezőket." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Érvénytelen e-mail cím." },
      { status: 400 }
    );
  }

  const subject = `Segítenék: ${categoryEntry.label} – ${name}`;
  const text = [
    `Kategória: ${categoryEntry.label}`,
    `Név: ${name}`,
    `E-mail: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    availability ? `Mikor érne rá: ${availability}` : null,
    "",
    "Üzenet:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  // Always keep a local record.
  try {
    await saveHelpRequest({
      id: Date.now().toString(36),
      createdAt: new Date().toISOString(),
      category,
      name,
      email,
      phone,
      availability,
      message,
    });
  } catch {
    // non-fatal
  }

  // Try to actually send the email if credentials are configured.
  const delivered = await sendMail({ replyTo: email, subject, text });
  if (delivered) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const mailto = `mailto:${SHELTER_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(text)}`;
  return NextResponse.json({ ok: true, delivered: false, mailto });
}

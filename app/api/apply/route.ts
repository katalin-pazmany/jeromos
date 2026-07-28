import { NextResponse } from "next/server";
import { getTransport, mailFrom, SHELTER_EMAIL } from "@/lib/mailer";
import { saveApplication } from "@/lib/applications-store";
import { getDogBySlug } from "@/lib/dogs-store";

export const dynamic = "force-dynamic";

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const name = clean(body.name);
  const email = clean(body.email);
  const intro = clean(body.intro);

  if (!name || !email || !intro) {
    return NextResponse.json(
      { ok: false, error: "Kérjük, töltsd ki a név, e-mail és bemutatkozás mezőket." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Érvénytelen e-mail cím." },
      { status: 400 }
    );
  }

  const phone = clean(body.phone);
  const city = clean(body.city);
  const garden = clean(body.garden);
  const otherPets = clean(body.otherPets);

  // Resolve dog slug → display name for the email.
  let dogLabel = clean(body.dog);
  if (dogLabel) {
    const dog = await getDogBySlug(dogLabel);
    if (dog) dogLabel = dog.name;
  }

  const subject = `Örökbefogadási jelentkezés – ${name}${
    dogLabel ? ` (${dogLabel})` : ""
  }`;

  const text = [
    `Név: ${name}`,
    `E-mail: ${email}`,
    phone && `Telefon: ${phone}`,
    city && `Lakhely: ${city}`,
    garden && `Van kertje: ${garden}`,
    otherPets && `Van már állata: ${otherPets}`,
    dogLabel && `Kiszemelt kutya: ${dogLabel}`,
    "",
    "Bemutatkozás:",
    intro,
  ]
    .filter((line) => line !== false && line !== undefined)
    .join("\n");

  // Always keep a local record.
  try {
    await saveApplication({
      id: Date.now().toString(36),
      createdAt: new Date().toISOString(),
      name,
      email,
      phone,
      city,
      garden,
      otherPets,
      dog: dogLabel,
      intro,
    });
  } catch {
    // non-fatal
  }

  // Try to actually send the email if credentials are configured.
  const transport = getTransport();
  if (transport) {
    try {
      await transport.sendMail({
        from: mailFrom(),
        to: SHELTER_EMAIL,
        replyTo: email,
        subject,
        text,
      });
      return NextResponse.json({ ok: true, delivered: true });
    } catch {
      // fall through to the mailto fallback
    }
  }

  // Fallback: hand back a mailto: link the browser can open, so the applicant
  // can send from their own mail app even without server email configured.
  const mailto = `mailto:${SHELTER_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(text)}`;
  return NextResponse.json({ ok: true, delivered: false, mailto });
}

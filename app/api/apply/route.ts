import { NextResponse } from "next/server";
import { sendMail, SHELTER_EMAIL } from "@/lib/mailer";
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

  const lines: string[] = [`Név: ${name}`, `E-mail: ${email}`];
  if (phone) lines.push(`Telefon: ${phone}`);
  if (city) lines.push(`Lakhely: ${city}`);
  if (garden) lines.push(`Van kertje: ${garden}`);
  if (otherPets) lines.push(`Van már állata: ${otherPets}`);
  if (dogLabel) lines.push(`Kiszemelt kutya: ${dogLabel}`);
  lines.push("", "Bemutatkozás:", intro);
  const text = lines.join("\n");

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
  const delivered = await sendMail({ replyTo: email, subject, text });
  if (delivered) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  // Fallback: hand back a mailto: link the browser can open, so the applicant
  // can send from their own mail app even without server email configured.
  const mailto = `mailto:${SHELTER_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(text)}`;
  return NextResponse.json({ ok: true, delivered: false, mailto });
}

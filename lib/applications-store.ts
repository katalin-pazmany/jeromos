import { sql } from "@/lib/db";

export interface Application {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  garden: string;
  otherPets: string;
  dog: string;
  intro: string;
}

// Keep a record of every application so nothing is lost even if email
// delivery isn't configured. Contains personal data — keep it private.
export async function saveApplication(app: Application): Promise<void> {
  await sql`
    INSERT INTO applications (id, created_at, name, email, phone, city, garden, other_pets, dog, intro)
    VALUES (
      ${app.id}, ${app.createdAt}, ${app.name}, ${app.email}, ${app.phone}, ${app.city},
      ${app.garden}, ${app.otherPets}, ${app.dog}, ${app.intro}
    )
  `;
}

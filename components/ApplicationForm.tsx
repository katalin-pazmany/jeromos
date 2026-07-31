"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SpamGuardFields from "./SpamGuardFields";

type DogOption = {
  slug: string;
  name: string;
  image: string;
  traits: string[];
};

export default function ApplicationForm({
  dogs,
  preselect = "",
}: {
  dogs: DogOption[];
  preselect?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | "sent" | "mailto">(null);
  const [dogSlug, setDogSlug] = useState(preselect);

  const selectedDog = dogs.find((d) => d.slug === dogSlug);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Hiba történt a küldés során. Próbáld újra.");
      return;
    }

    const d = await res.json();
    if (d.delivered) {
      setDone("sent");
      form.reset();
    } else if (d.mailto) {
      // Server email isn't configured — open the applicant's mail app prefilled.
      window.location.href = d.mailto;
      setDone("mailto");
      form.reset();
    } else {
      setDone("sent");
      form.reset();
    }
  }

  if (done) {
    return (
      <div className="callout accent" style={{ fontStyle: "normal" }}>
        <b style={{ display: "block", marginBottom: 6 }}>
          Köszönjük a jelentkezésed! 🐾
        </b>
        {done === "sent"
          ? "Megkaptuk a leveledet, és hamarosan felvesszük veled a kapcsolatot."
          : "Megnyitottuk a levelezőprogramodat az előre kitöltött üzenettel — kérjük, küldd el nekünk, és hamarosan jelentkezünk!"}
      </div>
    );
  }

  return (
    <form className="appform" onSubmit={handleSubmit}>
      <SpamGuardFields />
      {error && (
        <div className="admin-alert error field full">{error}</div>
      )}

      {/* LEFT: the chosen dog */}
      <aside className="apply-dog">
        <div className="field">
          <label htmlFor="dog">Melyik kutyára jelentkezel? *</label>
          <select
            id="dog"
            name="dog"
            required
            value={dogSlug}
            onChange={(e) => setDogSlug(e.target.value)}
          >
            <option value="" disabled hidden>
              — válassz kutyát —
            </option>
            {dogs.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {selectedDog ? (
          <figure className="apply-dog-card">
            <Image
              src={selectedDog.image}
              alt={selectedDog.name}
              width={400}
              height={500}
              sizes="(max-width: 720px) 100vw, 320px"
            />
            <figcaption>
              <h3>{selectedDog.name}</h3>
              <div className="apply-dog-tags">
                {selectedDog.traits.map((t) => (
                  <span className="trait-chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </figcaption>
          </figure>
        ) : (
          <div className="apply-dog-empty">
            <span>🐾</span>
            <p>Válassz egy kutyát a listából, és itt megjelenik a fotója.</p>
          </div>
        )}
      </aside>

      {/* RIGHT: adopter's details + description */}
      <div className="apply-fields">
        {error && <div className="admin-alert error">{error}</div>}

        <div className="apply-row">
          <div className="field">
            <label htmlFor="name">Neved *</label>
            <input id="name" name="name" required placeholder="Teljes név" />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail *</label>
            <input id="email" name="email" type="email" required placeholder="pl. neved@email.hu" />
          </div>
        </div>

        <div className="apply-row">
          <div className="field">
            <label htmlFor="phone">Telefonszám *</label>
            <input id="phone" name="phone" required placeholder="+36 ..." />
          </div>
          <div className="field">
            <label htmlFor="city">Lakhely (város) *</label>
            <input id="city" name="city" required placeholder="pl. Baja" />
          </div>
        </div>

        <div className="apply-row">
          <div className="field">
            <label htmlFor="garden">Van kerted? *</label>
            <select id="garden" name="garden" required defaultValue="">
              <option value="" disabled hidden>
                — válassz —
              </option>
              <option value="Igen">Igen</option>
              <option value="Nem">Nem</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="otherPets">Van már otthon állatod? *</label>
            <input id="otherPets" name="otherPets" required placeholder="pl. egy kutya, macska nincs" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="intro">Bemutatkozás *</label>
          <div className="bubble">
            <textarea
              id="intro"
              name="intro"
              required
              rows={7}
              placeholder="Mesélj magadról! Miért szeretnél örökbe fogadni, hogyan képzeled a közös életet, mennyi időt tudsz a kutyára szánni, milyen a lakókörnyezeted, van-e tapasztalatod kutyatartásban?"
            />
          </div>
        </div>

        <p className="form-privacy-note">
          A küldéssel elfogadod, hogy a megadott adataidat a jelentkezésed
          feldolgozásához kezeljük — bővebben az{" "}
          <Link href="/adatvedelem">adatvédelmi tájékoztatóban</Link>.
        </p>

        <button type="submit" className="button solid" disabled={submitting}>
          {submitting ? "Küldés..." : "Jelentkezés elküldése"}
        </button>
      </div>
    </form>
  );
}

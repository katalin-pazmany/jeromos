"use client";

import { useState } from "react";
import { HELP_CATEGORIES, type HelpCategory } from "@/lib/help-categories";

export default function HelpForm({ preselect = "" }: { preselect?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | "sent" | "mailto">(null);
  const [category, setCategory] = useState<HelpCategory | "">(
    (preselect as HelpCategory) || ""
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch("/api/help", {
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
    if (d.mailto && !d.delivered) {
      window.location.href = d.mailto;
      setDone("mailto");
    } else {
      setDone("sent");
    }
    form.reset();
  }

  if (done) {
    return (
      <div className="callout accent" style={{ fontStyle: "normal" }}>
        <b style={{ display: "block", marginBottom: 6 }}>Köszönjük! 🐾</b>
        {done === "sent"
          ? "Megkaptuk az üzeneted, és hamarosan felvesszük veled a kapcsolatot."
          : "Megnyitottuk a levelezőprogramodat az előre kitöltött üzenettel — kérjük, küldd el nekünk, és hamarosan jelentkezünk!"}
      </div>
    );
  }

  return (
    <form className="appform help-request-form" onSubmit={handleSubmit}>
      {error && <div className="admin-alert error field full">{error}</div>}

      <div className="field">
        <label>Hogyan szeretnél segíteni? *</label>
        <select
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as HelpCategory)}
        >
          <option value="" disabled hidden>
            — válassz —
          </option>
          {HELP_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="apply-row">
        <div className="field">
          <label>Neved *</label>
          <input name="name" required placeholder="Teljes név" />
        </div>
        <div className="field">
          <label>E-mail *</label>
          <input name="email" type="email" required placeholder="pl. neved@email.hu" />
        </div>
      </div>

      <div className="apply-row">
        <div className="field">
          <label>Telefonszám (opcionális)</label>
          <input name="phone" placeholder="+36 ..." />
        </div>
        <div className="field">
          <label>Mikor érnél rá segíteni? (opcionális)</label>
          <input
            name="availability"
            placeholder="pl. hétvégenként, vagy hét közben este"
          />
        </div>
      </div>

      <div className="field">
        <label>Üzenet, leírás *</label>
        <div className="bubble">
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Mesélj kicsit magadról, és arról, hogyan tudnál segíteni!"
          />
        </div>
      </div>

      <button type="submit" className="button solid" disabled={submitting}>
        {submitting ? "Küldés..." : "Küldés"}
      </button>
    </form>
  );
}

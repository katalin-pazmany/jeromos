"use client";

import { useState } from "react";

export default function Belepes() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/site-login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      const from = new URLSearchParams(window.location.search).get("from");
      window.location.href = from && from.startsWith("/") ? from : "/";
      return;
    }
    setError("Hibás jelszó, próbáld újra.");
  }

  return (
    <main className="gate">
      <div className="gate-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gate-logo" src="/jeromos_logo.svg" alt="Jeromos Egyesület" />
        <h1>Jeromos Egyesület</h1>
        <p>
          Az oldal jelenleg fejlesztés alatt áll. A megtekintéshez add meg a
          jelszót.
        </p>
        {error && <div className="admin-alert error">{error}</div>}
        <form onSubmit={submit} className="admin-login gate-form">
          <input
            type="password"
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" className="button solid" disabled={loading}>
            {loading ? "Belépés..." : "Belépés"}
          </button>
        </form>
      </div>
    </main>
  );
}

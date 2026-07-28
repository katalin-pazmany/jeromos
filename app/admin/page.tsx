"use client";

import { useEffect, useState } from "react";
import type { Dog } from "@/data/dogs";
import PasswordInput from "@/components/PasswordInput";

const sizes = ["kicsi", "közepes", "nagy"];
const energies = ["nyugodt", "kiegyensúlyozott", "energikus"];
const sexes = ["kan", "szuka", "vegyes"];
const ageGroups = ["kölyök", "fiatal", "felnőtt", "idős"];
const statuses = ["gazdit keres", "ideiglenesen befogadva"];
const triOptions = [
  { value: "ismeretlen", label: "Még ismeretlen" },
  { value: "igen", label: "Igen" },
  { value: "nem", label: "Nem" },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [ready, setReady] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Check the httpOnly session cookie on load.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        const data = await res.json();
        setConfigured(data.configured);
        setAuthed(data.authed);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function loadDogs() {
    const res = await fetch("/api/dogs", { cache: "no-store" });
    setDogs(await res.json());
  }

  useEffect(() => {
    if (authed) loadDogs();
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      setAuthed(true);
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error || "Hibás jelszó.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const res = await fetch("/api/dogs", { method: "POST", body: form });
    setLoading(false);
    if (res.status === 401) {
      setError("A munkamenet lejárt — jelentkezz be újra.");
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Hiba történt a mentés során.");
      return;
    }
    const dog = (await res.json()) as Dog;
    setNotice(`„${dog.name}” hozzáadva.`);
    formEl.reset();
    loadDogs();
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Biztosan törlöd őt: ${name}?`)) return;
    setError("");
    setNotice("");
    const res = await fetch(`/api/dogs/${slug}`, { method: "DELETE" });
    if (res.status === 401) {
      setError("A munkamenet lejárt — jelentkezz be újra.");
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setError("Nem sikerült törölni.");
      return;
    }
    setNotice(`„${name}” törölve.`);
    loadDogs();
  }

  if (!ready) {
    return (
      <main className="admin-wrap">
        <h1>Kutyák kezelése</h1>
        <p className="admin-sub">Betöltés…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="admin-wrap">
        <h1>Kutyák kezelése</h1>
        {configured ? (
          <>
            <p className="admin-sub">Add meg az admin jelszót a folytatáshoz.</p>
            {error && <div className="admin-alert error">{error}</div>}
            <form onSubmit={login} className="admin-login">
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Admin jelszó"
                autoFocus
              />
              <button type="submit" className="button solid">
                Belépés
              </button>
            </form>
          </>
        ) : (
          <div className="admin-alert error">
            Az admin jelszó nincs beállítva. Hozz létre egy <b>.env.local</b>{" "}
            fájlt az <b>ADMIN_PASSWORD=…</b> sorral, majd indítsd újra a szervert.
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="admin-wrap">
      <div className="admin-head">
        <div>
          <h1>Kutyák kezelése</h1>
          <p className="admin-sub">{dogs.length} kutya az adatbázisban.</p>
        </div>
        <button className="button" onClick={logout}>
          Kilépés
        </button>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {notice && <div className="admin-alert ok">{notice}</div>}

      {/* Add form */}
      <section className="admin-card">
        <h2>Új kutya felvétele</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <div className="field">
            <label>Név *</label>
            <input name="name" required placeholder="pl. Bodri" />
          </div>
          <div className="field">
            <label>Fajta</label>
            <input name="breed" placeholder="pl. keverék" />
          </div>

          <div className="field">
            <label>Nem</label>
            <select name="sex" defaultValue="kan">
              {sexes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Kor (év)</label>
            <input name="ageYears" type="number" min="0" step="1" defaultValue={2} />
          </div>
          <div className="field">
            <label>Korosztály</label>
            <select name="ageGroup" defaultValue="felnőtt">
              {ageGroups.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Méret</label>
            <select name="size" defaultValue="közepes">
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Energia</label>
            <select name="energy" defaultValue="kiegyensúlyozott">
              {energies.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Státusz</label>
            <select name="status" defaultValue="gazdit keres">
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Összefér gyerekkel</label>
            <select name="goodKids" defaultValue="ismeretlen">
              {triOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Összefér kutyával</label>
            <select name="goodDogs" defaultValue="ismeretlen">
              {triOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Összefér macskával</label>
            <select name="goodCats" defaultValue="ismeretlen">
              {triOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="field full">
            <label>Tulajdonságok (vesszővel elválasztva)</label>
            <input name="traits" placeholder="barátságos, játékos, okos" />
          </div>
          <div className="field full">
            <label>Rövid mottó</label>
            <input name="tagline" placeholder="pl. Örökmozgó, ölelnivaló csibész." />
          </div>
          <div className="field full">
            <label>Leírás</label>
            <textarea name="story" rows={4} placeholder="Néhány mondat a kutyusról..." />
          </div>
          <div className="field full">
            <label>Fénykép</label>
            <input name="image" type="file" accept="image/*" />
          </div>

          <div className="field full">
            <button type="submit" className="button solid" disabled={loading}>
              {loading ? "Mentés..." : "Kutya hozzáadása"}
            </button>
          </div>
        </form>
      </section>

      {/* Dog list */}
      <section className="admin-card">
        <h2>Meglévő kutyák</h2>
        <div className="admin-list">
          {dogs.map((dog) => (
            <div className="admin-row" key={dog.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dog.image} alt={dog.name} />
              <div className="admin-row-info">
                <b>{dog.name}</b>
                <span>
                  {dog.ageGroup} · {dog.sex} · {dog.size} · {dog.energy}
                </span>
              </div>
              <button
                className="button danger"
                onClick={() => handleDelete(dog.slug, dog.name)}
              >
                Törlés
              </button>
            </div>
          ))}
          {dogs.length === 0 && <p>Még nincs felvett kutya.</p>}
        </div>
      </section>
    </main>
  );
}

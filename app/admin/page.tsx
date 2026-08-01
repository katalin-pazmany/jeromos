"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Dog } from "@/data/dogs";
import PasswordInput from "@/components/PasswordInput";
import SiteHeader from "@/components/SiteHeader";
import ApplicationsPanel from "@/components/admin/ApplicationsPanel";
import HelpRequestsPanel from "@/components/admin/HelpRequestsPanel";
import DogPhotosPanel from "@/components/admin/DogPhotosPanel";

type Tab = "kutyak" | "jelentkezesek" | "segitseg";

const sizes = ["kicsi", "közepes", "nagy"];
const energies = ["nyugodt", "kiegyensúlyozott", "energikus"];
const sexes = ["kan", "szuka", "vegyes", "ismeretlen"];
const ageGroups = ["kölyök", "fiatal", "felnőtt", "idős"];
const statuses = ["gazdit keres", "ideiglenesen befogadva"];
const triOptions = [
  { value: "ismeretlen", label: "Még ismeretlen" },
  { value: "igen", label: "Igen" },
  { value: "nem", label: "Nem" },
];

function triDefault(value: boolean | null): string {
  if (value === true) return "igen";
  if (value === false) return "nem";
  return "ismeretlen";
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [ready, setReady] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("kutyak");
  const formRef = useRef<HTMLDivElement>(null);

  function sessionExpired() {
    setError("A munkamenet lejárt — jelentkezz be újra.");
    setAuthed(false);
  }

  const editingDog = editingSlug
    ? dogs.find((d) => d.slug === editingSlug) ?? null
    : null;

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

  function startEdit(slug: string) {
    setError("");
    setNotice("");
    setEditingSlug(slug);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditingSlug(null);
    setError("");
    setNotice("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const url = editingSlug ? `/api/dogs/${editingSlug}` : "/api/dogs";
    const method = editingSlug ? "PATCH" : "POST";
    const res = await fetch(url, { method, body: form });
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
    setNotice(editingSlug ? `„${dog.name}” mentve.` : `„${dog.name}” hozzáadva.`);
    setEditingSlug(null);
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
    if (editingSlug === slug) setEditingSlug(null);
    setNotice(`„${name}” törölve.`);
    loadDogs();
  }

  if (!ready) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="admin-wrap">
          <h1>Kutyák kezelése</h1>
          <p className="admin-sub">Betöltés…</p>
        </main>
      </>
    );
  }

  if (!authed) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="admin-wrap">
          <h1>Kutyák kezelése</h1>
          {configured ? (
            <>
              <p className="admin-sub">Add meg az admin jelszót a folytatáshoz.</p>
              {error && <div className="admin-alert error">{error}</div>}
              <form onSubmit={login} className="admin-login">
                <label htmlFor="admin-password">Admin jelszó</label>
                <PasswordInput
                  id="admin-password"
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
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="admin-wrap">
      <div className="admin-head">
        <div>
          <h1>Admin felület</h1>
          <p className="admin-sub">{dogs.length} kutya az adatbázisban.</p>
        </div>
        <button className="button" onClick={logout}>
          Kilépés
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab${tab === "kutyak" ? " active" : ""}`}
          onClick={() => setTab("kutyak")}
        >
          Kutyák
        </button>
        <button
          className={`admin-tab${tab === "jelentkezesek" ? " active" : ""}`}
          onClick={() => setTab("jelentkezesek")}
        >
          Örökbefogadási jelentkezések
        </button>
        <button
          className={`admin-tab${tab === "segitseg" ? " active" : ""}`}
          onClick={() => setTab("segitseg")}
        >
          Önkéntes jelentkezések
        </button>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {notice && <div className="admin-alert ok">{notice}</div>}

      {tab === "jelentkezesek" && (
        <section className="admin-card">
          <h2>Örökbefogadási jelentkezések</h2>
          <ApplicationsPanel onSessionExpired={sessionExpired} />
        </section>
      )}

      {tab === "segitseg" && (
        <section className="admin-card">
          <h2>Önkéntes jelentkezések</h2>
          <HelpRequestsPanel onSessionExpired={sessionExpired} />
        </section>
      )}

      {tab === "kutyak" && (
      <>
      {/* Add / edit form */}
      <section className="admin-card" ref={formRef}>
        <h2>{editingDog ? `Szerkesztés: ${editingDog.name}` : "Új kutya felvétele"}</h2>
        <form
          key={editingSlug ?? "new"}
          onSubmit={handleSubmit}
          className="admin-form"
        >
          <div className="field">
            <label htmlFor="name">Név *</label>
            <input id="name" name="name" required placeholder="pl. Bodri" defaultValue={editingDog?.name} />
          </div>
          <div className="field">
            <label htmlFor="breed">Fajta</label>
            <input id="breed" name="breed" placeholder="pl. keverék" defaultValue={editingDog?.breed} />
          </div>

          <div className="field">
            <label htmlFor="sex">Nem</label>
            <select id="sex" name="sex" defaultValue={editingDog?.sex ?? "kan"}>
              {sexes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ageYears">Kor (év)</label>
            <input
              id="ageYears"
              name="ageYears"
              type="number"
              min="0"
              step="1"
              defaultValue={editingDog?.ageYears ?? 2}
            />
          </div>
          <div className="field">
            <label htmlFor="ageGroup">Korosztály</label>
            <select id="ageGroup" name="ageGroup" defaultValue={editingDog?.ageGroup ?? "felnőtt"}>
              {ageGroups.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="size">Méret</label>
            <select id="size" name="size" defaultValue={editingDog?.size ?? "közepes"}>
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="energy">Energia</label>
            <select id="energy" name="energy" defaultValue={editingDog?.energy ?? "kiegyensúlyozott"}>
              {energies.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Státusz</label>
            <select id="status" name="status" defaultValue={editingDog?.status ?? "gazdit keres"}>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="goodKids">Összefér gyerekkel</label>
            <select id="goodKids" name="goodKids" defaultValue={triDefault(editingDog?.goodWith.gyerek ?? null)}>
              {triOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="goodDogs">Összefér kutyával</label>
            <select id="goodDogs" name="goodDogs" defaultValue={triDefault(editingDog?.goodWith.kutya ?? null)}>
              {triOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="goodCats">Összefér macskával</label>
            <select id="goodCats" name="goodCats" defaultValue={triDefault(editingDog?.goodWith.macska ?? null)}>
              {triOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="field full">
            <label htmlFor="traits">Tulajdonságok (vesszővel elválasztva)</label>
            <input
              id="traits"
              name="traits"
              placeholder="barátságos, játékos, okos"
              defaultValue={editingDog?.traits.join(", ")}
            />
          </div>
          <div className="field full">
            <label htmlFor="tagline">Rövid mottó</label>
            <input
              id="tagline"
              name="tagline"
              placeholder="pl. Örökmozgó, ölelnivaló csibész."
              defaultValue={editingDog?.tagline}
            />
          </div>
          <div className="field full">
            <label htmlFor="story">Leírás</label>
            <textarea
              id="story"
              name="story"
              rows={4}
              placeholder="Néhány mondat a kutyusról..."
              defaultValue={editingDog?.story}
            />
          </div>
          <div className="field full">
            <label htmlFor="image">Fénykép{editingDog ? " (hagyd üresen, ha nem cseréled le)" : ""}</label>
            {editingDog && (
              <Image
                src={editingDog.image}
                alt={editingDog.name}
                width={96}
                height={96}
                style={{ objectFit: "cover", borderRadius: 10, marginBottom: 8 }}
              />
            )}
            <input id="image" name="image" type="file" accept="image/*" />
          </div>

          <div className="field full" style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="button solid" disabled={loading}>
              {loading ? "Mentés..." : editingDog ? "Mentés" : "Kutya hozzáadása"}
            </button>
            {editingDog && (
              <button type="button" className="button" onClick={cancelEdit}>
                Mégse
              </button>
            )}
          </div>
        </form>

        {editingDog && (
          <div className="admin-gallery-section">
            <h3>További fényképek</h3>
            <DogPhotosPanel slug={editingDog.slug} onSessionExpired={sessionExpired} />
          </div>
        )}
      </section>

      {/* Dog list */}
      <section className="admin-card">
        <h2>Meglévő kutyák</h2>
        <div className="admin-list">
          {dogs.map((dog) => (
            <div className="admin-row" key={dog.slug}>
              <Image src={dog.image} alt={dog.name} width={64} height={64} />
              <div className="admin-row-info">
                <b>{dog.name}</b>
                <span>
                  {dog.ageGroup} · {dog.sex} · {dog.size} · {dog.energy}
                </span>
              </div>
              <button className="button" onClick={() => startEdit(dog.slug)}>
                Szerkesztés
              </button>
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
      </>
      )}
      </main>
    </>
  );
}

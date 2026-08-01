"use client";

import { useEffect, useState } from "react";

interface Application {
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
  handled: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ApplicationsPanel({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const [items, setItems] = useState<Application[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/apply", { cache: "no-store" });
    if (res.status === 401) {
      onSessionExpired();
      return;
    }
    if (!res.ok) {
      setError("Nem sikerült betölteni a jelentkezéseket.");
      return;
    }
    setItems(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleHandled(id: string, handled: boolean) {
    setItems((prev) =>
      prev ? prev.map((a) => (a.id === id ? { ...a, handled } : a)) : prev
    );
    const res = await fetch(`/api/apply/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    if (res.status === 401) {
      onSessionExpired();
    } else if (!res.ok) {
      // revert on failure
      setItems((prev) =>
        prev ? prev.map((a) => (a.id === id ? { ...a, handled: !handled } : a)) : prev
      );
    }
  }

  if (error) return <div className="admin-alert error">{error}</div>;
  if (!items) return <p className="admin-sub">Betöltés…</p>;

  const open = items.filter((a) => !a.handled);
  const done = items.filter((a) => a.handled);

  return (
    <div className="submissions-list">
      <p className="admin-sub">
        {items.length} jelentkezés összesen — {open.length} elintézetlen.
      </p>
      {items.length === 0 && <p>Még nem érkezett jelentkezés.</p>}
      {[...open, ...done].map((a) => {
        const isOpen = openId === a.id;
        return (
          <div className={`submission-card${a.handled ? " handled" : ""}`} key={a.id}>
            <button
              type="button"
              className="submission-summary"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : a.id)}
            >
              <span className={`submission-chevron${isOpen ? " open" : ""}`} aria-hidden="true">
                ▸
              </span>
              <span className="submission-title">
                <b>{a.name}</b>
                {a.dog && <span className="tag">{a.dog}</span>}
              </span>
              <span className="submission-date">{formatDate(a.createdAt)}</span>
              <label
                className="submission-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={a.handled}
                  onChange={(e) => toggleHandled(a.id, e.target.checked)}
                />
                Elintézve
              </label>
            </button>
            {isOpen && (
              <div className="submission-body">
                <div className="submission-contact">
                  <a href={`mailto:${a.email}`}>{a.email}</a>
                  {a.phone && <a href={`tel:${a.phone}`}>{a.phone}</a>}
                  {a.city && <span>{a.city}</span>}
                </div>
                <div className="submission-meta">
                  {a.garden && <span>Kert: {a.garden}</span>}
                  {a.otherPets && <span>Van már állata: {a.otherPets}</span>}
                </div>
                <p className="submission-intro">{a.intro}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

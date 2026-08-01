"use client";

import { useEffect, useState } from "react";
import { HELP_CATEGORIES, type HelpCategory } from "@/lib/help-categories";

interface HelpRequest {
  id: string;
  createdAt: string;
  category: HelpCategory;
  name: string;
  email: string;
  phone: string;
  availability: string;
  message: string;
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

function categoryLabel(value: HelpCategory): string {
  return HELP_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export default function HelpRequestsPanel({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const [items, setItems] = useState<HelpRequest[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/help", { cache: "no-store" });
    if (res.status === 401) {
      onSessionExpired();
      return;
    }
    if (!res.ok) {
      setError("Nem sikerült betölteni az önkéntes jelentkezéseket.");
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
      prev ? prev.map((h) => (h.id === id ? { ...h, handled } : h)) : prev
    );
    const res = await fetch(`/api/help/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    if (res.status === 401) {
      onSessionExpired();
    } else if (!res.ok) {
      setItems((prev) =>
        prev ? prev.map((h) => (h.id === id ? { ...h, handled: !handled } : h)) : prev
      );
    }
  }

  if (error) return <div className="admin-alert error">{error}</div>;
  if (!items) return <p className="admin-sub">Betöltés…</p>;

  const open = items.filter((h) => !h.handled);
  const done = items.filter((h) => h.handled);

  return (
    <div className="submissions-list">
      <p className="admin-sub">
        {items.length} önkéntes jelentkezés összesen — {open.length} elintézetlen.
      </p>
      {items.length === 0 && <p>Még nem érkezett önkéntes jelentkezés.</p>}
      {[...open, ...done].map((h) => {
        const isOpen = openId === h.id;
        return (
          <div className={`submission-card${h.handled ? " handled" : ""}`} key={h.id}>
            <button
              type="button"
              className="submission-summary"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : h.id)}
            >
              <span className={`submission-chevron${isOpen ? " open" : ""}`} aria-hidden="true">
                ▸
              </span>
              <span className="submission-title">
                <b>{h.name}</b>
                <span className="tag">{categoryLabel(h.category)}</span>
              </span>
              <span className="submission-date">{formatDate(h.createdAt)}</span>
              <label
                className="submission-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={h.handled}
                  onChange={(e) => toggleHandled(h.id, e.target.checked)}
                />
                Elintézve
              </label>
            </button>
            {isOpen && (
              <div className="submission-body">
                <div className="submission-contact">
                  <a href={`mailto:${h.email}`}>{h.email}</a>
                  {h.phone && <a href={`tel:${h.phone}`}>{h.phone}</a>}
                  {h.availability && <span>{h.availability}</span>}
                </div>
                <p className="submission-intro">{h.message}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

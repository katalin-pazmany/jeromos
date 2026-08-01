"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface DogPhoto {
  id: number;
  url: string;
  alt: string;
}

export default function DogPhotosPanel({
  slug,
  onSessionExpired,
}: {
  slug: string;
  onSessionExpired: () => void;
}) {
  const [photos, setPhotos] = useState<DogPhoto[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch(`/api/dogs/${slug}/photos`, { cache: "no-store" });
    if (res.status === 401) {
      onSessionExpired();
      return;
    }
    if (!res.ok) {
      setError("Nem sikerült betölteni a fényképeket.");
      return;
    }
    setPhotos(await res.json());
  }

  useEffect(() => {
    setPhotos(null);
    setError("");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const input = fileInputRef.current;
    if (!input || !input.files || input.files.length === 0) return;

    setError("");
    setUploading(true);
    const form = new FormData();
    for (const file of Array.from(input.files)) {
      form.append("photos", file);
    }
    const res = await fetch(`/api/dogs/${slug}/photos`, { method: "POST", body: form });
    setUploading(false);
    if (res.status === 401) {
      onSessionExpired();
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Hiba történt a feltöltés során.");
      return;
    }
    const created = (await res.json()) as DogPhoto[];
    setPhotos((prev) => [...(prev ?? []), ...created]);
    input.value = "";
  }

  async function handleDelete(id: number) {
    setError("");
    const res = await fetch(`/api/dogs/${slug}/photos/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      onSessionExpired();
      return;
    }
    if (!res.ok) {
      setError("Nem sikerült törölni a fényképet.");
      return;
    }
    setPhotos((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
  }

  if (!photos) {
    return error ? (
      <div className="admin-alert error">{error}</div>
    ) : (
      <p className="admin-sub">Betöltés…</p>
    );
  }

  return (
    <div>
      {error && <div className="admin-alert error">{error}</div>}
      {photos.length > 0 && (
        <div className="admin-gallery-grid">
          {photos.map((photo) => (
            <div className="admin-gallery-item" key={photo.id}>
              <Image src={photo.url} alt={photo.alt} width={96} height={96} />
              <button
                type="button"
                className="admin-gallery-remove"
                onClick={() => handleDelete(photo.id)}
                aria-label="Fénykép törlése"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleUpload} style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input ref={fileInputRef} type="file" name="photos" accept="image/*" multiple />
        <button type="submit" className="button" disabled={uploading}>
          {uploading ? "Feltöltés..." : "Feltöltés"}
        </button>
      </form>
    </div>
  );
}

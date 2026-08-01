"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface GalleryImage {
  url: string;
  alt: string;
}

export default function DogGallery({
  images,
  status,
}: {
  images: GalleryImage[];
  status: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () =>
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const hero = images[0];
  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <div className="dog-profile-media">
      <div className="dog-profile-photo">
        <button
          type="button"
          className="dog-photo-trigger"
          onClick={() => setOpenIndex(0)}
        >
          <Image
            src={hero.url}
            alt={hero.alt}
            width={800}
            height={560}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </button>
        <span className="tag dog-profile-status">{status}</span>
      </div>

      {images.length > 1 && (
        <div className="dog-gallery-strip">
          {images.map((img, i) => (
            <button
              type="button"
              className="dog-gallery-thumb"
              key={img.url + i}
              onClick={() => setOpenIndex(i)}
            >
              <Image src={img.url} alt={img.alt} width={78} height={60} />
            </button>
          ))}
        </div>
      )}

      {current && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button type="button" className="lightbox-close" onClick={close} aria-label="Bezárás">
            ×
          </button>
          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav prev"
              aria-label="Előző kép"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              ‹
            </button>
          )}
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <Image src={current.url} alt={current.alt} width={1600} height={1200} />
          </figure>
          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav next"
              aria-label="Következő kép"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

type Step = {
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    title: "Böngéssz a kutyák között",
    body: "Nézd meg a gazdira váró kutyáinkat, vagy indítsd el a gazdi–kutya összepárosítót, hogy megtaláld a hozzád illő társat.",
  },
  {
    title: "Jelentkezz nálunk",
    body: "Ha megfogott egy kutyus, jelezd felénk telefonon vagy e-mailben. Mesélj magadról és arról, milyen otthon vár rá.",
  },
  {
    title: "Ismerkedő beszélgetés",
    body: "Átbeszéljük az életviteledet, a napi ritmusodat és az elvárásaidat, hogy biztosan illő párost hozzunk össze.",
  },
  {
    title: "Személyes találkozó Baján",
    body: "Egyeztetett időpontban gyere el a menhelyre, és találkozz személyesen a kiszemelt kutyussal — sétáljatok, ismerkedjetek.",
  },
  {
    title: "Környezettanulmány",
    body: "Meggyőződünk róla, hogy az új otthon biztonságos és a kutya igényeinek megfelelő. Ez a kutyus és a te érdeked is.",
  },
  {
    title: "Örökbefogadási szerződés",
    body: "Aláírjuk az örökbefogadási szerződést, átadjuk az egészségügyi dokumentumokat, és megbeszéljük az első napok teendőit.",
  },
  {
    title: "Utánkövetés és támogatás",
    body: "Az örökbefogadás után sem engedjük el a kezed: kérdéseiddel, nehézségeiddel bármikor fordulhatsz hozzánk.",
  },
];

// A clean, symmetric dog paw print: four toe beans arced above a heel pad.
function Paw() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="26" cy="43" rx="8" ry="11" />
      <ellipse cx="42" cy="30" rx="8.5" ry="12" />
      <ellipse cx="58" cy="30" rx="8.5" ry="12" />
      <ellipse cx="74" cy="43" rx="8" ry="11" />
      <path d="M50 49c14 0 26 12 26 25 0 11-9 17-19 15-2-.4-3.5-1.5-7-1.5s-5 1.1-7 1.5c-10 2-19-4-19-15 0-13 12-25 26-25z" />
    </svg>
  );
}

export default function AdoptionSteps() {
  const containerRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = containerRef.current;
    const items = ol?.querySelectorAll(".journey-step");
    if (!ol || !items) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Without this class the steps render fully visible (no-JS / reduced-motion
    // fallback). Only opt into the hidden-then-reveal animation here.
    if (reduceMotion) return;
    ol.classList.add("is-animated");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <ol className="journey" ref={containerRef}>
      {steps.map((step, i) => (
        <li className="journey-step" key={step.title}>
          <div className="journey-marker">
            <span className="paw-print">
              <Paw />
            </span>
            <span className="paw-print">
              <Paw />
            </span>
          </div>
          <div className="journey-body">
            <span className="journey-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

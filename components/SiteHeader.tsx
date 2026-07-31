"use client";

import Link from "next/link";
import { useState } from "react";
import Waves from "./Waves";

const links = [
  { href: "/", label: "Főoldal" },
  { href: "/gazdira-varnak", label: "Gazdira várnak" },
  { href: "/osszeparosito", label: "Összepárosító" },
  { href: "/orokbefogadas", label: "Örökbefogadás" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Ugrás a tartalomhoz
      </a>
      <div className="nav-band">
        <header className="wrap nav">
          <Link className="brand" href="/" aria-label="Jeromos Egyesület főoldal" onClick={close}>
            {/* Bigger logo + title */}
            <img className="mark" src="/jeromos_logo.svg" alt="Jeromos Egyesület emblémája" />
            <img
              className="title"
              src="/jeromos_title.svg"
              alt="Jeromos Állatmentő és Természetvédő Egyesület"
            />
          </Link>

          <button
            type="button"
            className={`nav-toggle ${open ? "open" : ""}`}
            aria-label="Menü"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav-links ${open ? "open" : ""}`}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close}>
                {l.label}
              </Link>
            ))}
            <Link className="button solid" href="/segitseg" onClick={close}>
              Segítek
            </Link>
          </nav>
        </header>
      </div>

      <Waves />
    </>
  );
}

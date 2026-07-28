import Link from "next/link";
import Waves from "./Waves";

const links = [
  { href: "/gazdira-varnak", label: "Gazdira várnak" },
  { href: "/osszeparosito", label: "Összepárosító" },
  { href: "/orokbefogadas", label: "Örökbefogadás" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export default function SiteHeader() {
  return (
    <>
      <div className="nav-band">
        <header className="wrap nav">
          <Link className="brand" href="/" aria-label="Jeromos Egyesület főoldal">
            {/* Bigger logo + title */}
            <img className="mark" src="/jeromos_logo.svg" alt="Jeromos Egyesület emblémája" />
            <img
              className="title"
              src="/jeromos_title.svg"
              alt="Jeromos Állatmentő és Természetvédő Egyesület"
            />
          </Link>
          <nav className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <Link className="button solid" href="/segitseg">
              Segítek
            </Link>
          </nav>
        </header>
      </div>

      <Waves />
    </>
  );
}

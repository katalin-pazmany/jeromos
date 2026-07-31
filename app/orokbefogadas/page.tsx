import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import AdoptionSteps from "@/components/AdoptionSteps";

export const metadata: Metadata = {
  title: "Örökbefogadás | Jeromos Egyesület",
  description:
    "Így zajlik az örökbefogadás lépésről lépésre a Jeromos Egyesületnél: jelentkezés, ismerkedés, papírmunka és hazaköltözés — minden, amit tudnod kell, mielőtt otthont adnál egy kutyusnak.",
};

export default function Orokbefogadas() {
  return (
    <PageShell
      eyebrow="Hogyan működik"
      title="Örökbefogadás"
      lead="Az örökbefogadás felelősség és öröm egyben. Végigkísérünk az úton, hogy jó döntés szülessen — a kutya és a család számára is. Így néz ki a folyamat, lépésről lépésre:"
    >
      <AdoptionSteps />

      <section className="help-block" style={{ marginTop: 52 }}>
        <h2>Ha már megvan a kiszemelted</h2>
        <ul className="list">
          <li>
            Ha már van kiszemelted, akkor figyelmesen olvasd el a posztot róla,
            amiben pár fontos információ van vele kapcsolatosan. Gondold át
            alaposan, biztosan jó választás lennél-e számára, meg tudod-e adni
            neki azt a mozgásigényt, amit ő kíván!
          </li>
          <li>
            Küldj nekünk egy bemutatkozó levelet a{" "}
            <a href="mailto:jeromos.egyesulet@gmail.com">
              jeromos.egyesulet@gmail.com
            </a>{" "}
            e-mail címre, amiben részletesen leírod, ki a választottad, hogyan
            képzeled a közös jövőt vele, mennyi időt tudnátok együtt tölteni,
            merre laknátok, lenne-e kertje?
          </li>
          <li>
            Fontosak a képek számunkra, hogy könnyebb legyen a kutyus
            elhelyezésének döntése.
          </li>
          <li>
            Miután megkaptuk a levelet, megírjuk neked, hogy a kutyussal hol és
            mikor tudsz találkozni.
          </li>
          <li>
            Amennyiben Te leszel a gazdink, a jövőben is fogjuk Veletek tartani a
            kapcsolatot.
          </li>
        </ul>
      </section>

      <div
        className="notice"
        style={{
          marginTop: 44,
          padding: 25,
          borderLeft: "5px solid var(--green)",
          background: "var(--fog)",
          borderRadius: "0 14px 14px 0",
          color: "var(--copy)",
        }}
      >
        Az örökbefogadás előtt minden esetben személyes találkozót és beszélgetést
        kérünk. Kérlek, érkezés előtt telefonálj: <b>+36 20 374 6775</b>.
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="button solid" href="/jelentkezes">
          Jelentkezem örökbefogadásra
        </Link>
        <Link className="button" href="/gazdira-varnak">
          Nézd meg a kutyákat
        </Link>
        <Link className="button" href="/osszeparosito">
          Indítsd az összepárosítót
        </Link>
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Tanácsok | Jeromos Egyesület" };

const tips = [
  { h: "Az első napok", p: "Adj időt és nyugalmat: az új kutyának napokra lehet szüksége, hogy otthon érezze magát." },
  { h: "Türelmes szoktatás", p: "A napirend, a séták és a következetesség segít a bizalom kiépítésében." },
  { h: "Egészség", p: "Az örökbefogadás után is számíts állatorvosi ellenőrzésre és rendszeres oltásokra." },
  { h: "Ivartalanítás", p: "Felelős állattartóként támogatjuk az ivartalanítást — kérdezz minket bátran." },
];

export default function Tanacsok() {
  return (
    <PageShell
      eyebrow="Hasznos tudnivalók"
      title="Tanácsok"
      lead="Gyakorlati segítség leendő és friss gazdiknak, hogy a közös kezdet zökkenőmentes legyen."
    >
      <ul className="list">
        {tips.map((t) => (
          <li key={t.h} style={{ borderBottom: "1px solid var(--line)", padding: "14px 0" }}>
            <b style={{ fontFamily: "Fraunces, serif", fontSize: 19 }}>{t.h}</b>
            <div style={{ color: "var(--copy)", fontWeight: 400 }}>{t.p}</div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

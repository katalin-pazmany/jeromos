import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import DogFilters from "@/components/DogFilters";
import { getAllDogs } from "@/lib/dogs-store";

export const metadata: Metadata = {
  title: "Gazdira várnak | Jeromos Egyesület",
  description:
    "Ismerd meg a Jeromos Egyesület gazdira váró kutyáit: szűrj méret, energiaszint, kor és nem szerint, és találd meg azt, aki tökéletesen illik hozzád.",
};

export const dynamic = "force-dynamic";

export default async function GazdiraVarnak() {
  const dogs = await getAllDogs();
  return (
    <PageShell
      eyebrow="Örökbefogadás"
      title="Gazdira várnak"
      lead="Ismerd meg mentett kutyáinkat. Kattints bármelyikre a részletes profilért — talán épp közöttük van a te új társad."
    >
      <p style={{ textAlign: "center", marginBottom: 36 }}>
        <Link className="button solid" href="/osszeparosito">
          Nem tudod, melyik illik hozzád? Indítsd az összepárosítót →
        </Link>
      </p>

      <DogFilters dogs={dogs} />
    </PageShell>
  );
}

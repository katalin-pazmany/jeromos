import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import DogCard from "@/components/DogCard";
import { getAllDogs } from "@/lib/dogs-store";

export const metadata: Metadata = {
  title: "Gazdira várnak | Jeromos Egyesület",
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
      <div className="cards">
        {dogs.map((dog) => (
          <DogCard key={dog.slug} dog={dog} />
        ))}
      </div>

      <p style={{ marginTop: 40, textAlign: "center" }}>
        <Link className="button solid" href="/osszeparosito">
          Nem tudod, melyik illik hozzád? Indítsd az összepárosítót →
        </Link>
      </p>
    </PageShell>
  );
}

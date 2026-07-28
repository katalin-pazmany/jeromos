import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ApplicationForm from "@/components/ApplicationForm";
import { getAllDogs } from "@/lib/dogs-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jelentkezés örökbefogadásra | Jeromos Egyesület",
  description:
    "Töltsd ki az örökbefogadási jelentkezést, és vedd fel velünk a kapcsolatot.",
};

export default async function Jelentkezes({
  searchParams,
}: {
  searchParams: Promise<{ kutya?: string }>;
}) {
  const dogs = await getAllDogs();
  const { kutya } = await searchParams;

  return (
    <PageShell
      eyebrow="Örökbefogadás"
      title="Jelentkezés örökbefogadásra"
      lead="Töltsd ki az alábbi űrlapot, és elküldjük a jelentkezésed az egyesületnek. Igyekszünk minél hamarabb válaszolni!"
    >
      <ApplicationForm
        dogs={dogs.map((d) => ({
          slug: d.slug,
          name: d.name,
          image: d.image,
          traits: d.traits,
        }))}
        preselect={kutya || ""}
      />
    </PageShell>
  );
}

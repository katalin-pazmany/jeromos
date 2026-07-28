import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Matcher from "@/components/Matcher";
import { getAllDogs } from "@/lib/dogs-store";

export const metadata: Metadata = {
  title: "Gazdi–kutya összepárosító | Jeromos Egyesület",
  description:
    "Válaszolj néhány kérdésre, és megmutatjuk, melyik mentett kutyánk illik hozzád a leginkább.",
};

export const dynamic = "force-dynamic";

export default async function Osszeparosito() {
  const dogs = await getAllDogs();
  return (
    <PageShell
      eyebrow="Találd meg a párod"
      title="Gazdi–kutya összepárosító"
      lead="Néhány kérdés a te életedről és otthonodról — mi pedig megmutatjuk, melyik mentett kutyánk illik hozzád a leginkább."
    >
      <Matcher dogs={dogs} />
    </PageShell>
  );
}

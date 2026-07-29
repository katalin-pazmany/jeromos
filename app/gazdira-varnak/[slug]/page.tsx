import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getDogBySlug } from "@/lib/dogs-store";
import { formatAge, type GoodWith } from "@/data/dogs";

export const dynamic = "force-dynamic";

// No generateStaticParams: the dog list changes at runtime via the admin
// panel, so there's nothing meaningful to precompute at build time. Every
// slug renders on demand instead (dynamicParams defaults to true).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dog = await getDogBySlug(slug);
  if (!dog) return { title: "Kutya | Jeromos Egyesület" };
  return {
    title: `${dog.name} | Jeromos Egyesület`,
    description: dog.tagline,
  };
}

function goodWithLabel(value: boolean | null): string {
  if (value === true) return "Igen";
  if (value === false) return "Nem";
  return "Még ismeretlen";
}

const goodWithRows: { key: keyof GoodWith; label: string }[] = [
  { key: "gyerek", label: "Gyerekekkel" },
  { key: "kutya", label: "Kutyákkal" },
  { key: "macska", label: "Macskákkal" },
];

export default async function DogProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dog = await getDogBySlug(slug);
  if (!dog) notFound();

  return (
    <>
      <SiteHeader />

      <main className="content wrap">
        <Link className="text-link" href="/gazdira-varnak">
          ← Vissza a kutyákhoz
        </Link>

        <div className="dog-profile">
          <div className="dog-profile-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dog.image} alt={dog.photoAlt} />
            <span className="tag dog-profile-status">{dog.status}</span>
          </div>

          <div className="dog-profile-body">
            <div className="kicker">{dog.breed}</div>
            <h1 className="dog-profile-name">{dog.name}</h1>
            <p className="dog-profile-tagline">{dog.tagline}</p>

            <div className="dog-specs">
              <div className="spec">
                <span>Kor</span>
                <b>{formatAge(dog.ageYears)}</b>
              </div>
              <div className="spec">
                <span>Nem</span>
                <b>{dog.sex}</b>
              </div>
              <div className="spec">
                <span>Méret</span>
                <b>{dog.size}</b>
              </div>
              <div className="spec">
                <span>Energia</span>
                <b>{dog.energy}</b>
              </div>
            </div>

            <div className="dog-traits">
              {dog.traits.map((t) => (
                <span className="trait-chip" key={t}>
                  {t}
                </span>
              ))}
            </div>

            <p className="dog-story">{dog.story}</p>

            <div className="dog-goodwith">
              <b>Összefér</b>
              <div className="goodwith-grid">
                {goodWithRows.map((row) => {
                  const value = dog.goodWith[row.key];
                  const cls =
                    value === true ? "yes" : value === false ? "no" : "maybe";
                  return (
                    <div className={`goodwith ${cls}`} key={row.key}>
                      <span>{row.label}</span>
                      <b>{goodWithLabel(value)}</b>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dog-cta">
              <Link className="button solid" href={`/jelentkezes?kutya=${dog.slug}`}>
                Jelentkezem {dog.name} felől
              </Link>
              <Link className="button" href="/orokbefogadas">
                Örökbefogadás menete
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

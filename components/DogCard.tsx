import Link from "next/link";
import { formatAge, type Dog } from "@/data/dogs";

export default function DogCard({ dog }: { dog: Dog }) {
  return (
    <Link className="dog-card" href={`/gazdira-varnak/${dog.slug}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dog.image} alt={dog.photoAlt} />
      <div className="dog-info">
        <div className="dog-info-top">
          <span className="dog-name">{dog.name}</span>
          <span className="tag">{dog.status}</span>
        </div>
        <p className="dog-meta">
          {formatAge(dog.ageYears)} · {dog.sex} · {dog.size} · {dog.energy}
        </p>
        <p className="dog-tagline">{dog.tagline}</p>
      </div>
    </Link>
  );
}

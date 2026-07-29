"use client";

import { useMemo, useState } from "react";
import DogCard from "@/components/DogCard";
import type { Dog, Size, Energy, Sex, AgeGroup } from "@/data/dogs";

type Pref<T> = T | "mindegy";

type Option<T> = { value: T; label: string };

const sizeOptions: Option<Pref<Size>>[] = [
  { value: "mindegy", label: "Mindegy" },
  { value: "kicsi", label: "Kicsi" },
  { value: "közepes", label: "Közepes" },
  { value: "nagy", label: "Nagy" },
];

const energyOptions: Option<Pref<Energy>>[] = [
  { value: "mindegy", label: "Mindegy" },
  { value: "nyugodt", label: "Nyugodt" },
  { value: "kiegyensúlyozott", label: "Kiegyensúlyozott" },
  { value: "energikus", label: "Energikus" },
];

const ageOptions: Option<Pref<AgeGroup>>[] = [
  { value: "mindegy", label: "Mindegy" },
  { value: "kölyök", label: "Kölyök" },
  { value: "fiatal", label: "Fiatal" },
  { value: "felnőtt", label: "Felnőtt" },
  { value: "idős", label: "Idős" },
];

const sexOptions: Option<Pref<Sex>>[] = [
  { value: "mindegy", label: "Mindegy" },
  { value: "kan", label: "Kan" },
  { value: "szuka", label: "Szuka" },
];

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<Pref<T>>[];
  value: Pref<T>;
  onChange: (v: Pref<T>) => void;
}) {
  return (
    <div className="filter-row">
      <span className="filter-label">{label}</span>
      <div className="options">
        {options.map((o) => (
          <button
            type="button"
            key={o.value}
            className={`option ${value === o.value ? "selected" : ""}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DogFilters({ dogs }: { dogs: Dog[] }) {
  const [size, setSize] = useState<Pref<Size>>("mindegy");
  const [energy, setEnergy] = useState<Pref<Energy>>("mindegy");
  const [ageGroup, setAgeGroup] = useState<Pref<AgeGroup>>("mindegy");
  const [sex, setSex] = useState<Pref<Sex>>("mindegy");

  const filtered = useMemo(
    () =>
      dogs.filter(
        (d) =>
          (size === "mindegy" || d.size === size) &&
          (energy === "mindegy" || d.energy === energy) &&
          (ageGroup === "mindegy" || d.ageGroup === ageGroup) &&
          (sex === "mindegy" || d.sex === sex)
      ),
    [dogs, size, energy, ageGroup, sex]
  );

  const anyFilterActive =
    size !== "mindegy" || energy !== "mindegy" || ageGroup !== "mindegy" || sex !== "mindegy";

  return (
    <div>
      <div className="dog-filters">
        <FilterRow label="Méret" options={sizeOptions} value={size} onChange={setSize} />
        <FilterRow label="Energia" options={energyOptions} value={energy} onChange={setEnergy} />
        <FilterRow label="Kor" options={ageOptions} value={ageGroup} onChange={setAgeGroup} />
        <FilterRow label="Nem" options={sexOptions} value={sex} onChange={setSex} />
      </div>

      <p className="filter-count">
        {filtered.length} kutya {anyFilterActive ? "felel meg a szűrésnek" : "vár gazdira"}
      </p>

      {filtered.length > 0 ? (
        <div className="cards">
          {filtered.map((dog) => (
            <DogCard key={dog.slug} dog={dog} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--copy)" }}>
          Ezekkel a szűrőkkel most nincs találat — próbálj tágabb feltételeket.
        </p>
      )}
    </div>
  );
}

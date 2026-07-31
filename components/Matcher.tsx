"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  defaultPrefs,
  matchDogs,
  AGE_MIN,
  AGE_MAX,
  type MatchPrefs,
  type MatchResult,
} from "@/lib/match";
import type { Dog } from "@/data/dogs";

// Matches below this score are hidden from the recommended list.
const MATCH_THRESHOLD = 40;

type Option<T> = { value: T; label: string };

const sizeOptions: Option<MatchPrefs["size"]>[] = [
  { value: "kicsi", label: "Kicsi" },
  { value: "közepes", label: "Közepes" },
  { value: "nagy", label: "Nagy" },
  { value: "mindegy", label: "Mindegy" },
];

const energyOptions: Option<MatchPrefs["energy"]>[] = [
  { value: "nyugodt", label: "Nyugodt" },
  { value: "kiegyensúlyozott", label: "Kiegyensúlyozott" },
  { value: "energikus", label: "Energikus" },
  { value: "mindegy", label: "Mindegy" },
];

const yesNo: Option<boolean>[] = [
  { value: true, label: "Igen" },
  { value: false, label: "Nem" },
];

function ageText(years: number): string {
  return years <= 0 ? "kölyök" : `${years} év`;
}

// Dual-thumb age range slider: a line with two dots for the min and max age.
function AgeRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (lo: number, hi: number) => void;
}) {
  const span = AGE_MAX - AGE_MIN;
  const loPct = ((min - AGE_MIN) / span) * 100;
  const hiPct = ((max - AGE_MIN) / span) * 100;
  const fullRange = min === AGE_MIN && max === AGE_MAX;

  return (
    <div className="q-block">
      <div className="q-title">Milyen idős kutyát keresel?</div>
      <div className="range-value">
        {fullRange ? (
          <span>Bármelyik kor megfelel</span>
        ) : (
          <span>
            {ageText(min)} – {max >= AGE_MAX ? `${AGE_MAX}+ év` : ageText(max)}
          </span>
        )}
      </div>
      <div className="range">
        <div className="range-track" />
        <div
          className="range-fill"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          className="range-input"
          min={AGE_MIN}
          max={AGE_MAX}
          value={min}
          aria-label="Minimum életkor"
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
        />
        <input
          type="range"
          className="range-input"
          min={AGE_MIN}
          max={AGE_MAX}
          value={max}
          aria-label="Maximum életkor"
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
        />
      </div>
      <div className="range-scale">
        <span>{AGE_MIN}</span>
        <span>{AGE_MAX}+ év</span>
      </div>
    </div>
  );
}

function OptionRow<T extends string | boolean>({
  title,
  hint,
  options,
  value,
  onChange,
}: {
  title: string;
  hint?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="q-block">
      <div className="q-title">{title}</div>
      {hint && <div className="q-hint">{hint}</div>}
      <div className="options">
        {options.map((o) => (
          <button
            type="button"
            key={String(o.value)}
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

function ResultCard({ result }: { result: MatchResult }) {
  const { dog, score, reasons, warnings } = result;
  return (
    <Link className="dog-card match-card" href={`/gazdira-varnak/${dog.slug}`}>
      <div className="match-photo">
        <Image
          src={dog.image}
          alt={dog.photoAlt}
          width={400}
          height={230}
          sizes="(max-width: 720px) 100vw, 33vw"
        />
        <span className="match-badge">{score}% egyezés</span>
      </div>
      <div className="dog-info">
        <div className="dog-info-top">
          <span className="dog-name">{dog.name}</span>
        </div>
        <p className="dog-meta">
          {dog.ageGroup} · {dog.sex} · {dog.size} · {dog.energy}
        </p>
        {reasons.length > 0 && (
          <div className="match-reasons">
            {reasons.slice(0, 3).map((r) => (
              <span className="reason-chip" key={r}>
                ✓ {r}
              </span>
            ))}
          </div>
        )}
        {warnings.length > 0 && (
          <div className="match-cons">
            {warnings.map((w) => (
              <span className="con-chip" key={w}>
                ✕ {w}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Matcher({ dogs }: { dogs: Dog[] }) {
  const [prefs, setPrefs] = useState<MatchPrefs>(defaultPrefs);
  const [submitted, setSubmitted] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => matchDogs(prefs, dogs), [prefs, dogs]);
  const recommended = results.filter(
    (r) => !r.disqualified && r.score >= MATCH_THRESHOLD
  );
  const notRecommended = results.filter((r) => r.disqualified);

  function set<K extends keyof MatchPrefs>(key: K, value: MatchPrefs[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  function showResults() {
    setSubmitted(true);
    // let the results render, then scroll
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function reset() {
    setPrefs(defaultPrefs);
    setSubmitted(false);
  }

  return (
    <div className="matcher">
      <div className="matcher-form">
        <OptionRow
          title="Milyen méretű kutyát keresel?"
          options={sizeOptions}
          value={prefs.size}
          onChange={(v) => set("size", v)}
        />
        <OptionRow
          title="Milyen tempó illik hozzád?"
          hint="Mennyi mozgást, sétát tudsz biztosítani?"
          options={energyOptions}
          value={prefs.energy}
          onChange={(v) => set("energy", v)}
        />
        <AgeRange
          min={prefs.ageMin}
          max={prefs.ageMax}
          onChange={(lo, hi) => setPrefs((p) => ({ ...p, ageMin: lo, ageMax: hi }))}
        />
        <OptionRow
          title="Élnek gyerekek a háztartásban?"
          options={yesNo}
          value={prefs.hasKids}
          onChange={(v) => set("hasKids", v)}
        />
        <OptionRow
          title="Van már otthon kutyád?"
          options={yesNo}
          value={prefs.hasDogs}
          onChange={(v) => set("hasDogs", v)}
        />
        <OptionRow
          title="Van otthon macskád?"
          options={yesNo}
          value={prefs.hasCats}
          onChange={(v) => set("hasCats", v)}
        />

        <div className="matcher-actions">
          <button type="button" className="button solid" onClick={showResults}>
            Mutasd a találataimat
          </button>
          {submitted && (
            <button type="button" className="button" onClick={reset}>
              Kezdd újra
            </button>
          )}
        </div>
      </div>

      {submitted && (
        <div className="match-results" ref={resultsRef}>
          <h2>
            {recommended.length > 0
              ? "Íme a hozzád illő kutyák"
              : "Sajnos most nincs tökéletes találat"}
          </h2>
          <p className="match-results-lead">
            {recommended.length > 0
              ? "A leginkább illő kutyusok elöl. Kattints bármelyikre a részletes profilért!"
              : "Próbáld lazítani a szűrőket — vagy vedd fel velünk a kapcsolatot, és segítünk személyesen!"}
          </p>

          {recommended.length > 0 && (
            <div className="cards">
              {recommended.map((r) => (
                <ResultCard key={r.dog.slug} result={r} />
              ))}
            </div>
          )}

          {notRecommended.length > 0 && (
            <div className="match-excluded">
              <b>Most nem ajánljuk ezeket ({notRecommended.length})</b>
              <p>
                A megadott háztartás (gyerek / másik kutya / macska) alapján ezek
                a kutyák jelenleg nem ideálisak — de a helyzet gyakran a személyes
                találkozón dől el.
              </p>
              <div className="excluded-list">
                {notRecommended.map((r) => (
                  <Link
                    key={r.dog.slug}
                    href={`/gazdira-varnak/${r.dog.slug}`}
                    className="excluded-chip"
                  >
                    {r.dog.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

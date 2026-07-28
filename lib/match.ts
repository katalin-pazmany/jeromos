// ---------------------------------------------------------------------------
// Owner–dog matching logic (pure, framework-agnostic).
//
// Given a visitor's preferences, each dog gets a 0–100 match score plus
// human-readable reasons and warnings. Hard incompatibilities (e.g. a
// cat-aggressive dog for a cat household) disqualify the dog from the
// recommended list rather than just lowering its score.
// ---------------------------------------------------------------------------

import { type Dog, type Size, type Energy } from "@/data/dogs";

export type Pref<T> = T | "mindegy";

// Age range (years) the matcher slider spans. The full range means "no age
// preference"; any narrower selection filters/scores on the dog's exact age.
export const AGE_MIN = 0;
export const AGE_MAX = 15;

export interface MatchPrefs {
  size: Pref<Size>;
  energy: Pref<Energy>;
  ageMin: number;
  ageMax: number;
  hasKids: boolean;
  hasDogs: boolean;
  hasCats: boolean;
}

export const defaultPrefs: MatchPrefs = {
  size: "mindegy",
  energy: "mindegy",
  ageMin: AGE_MIN,
  ageMax: AGE_MAX,
  hasKids: false,
  hasDogs: false,
  hasCats: false,
};

export interface MatchResult {
  dog: Dog;
  score: number; // 0..100
  reasons: string[];
  warnings: string[];
  disqualified: boolean;
}

const energyOrder: Record<Energy, number> = {
  nyugodt: 0,
  kiegyensúlyozott: 1,
  energikus: 2,
};
const sizeOrder: Record<Size, number> = { kicsi: 0, közepes: 1, nagy: 2 };

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ageLabel(years: number): string {
  return years <= 0 ? "kölyök" : `${years} éves`;
}

function scoreDog(dog: Dog, prefs: MatchPrefs): MatchResult {
  let achieved = 0;
  let max = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];
  let disqualified = false;

  // --- Size preference (weight 2) ---
  if (prefs.size !== "mindegy") {
    max += 2;
    const diff = Math.abs(sizeOrder[dog.size] - sizeOrder[prefs.size]);
    if (diff === 0) {
      achieved += 2;
      reasons.push(`${cap(dog.size)} méret, ahogy kérted`);
    } else {
      if (diff === 1) achieved += 1;
      warnings.push(`Eltér a kért mérettől (${dog.size})`);
    }
  }

  // --- Energy preference (weight 2) ---
  if (prefs.energy !== "mindegy") {
    max += 2;
    const diff = Math.abs(energyOrder[dog.energy] - energyOrder[prefs.energy]);
    if (diff === 0) {
      achieved += 2;
      reasons.push(`${cap(dog.energy)} temperamentum`);
    } else {
      if (diff === 1) achieved += 1;
      warnings.push(`Eltér a kért tempótól (${dog.energy})`);
    }
  }

  // --- Age range preference (weight 1.5) ---
  // Only counts when the visitor narrowed the range from the full span.
  if (prefs.ageMin > AGE_MIN || prefs.ageMax < AGE_MAX) {
    max += 1.5;
    const a = dog.ageYears;
    if (a >= prefs.ageMin && a <= prefs.ageMax) {
      achieved += 1.5;
      reasons.push(`${ageLabel(a)} — a kívánt korban`);
    } else {
      const dist = a < prefs.ageMin ? prefs.ageMin - a : a - prefs.ageMax;
      if (dist <= 1) achieved += 0.75;
      warnings.push(`Kora eltér a tartománytól (${ageLabel(a)})`);
    }
  }

  // --- Household: children (weight 2, can disqualify) ---
  if (prefs.hasKids) {
    max += 2;
    const g = dog.goodWith.gyerek;
    if (g === true) {
      achieved += 2;
      reasons.push("Jól kijön gyerekekkel");
    } else if (g === null) {
      achieved += 0.7;
      warnings.push("Gyerekekkel való összeférése még ismeretlen");
    } else {
      disqualified = true;
      warnings.push("Nem ajánlott gyerekes háztartásba");
    }
  }

  // --- Household: other dogs (weight 1.5, can disqualify) ---
  if (prefs.hasDogs) {
    max += 1.5;
    const k = dog.goodWith.kutya;
    if (k === true) {
      achieved += 1.5;
      reasons.push("Elfogadja a kutyatársakat");
    } else if (k === null) {
      achieved += 0.5;
      warnings.push("Kutyatársakkal való összeférése ismeretlen");
    } else {
      disqualified = true;
      warnings.push("Nem ajánlott másik kutya mellé");
    }
  }

  // --- Household: cats (weight 1.5, can disqualify) ---
  if (prefs.hasCats) {
    max += 1.5;
    const c = dog.goodWith.macska;
    if (c === true) {
      achieved += 1.5;
      reasons.push("Macskabarát");
    } else if (c === null) {
      achieved += 0.5;
      warnings.push("Macskákkal való összeférése ismeretlen");
    } else {
      disqualified = true;
      warnings.push("Nem ajánlott macska mellé");
    }
  }

  const score = max === 0 ? 100 : Math.round((achieved / max) * 100);
  return { dog, score, reasons, warnings, disqualified };
}

/** Score and rank every dog. Disqualified dogs sort last. */
export function matchDogs(prefs: MatchPrefs, list: Dog[]): MatchResult[] {
  return list
    .map((d) => scoreDog(d, prefs))
    .sort((a, b) => {
      if (a.disqualified !== b.disqualified) return a.disqualified ? 1 : -1;
      return b.score - a.score;
    });
}

// ---------------------------------------------------------------------------
// Dog data model for Jeromos Egyesület.
//
// The fields here are deliberately structured so the future "gazdi–kutya
// összepárosító" (owner–dog matcher) form can filter and score directly on
// them: size, energy, sex, ageGroup and the goodWith flags are all enumerated.
//
// NOTE: names, ages and temperaments below are editable placeholders derived
// from the photos — replace them with the shelter's real records.
// ---------------------------------------------------------------------------

export type Size = "kicsi" | "közepes" | "nagy";
export type Energy = "nyugodt" | "kiegyensúlyozott" | "energikus";
export type Sex = "kan" | "szuka" | "vegyes" | "ismeretlen";
export type AgeGroup = "kölyök" | "fiatal" | "felnőtt" | "idős";
export type Status = "gazdit keres" | "ideiglenesen befogadva";

/** Whether the dog gets on with a given companion. `null` = not yet known. */
export type GoodWith = {
  gyerek: boolean | null; // children
  kutya: boolean | null; // other dogs
  macska: boolean | null; // cats
};

/** Human-readable exact age, e.g. "kölyök", "1 éves", "3 éves". */
export function formatAge(years: number): string {
  if (years <= 0) return "kölyök";
  return `${years} éves`;
}

export interface Dog {
  slug: string;
  name: string;
  image: string;
  photoAlt: string;
  sex: Sex;
  /** Approximate age in years (0 for young puppies). Handy for range filters. */
  ageYears: number;
  ageGroup: AgeGroup;
  size: Size;
  energy: Energy;
  breed: string;
  /** Free-form Hungarian trait tags the matcher can weight, e.g. "barátságos". */
  traits: string[];
  goodWith: GoodWith;
  status: Status;
  /** Short one-liner for cards. */
  tagline: string;
  /** Longer profile description. */
  story: string;
}

// Seed data. On first run the store copies this into data/dogs.json, which then
// becomes the live, editable source of truth (see lib/dogs-store.ts).
export const seedDogs: Dog[] = [
  {
    slug: "zorro",
    name: "Zorró",
    image: "/dogs/zorro.jpg",
    photoAlt: "Zorró, cirmos-fehér staffordshire keverék, egyik füle felálló",
    sex: "kan",
    ageYears: 3,
    ageGroup: "felnőtt",
    size: "közepes",
    energy: "energikus",
    breed: "staffordshire keverék",
    traits: ["barátságos", "játékos", "okos", "emberközpontú"],
    goodWith: { gyerek: true, kutya: true, macska: false },
    status: "gazdit keres",
    tagline: "Örökmozgó, ölelnivaló csibész.",
    story:
      "Zorró egy örökmozgó, roppant barátságos fiú, akit a mozgás és a játék éltet. Imádja az embereket, gyorsan tanul, és egy aktív családban, ahol sokat sétálnak és játszanak vele, igazán kivirul. A kutyatársakat kedveli, macskákhoz nem szoktatott.",
  },
  {
    slug: "bori",
    name: "Bori",
    image: "/dogs/bori.jpg",
    photoAlt: "Bori, nagytestű, bozontos, drapp-fekete pásztorkutya keverék",
    sex: "szuka",
    ageYears: 2,
    ageGroup: "fiatal",
    size: "nagy",
    energy: "kiegyensúlyozott",
    breed: "pásztorkutya keverék",
    traits: ["gyengéd", "hűséges", "óvó", "nyugodt otthon"],
    goodWith: { gyerek: true, kutya: true, macska: null },
    status: "gazdit keres",
    tagline: "Bozontos nagylány, hatalmas szívvel.",
    story:
      "Bori egy fiatal, nagytestű bozontos szépség, akiből árad a gyengédség. Kiegyensúlyozott természetű, a családjához hűséges és óvó. Kertes házat és türelmes gazdit keres, aki mellett igazi társsá válhat. Kutyatársakkal jól kijön.",
  },
  {
    slug: "rex",
    name: "Rex",
    image: "/dogs/rex.jpg",
    photoAlt: "Rex, fekete-barna németjuhász keverék, felálló fülekkel, hóban",
    sex: "kan",
    ageYears: 5,
    ageGroup: "felnőtt",
    size: "nagy",
    energy: "kiegyensúlyozott",
    breed: "németjuhász keverék",
    traits: ["hűséges", "okos", "éber", "tanulékony"],
    goodWith: { gyerek: true, kutya: true, macska: false },
    status: "gazdit keres",
    tagline: "Hűséges őrző-védő, okos fejjel.",
    story:
      "Rex egy értelmes, hűséges németjuhász keverék, aki gyorsan tanul és imád feladatokat kapni. Éber, ezért kiváló házőrző, ugyanakkor a családja mellett szelíd és ragaszkodó. Olyan gazdit keres, aki foglalkozik vele és mozgatja a fejét is.",
  },
  {
    slug: "dio",
    name: "Dió",
    image: "/dogs/dio.jpg",
    photoAlt: "Dió, cirmos-barna staffordshire keverék, mosolygós arccal",
    sex: "kan",
    ageYears: 4,
    ageGroup: "felnőtt",
    size: "közepes",
    energy: "energikus",
    breed: "staffordshire keverék",
    traits: ["vidám", "emberbarát", "aktív", "ragaszkodó"],
    goodWith: { gyerek: true, kutya: null, macska: false },
    status: "gazdit keres",
    tagline: "A mosolygós, napsugár természet.",
    story:
      "Dió a jókedv megtestesítője: állandóan mosolyog, és mindenkit a szívébe zár. Energikus, szeret mozogni, sétálni, játszani. Emberbarát, ragaszkodó fiú, aki egy aktív gazdi mellett lesz igazán boldog. A kutyatársakhoz óvatos bemutatást kérünk.",
  },
  {
    slug: "zsemle",
    name: "Zsemle",
    image: "/dogs/zsemle.jpg",
    photoAlt: "Zsemle, nagytestű, vörös-drapp molosszer keverék",
    sex: "kan",
    ageYears: 3,
    ageGroup: "felnőtt",
    size: "nagy",
    energy: "nyugodt",
    breed: "molosszer keverék",
    traits: ["higgadt", "ragaszkodó", "gyengéd óriás", "kiegyensúlyozott"],
    goodWith: { gyerek: true, kutya: true, macska: null },
    status: "gazdit keres",
    tagline: "Nyugodt, gyengéd óriás.",
    story:
      "Zsemle egy tenyérbemászó, nagytestű, mégis rendkívül nyugodt fiú. Higgadt természete miatt ideális társ lehet olyanoknak is, akik egy kiegyensúlyozott, komótos kutyát keresnek. Ragaszkodó és gyengéd, imád a gazdi lábánál pihenni.",
  },
  {
    slug: "fulop",
    name: "Fülöp",
    image: "/dogs/fulop.jpg",
    photoAlt: "Fülöp, fehér, barna fülű fiatal keverék kutya, kilógó nyelvvel",
    sex: "kan",
    ageYears: 1,
    ageGroup: "fiatal",
    size: "közepes",
    energy: "energikus",
    breed: "keverék",
    traits: ["játékos", "tanulékony", "barátságos", "kíváncsi"],
    goodWith: { gyerek: true, kutya: true, macska: null },
    status: "gazdit keres",
    tagline: "Fiatal, tanulni vágyó jókedv.",
    story:
      "Fülöp egy vidám, fiatal fiú, tele energiával és tanulási vággyal. Kíváncsi, barátságos, és imádja a közös programokat. Egy türelmes, aktív gazdi mellett, aki elkezdi vele a kiképzés alapjait, csodálatos társ válik belőle. Kutyatársakkal játékos.",
  },
  {
    slug: "mate",
    name: "Máté",
    image: "/dogs/mate.jpg",
    photoAlt: "Máté, drapp-arany labrador keverék, lógó fülekkel",
    sex: "kan",
    ageYears: 4,
    ageGroup: "felnőtt",
    size: "nagy",
    energy: "kiegyensúlyozott",
    breed: "labrador keverék",
    traits: ["szelíd", "kedves", "társaságkedvelő", "gyerekbarát"],
    goodWith: { gyerek: true, kutya: true, macska: true },
    status: "gazdit keres",
    tagline: "A tökéletes családi társ.",
    story:
      "Máté egy szelíd, kedves labrador keverék, aki minden élőlényt a szívébe zár. Gyerekekkel, kutyákkal, sőt macskákkal is jól kijön, így ideális választás családoknak. Kiegyensúlyozott, könnyen kezelhető fiú, aki csak szeretetre és egy meleg otthonra vágyik.",
  },
  {
    slug: "farkas",
    name: "Farkas",
    image: "/dogs/farkas.jpg",
    photoAlt: "Farkas, idős németjuhász, őszülő pofával, erdőben egy fatörzsön",
    sex: "kan",
    ageYears: 9,
    ageGroup: "idős",
    size: "nagy",
    energy: "nyugodt",
    breed: "németjuhász",
    traits: ["bölcs", "higgadt", "hűséges", "hálás"],
    goodWith: { gyerek: true, kutya: true, macska: false },
    status: "gazdit keres",
    tagline: "Bölcs szenior, csendes otthonra vágyik.",
    story:
      "Farkas egy őszülő pofájú, bölcs szenior, aki életének hátralévő éveit egy csendes, szerető otthonban szeretné leélni. Higgadt és hálás minden simogatásért. A nyugodtabb tempójú séták a kedvencei. Adjunk esélyt az idősebbeknek is — Farkas hűséggel hálálja meg.",
  },
  {
    slug: "bogyo",
    name: "Bogyó",
    image: "/dogs/bogyo.jpg",
    photoAlt: "Bogyó, fekete-barna-fehér foltos keverék, közeli portré",
    sex: "szuka",
    ageYears: 3,
    ageGroup: "felnőtt",
    size: "közepes",
    energy: "kiegyensúlyozott",
    breed: "keverék",
    traits: ["figyelmes", "ragaszkodó", "érzékeny", "hűséges"],
    goodWith: { gyerek: true, kutya: true, macska: null },
    status: "gazdit keres",
    tagline: "Figyelmes, ragaszkodó lány.",
    story:
      "Bogyó egy érzékeny, figyelmes szuka, aki mély kötődésre képes a gazdijával. Kicsit tartózkodó az elején, de ha megnyílik, hűséges és ragaszkodó társ lesz. Egy türelmes otthonban, ahol időt adnak neki a bizalom kiépítésére, csodásan kivirul.",
  },
  {
    slug: "bogancs-alom",
    name: "A Bogáncs-alom",
    image: "/dogs/bogancs-alom.jpg",
    photoAlt: "Hat merle-foltos kölyökkutya egy kutyaágyban",
    sex: "vegyes",
    ageYears: 0,
    ageGroup: "kölyök",
    size: "közepes",
    energy: "energikus",
    breed: "keverék",
    traits: ["játékos", "tanulékony", "szocializálódó", "cuki"],
    goodWith: { gyerek: true, kutya: true, macska: null },
    status: "gazdit keres",
    tagline: "Hat pöttyös kiskutya keresi a gazdiját.",
    story:
      "A Bogáncs-alom hat egészséges, játékos kölyökből áll, akik most ismerkednek a világgal. Kutyatársaikkal együtt szocializálódnak, tanulékonyak és végtelenül cukik. Felnőttként várhatóan közepes termetűek lesznek. Előjegyzést és felelős gazdikat keresünk számukra.",
  },
  {
    slug: "nefelejcs-alom",
    name: "A Nefelejcs-alom",
    image: "/dogs/nefelejcs-alom.jpg",
    photoAlt: "Három játszó kölyökkutya: fekete-fehér foltos, fekete és barna",
    sex: "vegyes",
    ageYears: 0,
    ageGroup: "kölyök",
    size: "közepes",
    energy: "energikus",
    breed: "keverék",
    traits: ["játékos", "vidám", "szocializálódó", "kíváncsi"],
    goodWith: { gyerek: true, kutya: true, macska: null },
    status: "gazdit keres",
    tagline: "Vidám kölyökcsapat, ölelésre készen.",
    story:
      "A Nefelejcs-alom apróságai egymással hancúrozva töltik a napjaikat. Vidámak, kíváncsiak és nyitottak minden újra. Egy kölyök rengeteg türelmet és időt igényel, cserébe egy életre szóló barátságot ad. Jelentkezz, ha helyet adnál egyiküknek az otthonodban!",
  },
];

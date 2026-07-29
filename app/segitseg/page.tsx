import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import HelpForm from "@/components/HelpForm";
import type { HelpCategory } from "@/lib/help-categories";

export const metadata: Metadata = {
  title: "Segítség | Jeromos Egyesület",
  description:
    "Így segíthetsz a Jeromos Egyesületnek: adományozás, önkéntesség, gyűjtésszervezés, ideiglenes befogadás, sétáltatás, közösségi szolgálat.",
};

const DONATE_URL = "https://cause.lundadonate.org/jeromos/adomany";

const helpSections = [
  { id: "adomanyozz", label: "Adományozz" },
  { id: "csapat", label: "Legyél része a csapatnak" },
  { id: "gyujtes", label: "Szervezz gyűjtést" },
  { id: "ideiglenes", label: "Vállalj ideiglenes befogadást" },
  { id: "setaltatas", label: "Sétáltass" },
  { id: "diakoknak", label: "Diákoknak" },
  { id: "segitek-form", label: "Jelentkezz" },
];

const fosterPoints = [
  "Rövid távú elköteleződést keresel.",
  "Szeretnél segíteni egy kisállaton — esetleg van kiszemelted, de nem tudod adoptálni, pedig megszakad érte a szíved.",
  "Ki szeretnéd magad próbálni a gazdi szerepben, mint felelős kutyatartó.",
  "Szeretnél vicces és csupa szeretet pillanatokat megélni egy élőlénnyel, akinek az új élet esélyét adod meg.",
  "Felkészültél akár a nem várt szituációkra is, amiket egy nem szobatiszta, ülni, feküdni, nem rosszalkodni még nem tudó kutyus tud okozni.",
  "Ha szeretsz fotózni és posztot írni.",
];

export default async function Segitseg({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string }>;
}) {
  const { kategoria } = await searchParams;

  return (
    <PageShell
      eyebrow="Így segíthetsz"
      title="Segítség"
      lead="Munkánk adományokból és önkéntesek segítségéből él. Sokféleképpen bekapcsolódhatsz — íme a legfontosabb módok."
    >
      <nav className="help-nav" aria-label="Ugrás egy szakaszra">
        {helpSections.map((s) => (
          <a className="chip" href={`#${s.id}`} key={s.id}>
            {s.label}
          </a>
        ))}
      </nav>

      {/* Adományozz */}
      <section className="help-block" id="adomanyozz">
        <h2>Adományozz</h2>
        <p style={{ color: "var(--copy)" }}>
          Minden adomány számít! Egyszeri támogatással egy sérült vagy
          elhagyott állaton segítesz, míg a havi rendszeres adományod
          kiszámíthatóvá és tervezhetővé teszi a telep minden lakójának
          életét. Van, aki éveken át velünk marad.
        </p>
        <div className="split">
          <div>
            <ul className="list">
              <li>Rendszeres vagy egyszeri pénzbeli adomány</li>
              <li>Táp, takaró, kutyafelszerelés felajánlása</li>
            </ul>
            <a
              className="button solid"
              style={{ marginTop: 8 }}
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Adományozok most
            </a>
          </div>
          <div className="callout" style={{ margin: 0 }}>
            <b style={{ display: "block", marginBottom: 8 }}>Adó 1%-a</b>
            Nonprofit civil szervezetként jogosultak vagyunk az adó 1%-ára. A
            pontos adószámért és banki adatokért vedd fel velünk a
            kapcsolatot: <b>+36 20 374 6775</b>.
          </div>
        </div>
      </section>

      {/* Legyél része a csapatnak */}
      <section className="help-block" id="csapat">
        <h2>Legyél része a csapatnak</h2>
        <p style={{ color: "var(--copy)" }}>
          Itt a lehetőség, hogy Te is csatlakozz hozzánk! Szeretettel várjuk
          és fogadjuk önkéntesek segítségét — legyen szó leendő gazdikról,
          csoportokról, családokról, vagy akár diákokról, akik a közösségi
          szolgálatukat töltenék nálunk.
        </p>
        <ul className="list">
          <li>Önkéntes munka a telepen: etetés, kennelek rendben tartása</li>
          <li>Rendezvényeken, gyűjtéseken való segítség</li>
          <li>Megosztás, tartalomkészítés a közösségi médiában</li>
        </ul>
        <Link
          className="button solid"
          style={{ marginTop: 8 }}
          href="/segitseg?kategoria=csapat#segitek-form"
        >
          Jelentkezem önkéntesnek
        </Link>
      </section>

      {/* Szervezz gyűjtést */}
      <section className="help-block" id="gyujtes">
        <h2>Szervezz gyűjtést</h2>
        <p style={{ color: "var(--copy)" }}>
          Ha adománygyűjtést hirdetünk, a Te saját környezetedben — munkahelyeden,
          iskoládban, baráti körödben — is lehetsz aktívabb: vedd fel velünk a
          kapcsolatot, egyeztessünk, hogy épp mire és mikor van szükségünk.
        </p>
        <Link className="button solid" href="/segitseg?kategoria=gyujtes#segitek-form">
          Egyeztessünk egy gyűjtésről
        </Link>
      </section>

      {/* Vállalj ideiglenes befogadást */}
      <section className="help-block" id="ideiglenes">
        <h2>Vállalj ideiglenes befogadást</h2>
        <p style={{ color: "var(--copy)" }}>
          Az ideiglenes gazdi szuper lehetőség azoknak a kutyusoknak, akiket
          szeretnénk elhozni a menhelyről, de még nem találtunk nekik végleges
          gazdit. Az ideiglenes gazda egy olyan önkéntes, aki szereti a
          kutyákat, felelős kutyatartó, és vállalja a „feladatokat” — azaz
          mindent megtesz azért, hogy pártfogoltja készen álljon a végleges
          örökbefogadásra, mire megtalálja a hozzá illő gazdit.
        </p>
        <p style={{ color: "var(--copy)" }}>
          Az ideiglenes gazdi szuper lehetőség annak is, aki segíteni szeretne
          egy-egy kutyuson, de nem szeretne még hosszútávra elköteleződni. És
          persze tökéletes azoknak, akik a menhelyeken raboskodnak: már a
          gazdi érkezése előtt szocializálódnak, világot látnak, megtanulnak
          bízni, és nem a megszokott ingerszegény környezet veszi körül őket.
          Ez a kutyusoknak csak jót tesz, és egyes ideiglenesek életét is
          megváltoztatja, amikor rájönnek, egy-egy ilyen kis állat mennyit tud
          adni!
        </p>
        <p style={{ fontWeight: 600 }}>
          Ha ideiglenes befogadáson gondolkozol, és ezek a pontok illenek rád,
          akkor Te vagy a következő ideiglenes gazdi:
        </p>
        <ul className="list">
          {fosterPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="callout accent">
          Ha tényleg szeretnél ideiglenes gazdinak jelentkezni, kérjük, írj egy
          bemutatkozó levelet a{" "}
          <a href="mailto:jeromos.egyesulet@gmail.com">
            jeromos.egyesulet@gmail.com
          </a>{" "}
          e-mail címre, vagy töltsd ki{" "}
          <Link href="/segitseg?kategoria=ideiglenes#segitek-form">
            lenti űrlapunkat
          </Link>
          !
        </div>
        <p style={{ color: "var(--copy)", fontSize: 14 }}>
          Ha inkább véglegesen fogadnál örökbe, nézd meg{" "}
          <Link href="/orokbefogadas">örökbefogadás</Link> oldalunkat — ha
          minket választasz ehhez, a Te örökbefogadásod is az egyik
          legszebb, legnemesebb tetté válik.
        </p>
      </section>

      {/* Sétáltass */}
      <section className="help-block" id="setaltatas">
        <h2>Sétáltass</h2>
        <p style={{ color: "var(--copy)" }}>
          Annak is örülünk, ha eljössz akár egyetlen órára, és sétálsz egyet
          valamelyik kutyánkkal! Gyönyörű környezetben nagyokat lehet
          kalandozni — és a kutyusoknak is felüdülés egy kis változatosság a
          mindennapjaikban.
        </p>
        <Link className="button solid" href="/segitseg?kategoria=setaltatas#segitek-form">
          Ide kattintva tudod leadni a jelentkezésedet
        </Link>
      </section>

      {/* Diákoknak (50 órás közmunka) */}
      <section className="help-block" id="diakoknak">
        <h2>Diákoknak (50 órás közmunka)</h2>
        <p style={{ color: "var(--copy)" }}>
          Középiskolás vagy, és még nem teljesítetted az érettségihez
          szükséges 50 órás közösségi szolgálatot? Nálunk hasznosan és sok
          szeretettel töltheted az óráidat: kutyasétáltatás, etetés, a
          kennelek rendben tartása, vagy akár a közösségi média tartalmainak
          segítése is része lehet a feladatoknak.
        </p>
        <Link className="button solid" href="/segitseg?kategoria=diak#segitek-form">
          Egyeztessünk az iskolai papírokról
        </Link>
      </section>

      {/* Jelentkezési űrlap */}
      <section className="help-block" id="segitek-form">
        <h2>Jelentkezz</h2>
        <p style={{ color: "var(--copy)" }}>
          Válaszd ki, hogyan szeretnél segíteni, add meg az elérhetőségeidet,
          és mi hamarosan felvesszük veled a kapcsolatot.
        </p>
        <HelpForm key={kategoria || "default"} preselect={(kategoria as HelpCategory) || ""} />
      </section>
    </PageShell>
  );
}

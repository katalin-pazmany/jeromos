import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Segítség | Jeromos Egyesület",
  description:
    "Így segíthetsz a Jeromos Egyesületnek: ideiglenes befogadás, adományozás, adó 1%, önkéntesség.",
};

const fosterPoints = [
  "Rövid távú elköteleződést keresel.",
  "Szeretnél segíteni egy kisállaton — esetleg van kiszemelted, de nem tudod adoptálni, pedig megszakad érte a szíved.",
  "Ki szeretnéd magad próbálni a gazdi szerepben, mint felelős kutyatartó.",
  "Szeretnél vicces és csupa szeretet pillanatokat megélni egy élőlénnyel, akinek az új élet esélyét adod meg.",
  "Felkészültél akár a nem várt szituációkra is, amiket egy nem szobatiszta, ülni, feküdni, nem rosszalkodni még nem tudó kutyus tud okozni.",
  "Ha szeretsz fotózni és posztot írni.",
];

export default function Segitseg() {
  return (
    <PageShell
      eyebrow="Így segíthetsz"
      title="Segítség"
      lead="Munkánk adományokból és önkéntesek segítségéből él. Sokféleképpen bekapcsolódhatsz — íme a legfontosabb módok."
    >
      {/* Ideiglenes befogadás */}
      <section className="help-block">
        <h2>Ideiglenes befogadás</h2>
        <p style={{ color: "var(--copy)" }}>
          Az ideiglenes gazdi szuper lehetőség annak, aki segíteni szeretne
          egy-egy kutyuson, de nem szeretne még hosszútávra elköteleződni. És
          persze tökéletes azoknak, akik a menhelyeken raboskodnak: már a gazdi
          érkezése előtt szocializálódnak, világot látnak, megtanulnak bízni és
          persze nem a megszokott ingerszegény környezet veszi körül őket. Ez a
          kutyusoknak csak jót tesz, és egyes ideiglenesek életét is
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
          e-mail címre!
        </div>
      </section>

      {/* Egyéb támogatási módok */}
      <section className="help-block">
        <h2>Egyéb módok a segítségre</h2>
        <div className="split">
          <div>
            <ul className="list">
              <li>Rendszeres vagy egyszeri pénzbeli adomány</li>
              <li>Táp, takaró, kutyafelszerelés felajánlása</li>
              <li>Önkéntes munka, sétaprogram, megosztás</li>
              <li>Örökbefogadás — adj otthont egy mentett kutyának</li>
            </ul>
            <a
              className="button solid"
              style={{ marginTop: 8 }}
              href="mailto:jeromos.egyesulet@gmail.com"
            >
              Írj nekünk
            </a>
          </div>
          <div
            className="callout"
            style={{ margin: 0 }}
          >
            <b style={{ display: "block", marginBottom: 8 }}>Adó 1%-a</b>
            Nonprofit civil szervezetként jogosultak vagyunk az adó 1%-ára. A
            pontos adószámért és banki adatokért vedd fel velünk a kapcsolatot:{" "}
            <b>+36 20 374 6775</b>.
          </div>
        </div>
      </section>
    </PageShell>
  );
}

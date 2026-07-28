import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Rólunk | Jeromos Egyesület" };

const koret = [
  "Baja",
  "Nemesnádudvar",
  "Rém",
  "Vaskút",
  "Bátmonostor",
  "Nagybaracska",
  "Bácsbokod",
  "Csátalja",
  "Érsekcsanád",
];

export default function Rolunk() {
  return (
    <PageShell
      eyebrow="Jeromos Egyesület · Baja"
      title="Rólunk"
      lead="Bajai és környékbeli állatmentők, akik minden bajba került állatért dolgoznak — 2020 óta."
    >
      <div className="prose">
        <p>
          A 2020 novemberében alakult <b>Jeromos Állatmentő és Természetvédő
          Egyesület</b> olyan bajai és környékbeli állatmentőket tömörít, akik
          hosszú évek óta nagy elhivatottsággal végezték munkájukat. Csatlakozott
          hozzájuk a gyepmesteri telepen lévő kutyák támogatására létrejött
          Kutyabaja Alapítvány elnöksége is, hogy a segítséget kiterjeszthessék
          minden kutyára, illetve minden bajba került állatra.
        </p>
        <p>
          E civil szerveződés <b>2021. március 1-jétől</b> vette át a bajai
          gyepmesteri telep üzemeltetését, továbbá a gyepmesteri feladatok
          folyamatos, mindenkori jogszabályoknak megfelelő teljeskörű ellátását.
          Kiemelten fontosnak tartjuk a környezet megóvását is, ezért feladataink
          közé beemeltük többek között a szemétszedést és a faültetést is.
        </p>

        <div className="callout">
          Nonprofit civil szervezetként jogosultak vagyunk az <b>adó 1%-ára</b>.
        </div>

        <h2>Állatotthon</h2>
        <p>
          Baján sosem működött hivatalos menhely, bár az igény régóta megvan:
          évek óta körvonalazódik a megoldás a sintértelepek átalakítására
          Magyarországon, hiszen egy gyepmesteri telepre kötött és már
          korszerűtlen szabályok vonatkoznak, így ez a rendszer elavult, negatív
          jelentéstartalmat hordozó konstrukció. A Jeromos Egyesület olyan —
          országos szinten már hatékonyan működő — rendszert szeretne kialakítani,
          amely végre Baján is megoldást kínál azokra a problémákra, amelyeket
          eddig gyepmesteri feladatkörben nem lehetett ellátni. Önkormányzati
          hatáskörbe tartozik ugyanis az állati hulladék elszállítása, a kóbor
          ebek befogása, az állati tetemek elszállítása és a terület felügyelete:
          a gyepmester által végzett feladatok nagyrészt a város szélén található
          telepen valósulnak meg. Mindezt mi magunk is folytatjuk, de ennél sokkal
          többet is szeretnénk: olyan korszerű intézményt kiépíteni és működtetni,
          amelynek minden eleme az állatok jólétét és a felelős állattartás
          gyakorlatának kialakulását szolgálja. Mindamellett, hogy a szervezet
          elvégzi a kötelező feladatokat, a Jeromos Állatotthon menhely funkciót is
          betölt.
        </p>

        <h3>Szolgáltatási körzet</h3>
        <div className="chips">
          {koret.map((k) => (
            <span className="chip" key={k}>
              {k}
            </span>
          ))}
        </div>

        <div className="callout accent">
          „A honlapon közzétett kutyák bármikor örökbefogadhatók.”
        </div>

        <h3>Díjtételek</h3>
        <ul className="fees">
          <li>
            <span>
              Állati eredetű melléktermék (kutya, macska tetem) elszállítása
              magánterületről
            </span>
            <b>10.000 Ft</b>
          </li>
          <li>
            <span>
              Kóbor kutya hazajuttatása chip és érvényes oltás esetén
            </span>
            <b>5.000 Ft</b>
          </li>
        </ul>
      </div>
    </PageShell>
  );
}

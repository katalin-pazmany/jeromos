import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Adatvédelmi tájékoztató | Jeromos Egyesület",
  description:
    "Tájékoztató arról, milyen személyes adatokat kezel a Jeromos Egyesület az örökbefogadási jelentkezések és segítségkérések során, és milyen jogok illetnek meg.",
};

const cookies = [
  {
    name: "jeromos_admin",
    purpose: "Bejelentkezett munkatársak azonosítása az admin felületen.",
    duration: "8 óra, vagy kijelentkezésig.",
  },
];

const processors = [
  { name: "Vercel", purpose: "Tárhely és a weboldal futtatása." },
  { name: "Neon (Vercel Marketplace)", purpose: "Adatbázis, ahol a jelentkezések és üzenetek tárolódnak." },
  { name: "Vercel Blob", purpose: "A kutyák fotóinak tárolása." },
  { name: "Resend", purpose: "A jelentkezési és segítségkérő űrlapok e-mailben történő továbbítása." },
];

export default function Adatvedelem() {
  return (
    <PageShell
      eyebrow="Jogi tájékoztató"
      title="Adatvédelmi tájékoztató"
      lead="Utoljára frissítve: 2026. július 31."
    >
      <div className="prose">
        <h2>1. Ki vagyunk mi</h2>
        <p>
          Ezt a weboldalt a <b>Jeromos Állatmentő és Természetvédő Egyesület</b>{" "}
          (székhely: 6500 Baja, V. ker. 46.) üzemelteti, kutyamentési és
          örökbeadási céllal. Adatvédelmi kérdésekkel a{" "}
          <a href="mailto:jeromos.egyesulet@gmail.com">
            jeromos.egyesulet@gmail.com
          </a>{" "}
          címen, vagy a +36 20 374 6775 telefonszámon kereshetsz minket.
        </p>

        <h2>2. Milyen adatokat gyűjtünk</h2>
        <p>Személyes adatot két esetben kérünk el:</p>
        <ul>
          <li>
            <b>Örökbefogadási jelentkezés</b> (Jelentkezés oldal): név, e-mail
            cím, telefonszám, lakhely, illetve a jelentkezésedhez fűzött
            válaszaid (kert megléte, meglévő állatok, bemutatkozás).
          </li>
          <li>
            <b>Segítségkérés / önkéntes jelentkezés</b> (Segítek oldal): név,
            e-mail cím, opcionálisan telefonszám és elérhetőség, valamint az
            üzeneted szövege.
          </li>
        </ul>

        <h2>3. Mit nem gyűjtünk</h2>
        <ul>
          <li>Nincs regisztráció, felhasználói fiók vagy jelszó a látogatók számára.</li>
          <li>Nem kérünk és nem tárolunk bankkártya- vagy más fizetési adatot — az adományozás egy külső, a Lunda Donate által üzemeltetett oldalon történik.</li>
          <li>Nem használunk látogatottságmérő (analitikai) vagy hirdetési célú sütiket, és nem követjük a látogatókat oldalak vagy eszközök között.</li>
          <li>Nem kérünk pontos helyadatot.</li>
        </ul>

        <h2>4. Hogyan használjuk az adataidat</h2>
        <p>
          A megadott adatokat kizárólag a jelentkezésed vagy üzeneted
          feldolgozására, és a veled történő kapcsolatfelvételre használjuk.
          Az űrlapok elküldése után az adatok bekerülnek adatbázisunkba, és
          egy értesítő e-mailt is küldünk róluk a szervezet
          jeromos.egyesulet@gmail.com címére. Az adatokat nem használjuk
          hirdetési célra, és harmadik félnek — a lenti adatfeldolgozók
          kivételével, akik a weboldal technikai működtetéséhez szükségesek —
          nem adjuk át.
        </p>

        <h2>5. Sütik</h2>
        <p>
          A weboldal egyetlen, kizárólag technikai célú sütit használ — ez nem
          alkalmas a látogatók nyomon követésére, és nem harmadik féltől
          származik:
        </p>
        <ul className="legal-list">
          {cookies.map((c) => (
            <li key={c.name}>
              <span>
                <b>{c.name}</b> — {c.purpose}
              </span>
              <b>{c.duration}</b>
            </li>
          ))}
        </ul>

        <h2>6. Kikkel osztjuk meg az adatokat</h2>
        <p>
          A weboldal működtetéséhez az alábbi szolgáltatókat vesszük igénybe,
          amelyek adatfeldolgozóként férhetnek hozzá a szerverinfrastruktúrán
          áthaladó adatokhoz:
        </p>
        <ul className="legal-list">
          {processors.map((p) => (
            <li key={p.name}>
              <span>{p.purpose}</span>
              <b>{p.name}</b>
            </li>
          ))}
        </ul>

        <h2>7. Adatmegőrzés</h2>
        <p>
          A jelentkezéseket és üzeneteket addig őrizzük meg, amíg az
          örökbefogadási folyamathoz vagy az együttműködéshez szükséges, illetve
          amíg törlést nem kérsz. Törlési kérelmedet a fenti e-mail címen
          jelezheted.
        </p>

        <h2>8. Jogaid (GDPR)</h2>
        <p>
          Az Európai Unió Általános Adatvédelmi Rendelete (GDPR) alapján jogod
          van:
        </p>
        <ul>
          <li>hozzáférni a rólad tárolt adatokhoz,</li>
          <li>kérni azok helyesbítését vagy törlését,</li>
          <li>kérni az adatkezelés korlátozását, vagy tiltakozni ellene,</li>
          <li>az adatok hordozhatóságát kérni,</li>
          <li>
            panaszt tenni a{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
              Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH)
            </a>
            .
          </li>
        </ul>
        <p>
          Kérésedre 30 napon belül válaszolunk a fenti e-mail címen keresztül.
        </p>

        <h2>9. Nemzetközi adattovábbítás</h2>
        <p>
          A fenti szolgáltatók (Vercel, Neon, Resend) infrastruktúrája
          részben az Európai Unión kívül, jellemzően az Egyesült Államokban is
          futhat. Ezek a szolgáltatók a GDPR által elismert garanciákat
          (általános szerződési feltételek, megfelelőségi határozatok)
          alkalmaznak a nemzetközi adattovábbításra.
        </p>

        <h2>10. Gyermekek adatvédelme</h2>
        <p>
          A weboldal nem 16 év alatti gyermekeknek szól, és tudatosan nem
          gyűjtünk adatot tőlük. Amennyiben úgy találod, hogy gyermeked
          adatait kaptuk meg, kérjük, jelezd a fenti elérhetőségen, hogy
          töröljük azokat.
        </p>

        <h2>11. Biztonság</h2>
        <p>
          Az oldal minden kapcsolata titkosított (HTTPS), az adatbázis és a
          tárhely a szolgáltatók (Vercel, Neon) által biztosított titkosítást
          és hozzáférés-védelmet használja. Az admin felület jelszóval
          védett, azt kizárólag a szervezet munkatársai érik el.
        </p>

        <h2>12. Változások</h2>
        <p>
          Ezt a tájékoztatót időről időre frissíthetjük — a lap tetején
          mindig feltüntetjük az utolsó frissítés dátumát. Jelentős
          változásról igyekszünk külön is tájékoztatni.
        </p>

        <h2>13. Kapcsolat</h2>
        <p>
          Kérdésed van az adatkezeléssel kapcsolatban? Írj nekünk:{" "}
          <a href="mailto:jeromos.egyesulet@gmail.com">
            jeromos.egyesulet@gmail.com
          </a>{" "}
          — vagy hívj minket: +36 20 374 6775.
        </p>

        <div className="callout">
          Ez a tájékoztató AI-asszisztens segítségével készült a weboldal
          tényleges adatkezelési gyakorlata alapján. Jogi értelemben vett
          megfelelőség biztosításához ajánlott ügyvéddel átnézetni, mielőtt
          véglegesnek tekinted.
        </div>
      </div>
    </PageShell>
  );
}

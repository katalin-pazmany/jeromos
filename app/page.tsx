import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DogCard from "@/components/DogCard";
import { getAllDogs } from "@/lib/dogs-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredDogs = (await getAllDogs()).slice(0, 3);
  return (
    <>
      <SiteHeader />

      <main id="kezdolap">
        {/* Hero – full-screen collage */}
        <section className="hero">
          <div className="hero-collage" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <img
                key={i}
                src={`/collage/c${i + 1}.jpg`}
                alt=""
                loading={i < 6 ? "eager" : "lazy"}
              />
            ))}
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-inner">
            <span className="eyebrow">Minden kutya megérdemel egy új életet</span>
            <h1>
              Ments meg egy életet,
              <br />
              <span>fogadj örökbe nálunk.</span>
            </h1>
            <p>
              Minden mentett kutya egy második esélyre vár. Egy örökbefogadással
              nem csupán otthont adsz — életet mentesz, és cserébe feltétel
              nélküli szeretetet kapsz.
            </p>
            <div className="hero-actions">
              <Link className="button solid" href="/gazdira-varnak">
                Ismerd meg a kutyusainkat
              </Link>
              <Link className="button light" href="/jelentkezes">
                Örökbefogadok
              </Link>
            </div>
          </div>
        </section>

        {/* Impact stats */}
        <section className="stats">
          <div className="wrap stats-grid">
            <div className="stat">
              <strong>100+</strong>
              <span>Gazdira talált kutya</span>
            </div>
            <div className="stat">
              <strong>50+</strong>
              <span>Jelenleg gondozásban</span>
            </div>
            <div className="stat">
              <strong>90%</strong>
              <span>Sikeres örökbefogadás</span>
            </div>
            <div className="stat">
              <strong>2020 óta</strong>
              <span>Baja kutyáiért</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="wrap intro" id="rolunk">
          <div>
            <div className="kicker">A mi történetünk</div>
            <h2>Kutyákért dobban a szívünk.</h2>
          </div>
          <div>
            <p>
              A Jeromos Egyesület Baja és környéke gazdátlan, sérült vagy bajba
              került kutyáiért dolgozik. Nálunk minden kutya egyéniség — és
              mindenki megérdemel egy olyan helyet, ahová hazamehet.
            </p>
            <Link className="text-link" href="/rolunk">
              Ismerd meg az egyesületet →
            </Link>
          </div>
        </section>

        {/* Dogs */}
        <section className="dogs" id="kutyak">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="kicker">Gazdira várnak</div>
                <h2>Talán épp ő vár rád.</h2>
              </div>
              <Link className="text-link" href="/gazdira-varnak">
                Összes kutyus megismerése →
              </Link>
            </div>
            <div className="cards">
              {featuredDogs.map((dog) => (
                <DogCard key={dog.slug} dog={dog} />
              ))}
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="support wrap" id="segitseg">
          <div className="support-card">
            <div className="support-copy">
              <span className="eyebrow">
                <span className="dot" /> Együtt többre vagyunk képesek
              </span>
              <h2>Nem csak örökbe fogadhatsz.</h2>
              <p>
                Egy tál étel, egy séta, egy megosztás, ideiglenes befogadás vagy
                rendszeres támogatás: minden segítség közelebb visz egy boldog
                farkcsóváláshoz.
              </p>
              <Link className="button" href="/segitseg">
                Így segíthetsz
              </Link>
            </div>
            <div
              className="support-img"
              role="img"
              aria-label="Kutyával foglalkozó önkéntes"
            />
          </div>
        </section>

        {/* Contact */}
        <section className="contact wrap" id="kapcsolat">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="kicker">Találkozzunk</div>
              <h3>Várunk Baján.</h3>
              <div className="details">
                <div className="detail">
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.2 12 21 12 21z" />
                      <circle cx="12" cy="10.5" r="2.3" />
                    </svg>
                  </div>
                  <div>
                    <b>Menhelyünk</b>
                    6500 Baja, V. ker. 46.
                  </div>
                </div>
                <div className="detail">
                  <div>☎</div>
                  <div>
                    <b>Telefon</b>
                    <a href="tel:+36203746775">+36 20 374 6775</a>
                  </div>
                </div>
                <div className="detail">
                  <div>✉</div>
                  <div>
                    <b>E-mail</b>
                    <a href="mailto:jeromos.egyesulet@gmail.com">
                      jeromos.egyesulet@gmail.com
                    </a>
                  </div>
                </div>
                <div className="detail">
                  <div>◷</div>
                  <div>
                    <b>Nyitvatartás</b>
                    Hétfő–Szombat: 10:00–16:00 · Vasárnap: 12:00–15:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

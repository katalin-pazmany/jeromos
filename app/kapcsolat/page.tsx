import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Kapcsolat | Jeromos Egyesület" };

export default function Kapcsolat() {
  return (
    <PageShell
      eyebrow="Találkozzunk"
      title="Kapcsolat"
      lead="Kérdésed van, vagy szeretnél személyesen is megismerni minket? Írj vagy hívj minket bizalommal."
    >
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
      <a
        className="button"
        style={{ marginTop: 22 }}
        href="https://www.facebook.com/kutyabajaap/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Írj nekünk Facebookon
      </a>
      <p style={{ marginTop: 18, color: "var(--copy)", fontSize: 14 }}>
        A pontos helyszínt a lap alján található térképen találod.
      </p>
    </PageShell>
  );
}

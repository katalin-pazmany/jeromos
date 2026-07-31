import Link from "next/link";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/kutyabajaap/",
    icon: (
      <path d="M13.5 21v-8h2.2l.4-2.8h-2.6V8.4c0-.8.2-1.4 1.4-1.4H16V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H7.8V13h2.3v8h3.4z" />
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kutyabaja_jeromos",
    icon: (
      <path d="M16.5 3c.3 2 1.5 3.4 3.5 3.6v2.4c-1.2 0-2.4-.4-3.4-1v5.7c0 3-2.1 5.3-5 5.3a5 5 0 0 1-5-5c0-3.1 2.7-5.4 5.8-4.9v2.5c-.3-.1-.7-.2-1-.2-1.4 0-2.5 1.2-2.4 2.7a2.5 2.5 0 0 0 5 .1V3h2.5z" />
    ),
  },
  {
    label: "Weboldal",
    href: "https://bajaikutyak.hu/",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3.8 12h16.4M12 3.8c2.2 2.3 3.3 5.2 3.3 8.2S14.2 17.9 12 20.2M12 3.8c-2.2 2.3-3.3 5.2-3.3 8.2S9.8 17.9 12 20.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </>
    ),
  },
];

const hours = [
  { day: "Hétfő – Szombat", time: "10:00 – 16:00" },
  { day: "Vasárnap", time: "12:00 – 15:00" },
];

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-top">
        <div className="footer-info">
          <div className="footer-brand">
            <img src="/jeromos_logo.svg" alt="Jeromos Egyesület emblémája" />
            <div>
              <strong>Jeromos Egyesület</strong>
              <span>🐾 Bajai kutyákért, 2007 óta</span>
            </div>
          </div>

          <div className="footer-cols">
            <div className="footer-contact">
              <b>Elérhetőség</b>
              <a href="tel:+36203746775">+36 20 374 6775</a>
              <a href="mailto:jeromos.egyesulet@gmail.com">
                jeromos.egyesulet@gmail.com
              </a>
              <span>6500 Baja, V. ker. 46.</span>
            </div>

            <div className="footer-hours">
              <b>Nyitvatartás</b>
              {hours.map((h) => (
                <div className="hours-row" key={h.day}>
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </div>
              ))}
              <em>Érkezés előtt kérünk, telefonálj!</em>
            </div>
          </div>

          <div className="footer-social">
            <b>Kövess minket</b>
            <div className="social-icons">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="social-icon"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-map">
          <iframe
            title="Jeromos Egyesület térkép – Baja"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9091.783510793937!2d18.945089927394655!3d46.145813126369866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4743204eafd6ceaf%3A0x96d588fe8a3de47e!2sJeromos%20Egyes%C3%BClet!5e1!3m2!1sen!2suk!4v1785188815314!5m2!1sen!2suk"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Jeromos Egyesület · Baja, Magyarország</span>
        <div className="footer-links">
          <Link href="/orokbefogadas">Örökbefogadás</Link>
          <Link href="/segitseg">Segítség</Link>
          <Link href="/tanacsok">Tanácsok</Link>
          <Link href="/rolunk">Rólunk</Link>
          <Link href="/adatvedelem">Adatvédelem</Link>
          <Link className="footer-admin" href="/admin" title="Belépés munkatársaknak">
            🔒 Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

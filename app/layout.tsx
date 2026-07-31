import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jeromos-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jeromos Egyesület | Minden kutya hazatalálhat",
  description: "Jeromos Egyesület – kutyamentés és örökbeadás Baján.",
  openGraph: {
    title: "Jeromos Egyesület | Minden kutya hazatalálhat",
    description: "Jeromos Egyesület – kutyamentés és örökbeadás Baján.",
    url: SITE_URL,
    siteName: "Jeromos Egyesület",
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeromos Egyesület | Minden kutya hazatalálhat",
    description: "Jeromos Egyesület – kutyamentés és örökbeadás Baján.",
  },
};

export const viewport = {
  colorScheme: "light" as const,
  themeColor: "#c0dece",
};

// Real org details, matching what's already shown in the site footer — kept
// in sync manually since it's small and rarely changes.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "AnimalShelter",
  name: "Jeromos Állatmentő és Természetvédő Egyesület",
  url: SITE_URL,
  logo: `${SITE_URL}/jeromos_logo.svg`,
  image: `${SITE_URL}/jeromos_logo.svg`,
  description:
    "Bajai és környékbeli kutyamentés és örökbeadás — a Jeromos Állatmentő és Természetvédő Egyesület 2020 óta dolgozik gazdátlan, sérült vagy bajba jutott kutyákért.",
  telephone: "+36203746775",
  email: "jeromos.egyesulet@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "V. ker. 46.",
    addressLocality: "Baja",
    postalCode: "6500",
    addressCountry: "HU",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "16:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "12:00",
      closes: "15:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/kutyabajaap/",
    "https://www.tiktok.com/@kutyabaja_jeromos",
    "https://bajaikutyak.hu/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

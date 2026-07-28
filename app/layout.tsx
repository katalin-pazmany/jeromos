import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeromos Egyesület | Minden kutya hazatalálhat",
  description: "Jeromos Egyesület – kutyamentés és örökbeadás Baján.",
};

export const viewport = {
  colorScheme: "light" as const,
  themeColor: "#c0dece",
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

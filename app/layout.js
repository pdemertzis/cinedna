import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import AppNavbar from "@/components/AppNavbar";
import { Analytics } from "@vercel/analytics/react";
import AppFooter from "@/components/AppFooter";
import { SITE_URL } from "@/lib/siteUrl";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  // Domain-agnostic base/canonical URL, sourced from NEXT_PUBLIC_SITE_URL.
  metadataBase: new URL(SITE_URL),
  title: "CineDNA — Ανακάλυψε το κινηματογραφικό σου DNA",
  description: "Βάλε 3 ταινίες που αγαπάς και ανακάλυψε το κινηματογραφικό σου DNA. Προσωποποιημένες προτάσεις ταινιών που δεν θα έβρισκες μόνος σου.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "CineDNA — Ανακάλυψε το κινηματογραφικό σου DNA",
    description: "Βάλε 3 ταινίες που αγαπάς και ανακάλυψε το κινηματογραφικό σου DNA.",
    url: SITE_URL,
    siteName: "CineDNA",
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineDNA",
    description: "Βάλε 3 ταινίες που αγαπάς και ανακάλυψε το κινηματογραφικό σου DNA.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" className={`${cormorant.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AppNavbar />
          <div style={{ paddingTop: "56px", minHeight: "100vh" }}>{children}</div>
          <AppFooter />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}

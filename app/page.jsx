"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function WelcomePage() {
  const { t } = useLanguage();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        display: "grid",
        placeItems: "center",
        padding: "32px",
      }}
    >
      <section style={{ width: "100%", maxWidth: "980px" }}>
        <div
          style={{
            display: "inline-block",
            border: "1px solid var(--go)",
            color: "var(--go)",
            borderRadius: "999px",
            padding: "8px 14px",
            fontFamily: "var(--font-label)",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "26px",
          }}
        >
          {t.badge}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(46px, 9vw, 108px)",
            lineHeight: 1,
            margin: 0,
            maxWidth: "14ch",
          }}
        >
          {t.hero}
        </h1>

        <p
          style={{
            marginTop: "18px",
            marginBottom: "30px",
            color: "var(--mu)",
            fontSize: "20px",
            fontFamily: "var(--font-cormorant), serif",
            maxWidth: "34ch",
          }}
        >
          {t.sub}
        </p>

        <Link
          href="/onboarding"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            padding: "14px 26px",
            textDecoration: "none",
            fontFamily: "var(--font-label)",
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {t.start}
        </Link>
      </section>
    </main>
  );
}

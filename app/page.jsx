"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const HOW_STEPS = {
  el: [
    { n: "01", title: "Επιλέγεις τρεις ταινίες", desc: "Όχι τις αγαπημένες — αυτές που άφησαν σημάδι. Τις αναζητάς από τη βάση του TMDB." },
    { n: "02", title: "Ορίζεις διάθεση και εποχή", desc: "Τι ψάχνεις απόψε; Ηρεμία, πρόκληση, απόδραση; Από ποια δεκαετία;" },
    { n: "03", title: "Ανακαλύπτεις το DNA σου", desc: "Ο αλγόριθμος αναλύει τα είδη και την αισθητική σου και βρίσκει τον κινηματογραφικό σου τύπο — από 12 διαφορετικά profiles." },
    { n: "04", title: "Παίρνεις μια σύσταση", desc: "Μια ταινία που δεν θα έβρισκες μόνος σου. Μπορείς να ζητάς νέες — μέχρι 50 — χωρίς να επαναλαμβάνεται καμία." },
  ],
  en: [
    { n: "01", title: "Choose three films", desc: "Not your favourites — the ones that left a mark. Search from the TMDB database." },
    { n: "02", title: "Set your mood and era", desc: "What are you looking for tonight? Stillness, challenge, escape? Which decade speaks to you?" },
    { n: "03", title: "Discover your DNA", desc: "The algorithm analyses your aesthetic and genre patterns to find your cinematic type — one of 12 distinct profiles." },
    { n: "04", title: "Get a recommendation", desc: "One film you wouldn't have found on your own. Request new ones — up to 50 — with no repeats." },
  ],
};

export default function WelcomePage() {
  const { lang, t } = useLanguage();
  const [howOpen, setHowOpen] = useState(false);
  const steps = HOW_STEPS[lang] ?? HOW_STEPS.el;

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

        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
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

          <button
            type="button"
            onClick={() => setHowOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--mu)",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 160ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--cr)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--mu)"}
          >
            {lang === "el" ? "Πώς λειτουργεί" : "How it works"}
            <span style={{
              display: "inline-block",
              transition: "transform 200ms ease",
              transform: howOpen ? "rotate(180deg)" : "rotate(0deg)",
              lineHeight: 1,
            }}>
              ↓
            </span>
          </button>
        </div>

        {howOpen && (
          <div
            style={{
              marginTop: "28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: "var(--br)",
              border: "1px solid var(--br)",
              borderRadius: "16px",
              overflow: "hidden",
              animation: "stepFadeIn 220ms ease forwards",
            }}
          >
            {steps.map((step) => (
              <div
                key={step.n}
                style={{
                  background: "var(--bk)",
                  padding: "20px",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "11px",
                  color: "var(--go)",
                  letterSpacing: "0.12em",
                  marginBottom: "10px",
                }}>
                  {step.n}
                </div>
                <div style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "20px",
                  color: "var(--cr)",
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "16px",
                  color: "var(--mu)",
                  lineHeight: 1.5,
                }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

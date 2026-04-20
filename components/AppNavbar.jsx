"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [logoFailed, setLogoFailed] = useState(false);

  const isResultOrProfile = pathname === "/result" || pathname === "/profile";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "56px",
        background: "transparent",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--gold-nav-border)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          height: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <Link href="/" aria-label="CineDNA home" style={{ display: "inline-flex", alignItems: "center" }}>
          {logoFailed ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "13px",
                  letterSpacing: "0.3em",
                  color: "var(--go)",
                }}
              >
                CINE
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "var(--cr)",
                }}
              >
                DNA
              </span>
            </span>
          ) : (
            <img
              src="/cinedna-logo.svg"
              alt="CineDNA"
              onError={() => setLogoFailed(true)}
              style={{ height: "44px", width: "auto", display: "block" }}
            />
          )}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setLang("el")}
              style={{
                background: lang === "el" ? "var(--gold-hover)" : "transparent",
                border: "none",
                color: lang === "el" ? "var(--gl)" : "var(--di)",
                padding: "6px 10px",
                cursor: "pointer",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              ΕΛ
            </button>
            <span style={{ color: "var(--br)", fontSize: "12px", lineHeight: 1, userSelect: "none" }}>|</span>
            <button
              type="button"
              onClick={() => setLang("en")}
              style={{
                background: lang === "en" ? "var(--gold-hover)" : "transparent",
                border: "none",
                color: lang === "en" ? "var(--gl)" : "var(--di)",
                padding: "6px 10px",
                cursor: "pointer",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              EN
            </button>
          </div>

          {isResultOrProfile ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/result")}
                className={pathname === "/result" ? "btn-primary" : "btn-secondary"}
                style={{
                  borderRadius: "999px",
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontFamily: "var(--font-label)",
                  fontSize: "12px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {t.rec_tab}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className={pathname === "/profile" ? "btn-primary" : "btn-secondary"}
                style={{
                  borderRadius: "999px",
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontFamily: "var(--font-label)",
                  fontSize: "12px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {t.profile_tab}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

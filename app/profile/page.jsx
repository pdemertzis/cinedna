"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DNA_TYPES, getDNAStrings } from "@/lib/dna";
import TopBackButton from "@/components/TopBackButton";
import { useLanguage } from "@/lib/LanguageContext";

function formatDate(iso, lang) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "el-GR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedLast = localStorage.getItem("cinedna:lastResult");
    const savedHistory =
      localStorage.getItem("cinedna_history") ||
      localStorage.getItem("cinedna:history");

    if (savedLast) {
      try { setLastResult(JSON.parse(savedLast)); } catch { setLastResult(null); }
    }
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch { setHistory([]); }
    }
  }, []);

  // FIX: Always render DNA name/desc in current language (not saved one)
  const localisedDNA = useMemo(() => {
    if (!lastResult?.dnaKey) return { name: lastResult?.dnaName || "—", desc: lastResult?.dnaDesc || t.no_profile_yet };
    return getDNAStrings(lastResult.dnaKey, lang);
  }, [lastResult?.dnaKey, lastResult?.dnaName, lastResult?.dnaDesc, lang, t.no_profile_yet]);

  const handleNewDNA = () => {
    localStorage.removeItem("cinedna:lastResult");
    localStorage.removeItem("cinedna:shownFilmIds");
    localStorage.removeItem("cinedna_history");
    localStorage.removeItem("cinedna:history");
    router.push("/onboarding");
  };

  const dnaInfo = lastResult?.dnaKey ? DNA_TYPES[lastResult.dnaKey] : null;
  const listHistory = useMemo(() => history, [history]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        padding: "28px",
      }}
    >
      <TopBackButton href="/result" />
      <section style={{ width: "100%", maxWidth: "980px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "18px",
            marginTop: "34px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "clamp(38px, 7vw, 64px)",
              color: "var(--gl)",
            }}
          >
            {t.profile_title}
          </h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-secondary"
              style={{
                borderRadius: "999px",
                padding: "10px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-label)",
                fontSize: "12px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {t.home}
            </button>
            <button
              type="button"
              onClick={handleNewDNA}
              className="btn-primary"
              style={{
                borderRadius: "999px",
                padding: "10px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-label)",
                fontSize: "12px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {t.new_dna}
            </button>
          </div>
        </div>

        <div
          style={{
            border: "1px solid var(--br)",
            borderRadius: "18px",
            background: "var(--sf)",
            padding: "18px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              color: "var(--mu)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            {t.dna_types}
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "clamp(30px, 6vw, 52px)",
              color: "var(--go)",
              lineHeight: 1.05,
            }}
          >
            {localisedDNA.name}
          </h2>
          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "var(--cr)",
              fontSize: "20px",
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            {localisedDNA.desc}
          </p>
          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "var(--mu)",
              fontSize: "12px",
              fontFamily: "var(--font-dm-mono), monospace",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {(dnaInfo?.directors || []).join(" / ")}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <article
            style={{
              border: "1px solid var(--br)",
              borderRadius: "14px",
              background: "var(--sf)",
              padding: "14px",
            }}
          >
            <div
              style={{
                color: "var(--mu)",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              {t.unique_films}
            </div>
            <div
              style={{
                color: "var(--gl)",
                fontSize: "40px",
                lineHeight: 1,
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              {listHistory.length} / 50
            </div>
          </article>

          <article
            style={{
              border: "1px solid var(--br)",
              borderRadius: "14px",
              background: "var(--sf)",
              padding: "14px",
            }}
          >
            <div
              style={{
                color: "var(--mu)",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              {t.era_preference}
            </div>
            <div
              style={{
                color: "var(--gl)",
                fontSize: "28px",
                lineHeight: 1,
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              {lastResult?.era || t.eras[0]}
            </div>
          </article>
        </div>

        <div
          style={{
            border: "1px solid var(--br)",
            borderRadius: "16px",
            background: "var(--sf)",
            padding: "14px",
          }}
        >
          <div
            style={{
              color: "var(--mu)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            {t.history_title}
          </div>

          <div
            style={{
              maxHeight: "420px",
              overflowY: "auto",
              display: "grid",
              gap: "10px",
              paddingRight: "4px",
            }}
          >
            {listHistory.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  color: "var(--mu)",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "20px",
                }}
              >
                {t.no_history_long}
              </p>
            ) : (
              listHistory.map((item, idx) => (
                <button
                  type="button"
                  onClick={() => router.push(`/result?index=${idx}`)}
                  key={`${item?.timestamp || item?.createdAt || "item"}-${idx}`}
                  style={{
                    border: "1px solid var(--br)",
                    borderRadius: "12px",
                    background: "var(--bk)",
                    padding: "10px 12px",
                    display: "grid",
                    gridTemplateColumns: "58px 1fr",
                    gap: "10px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "58px",
                      height: "82px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--br)",
                      background: "var(--sf)",
                    }}
                  >
                    {item?.film?.poster ? (
                      <img
                        src={item.film.poster}
                        alt={item?.film?.title || "Poster"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : null}
                  </div>
                  <div style={{ display: "grid", gap: "4px" }}>
                    <strong
                      style={{
                        color: "var(--gl)",
                        fontFamily: "var(--font-body)",
                        fontSize: "22px",
                        fontStyle: "italic",
                        fontWeight: 500,
                      }}
                    >
                      {item?.film?.title || "—"}
                    </strong>
                    <span
                      style={{
                        color: "var(--mu)",
                        fontFamily: "var(--font-label)",
                        fontSize: "11px",
                      }}
                    >
                      {item?.film?.year || "----"}
                      {item?.film?.director ? ` • ${item.film.director}` : ""}
                    </span>
                    <span
                      style={{
                        color: "var(--mu)",
                        fontFamily: "var(--font-label)",
                        fontSize: "11px",
                      }}
                    >
                      {formatDate(item?.timestamp || item?.createdAt, lang)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

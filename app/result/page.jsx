"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DNA_TYPES, getDNAStrings } from "@/lib/dna";
import TopBackButton from "@/components/TopBackButton";
import { useLanguage } from "@/lib/LanguageContext";

export default function ResultPage() {
  return (
    <Suspense>
      <ResultPageInner />
    </Suspense>
  );
}

function ResultPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const normalizeHistoryEntry = (entry = {}) => {
    const film = entry?.film || {};
    return {
      film,
      dnaKey: entry?.dnaKey || "",
      dnaName: entry?.dnaName || entry?.dnaType || "",
      dnaDesc: entry?.dnaDesc || "",
      mood: entry?.mood || "",
      era: entry?.era || t.eras[0],
      inputFilms: Array.isArray(entry?.inputFilms) ? entry.inputFilms : [],
      createdAt: entry?.timestamp || entry?.createdAt || new Date().toISOString(),
    };
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cinedna:lastResult");
      const parsedLast = saved ? JSON.parse(saved) : null;
      const parsedHistory = JSON.parse(
        localStorage.getItem("cinedna_history") ||
        localStorage.getItem("cinedna:history") ||
        "[]"
      );
      const historyArray = Array.isArray(parsedHistory) ? parsedHistory : [];
      setHistory(historyArray);

      const rawIndex = searchParams.get("index");
      const parsedIndex = rawIndex !== null ? Number(rawIndex) : NaN;
      const validIndexed =
        Number.isInteger(parsedIndex) &&
        parsedIndex >= 0 &&
        parsedIndex < historyArray.length;

      if (validIndexed) {
        setHistoryIndex(parsedIndex);
        setResult(normalizeHistoryEntry(historyArray[parsedIndex]));
      } else if (parsedLast) {
        setHistoryIndex(null);
        setResult(parsedLast);
      } else if (historyArray.length > 0) {
        setHistoryIndex(0);
        setResult(normalizeHistoryEntry(historyArray[0]));
      } else {
        router.replace("/onboarding");
      }
    } catch {
      router.replace("/onboarding");
    }
  }, [router, searchParams]);

  const localisedDNA = useMemo(() => {
    if (!result?.dnaKey) return { name: result?.dnaName || "", desc: result?.dnaDesc || "" };
    return getDNAStrings(result.dnaKey, lang);
  }, [result?.dnaKey, result?.dnaName, result?.dnaDesc, lang]);

  const handleShare = async () => {
    const text = lang === "en"
      ? `My cinematic DNA is "${localisedDNA.name}" — ${result.film?.title} (${result.film?.year})`
      : `Το κινηματογραφικό μου DNA είναι "${localisedDNA.name}" — ${result.film?.title} (${result.film?.year})`;
    const ogParams = new URLSearchParams({ dna: result.dnaKey || "d", lang, film: result.film?.title || "" });
    const url = `https://cinedna-pi.vercel.app?og=${ogParams.toString()}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "CineDNA", text, url: "https://cinedna-pi.vercel.app" });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      await navigator.clipboard.writeText(`${text}\nhttps://cinedna-pi.vercel.app`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rerollRecommendation = async () => {
    if (!result || historyIndex !== null) return;

    const currentHistory = JSON.parse(
      localStorage.getItem("cinedna_history") ||
      localStorage.getItem("cinedna:history") ||
      "[]"
    );
    if (currentHistory.length >= 50) {
      setError(lang === "en"
        ? "You have reached the maximum of 50 recommendations for this DNA profile."
        : "Έχεις φτάσει το όριο των 50 συστάσεων για αυτό το προφίλ DNA."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const shownIds = JSON.parse(localStorage.getItem("cinedna:shownFilmIds") || "[]");

      const payload = {
        films: result.inputFilms ?? [],
        mood: result.mood ?? "",
        era: result.era ?? t.eras[0],
        lang,
        excludeIds: shownIds,
        lockedDnaKey: result.dnaKey,
      };

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.reroll_fail);
      }

      const nextResult = {
        ...data,
        dnaKey: result.dnaKey,
        dnaName: result.dnaName,
        dnaDesc: result.dnaDesc,
        inputFilms: payload.films,
        mood: payload.mood,
        era: payload.era,
        createdAt: new Date().toISOString(),
      };

      const nextHistoryEntry = {
        film: data.film,
        dnaType: result.dnaName,
        dnaKey: result.dnaKey,
        dnaName: result.dnaName,
        dnaDesc: result.dnaDesc,
        mood: payload.mood,
        era: payload.era,
        why: data?.film?.why || "",
        inputFilms: payload.films,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("cinedna:lastResult", JSON.stringify(nextResult));

      if (data?.film?.id) {
        const nextShown = Array.from(new Set([data.film.id, ...shownIds]));
        localStorage.setItem("cinedna:shownFilmIds", JSON.stringify(nextShown));
      }

      const prevHistory = JSON.parse(
        localStorage.getItem("cinedna_history") ||
        localStorage.getItem("cinedna:history") ||
        "[]"
      );
      const nextHistory = [nextHistoryEntry, ...prevHistory].slice(0, 50);
      localStorage.setItem("cinedna_history", JSON.stringify(nextHistory));
      localStorage.setItem("cinedna:history", JSON.stringify(nextHistory));

      setResult(nextResult);
      setHistory(nextHistory);
    } catch (err) {
      setError(err?.message || t.generic_error);
    } finally {
      setLoading(false);
    }
  };

  if (!result) return null;

  const dna = DNA_TYPES[result.dnaKey] ?? null;
  const directors = dna?.directors?.join(" / ") || "";
  const isHistoryMode = historyIndex !== null;

  const effectiveIndex = isHistoryMode ? historyIndex : 0;
  const displayedPosition = history.length - effectiveIndex;
  const showNavArrows = history.length >= 2;
  const canGoOlder = showNavArrows && effectiveIndex < history.length - 1;
  const canGoNewer = showNavArrows && effectiveIndex > 0;

  // FIX: Newer navigation — when going from history mode back to newest,
  // route to /result (no ?index) so user exits history mode and can reroll
  const handleGoNewer = () => {
    if (!canGoNewer) return;
    const nextIndex = effectiveIndex - 1;
    if (nextIndex === 0) {
      // Arrived at newest — exit history mode
      router.push("/result");
    } else {
      router.push(`/result?index=${nextIndex}`);
    }
  };

  const handleGoOlder = () => {
    if (!canGoOlder) return;
    router.push(`/result?index=${effectiveIndex + 1}`);
  };

  const currentCount = history.length;
  const atLimit = currentCount >= 50;

  const watchOptions = result?.film?.watchOptions;
  const hasProviders =
    watchOptions &&
    ((watchOptions.flatrate && watchOptions.flatrate.length > 0) ||
     (watchOptions.rent && watchOptions.rent.length > 0) ||
     (watchOptions.buy && watchOptions.buy.length > 0));

  const L = lang === "en"
    ? { streamLabel: "Where to watch", streamIn: "Streaming", rentIn: "Rent", buyIn: "Buy", notAvailable: "Not available on streaming in your region" }
    : { streamLabel: "Πού να τη δεις", streamIn: "Streaming", rentIn: "Ενοικίαση", buyIn: "Αγορά", notAvailable: "Δεν βρέθηκε σε streaming στη χώρα σου" };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        padding: "28px",
      }}
    >
      <TopBackButton href={isHistoryMode ? "/profile" : "/onboarding"} />
      <section style={{ width: "100%", maxWidth: "980px", margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            color: "var(--mu)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "14px",
            marginTop: "34px",
          }}
        >
          {t.dna_label}
        </div>

        <h1
          style={{
            margin: 0,
            color: "var(--go)",
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "clamp(38px, 7vw, 72px)",
            lineHeight: 1.05,
          }}
        >
          {localisedDNA.name}
        </h1>

        <p
          style={{
            marginTop: "14px",
            marginBottom: "10px",
            fontSize: "20px",
            maxWidth: "46ch",
            color: "var(--cr)",
            fontFamily: "var(--font-cormorant), serif",
            lineHeight: 1.5,
          }}
        >
          {localisedDNA.desc}
        </p>

        <p
          style={{
            margin: 0,
            color: "var(--mu)",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {directors}
        </p>

        {/* FILM CARD — mobile responsive */}
        <article
          className="film-card"
          style={{
            marginTop: "28px",
            border: "1px solid var(--br)",
            background: "var(--sf)",
            borderRadius: "18px",
            padding: "16px",
          }}
        >
          <div className="film-card-grid">
            <div className="film-poster">
              {result.film?.poster ? (
                <img
                  src={result.film.poster}
                  alt={result.film.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : null}
            </div>
            <div>
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "6px",
                  fontSize: "32px",
                  lineHeight: 1.1,
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                }}
              >
                {result.film?.title}
              </h2>
              <div
                style={{
                  color: "var(--mu)",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                {result.film?.year || "----"}
                {result.film?.director ? ` • ${result.film.director}` : ""}
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--cr)",
                  fontSize: "18px",
                  fontFamily: "var(--font-cormorant), serif",
                  lineHeight: 1.5,
                }}
              >
                {result.film?.why}
              </p>
            </div>
          </div>
        </article>

        {/* STREAMING PROVIDERS */}
        <div
          style={{
            marginTop: "20px",
            border: "1px solid var(--br)",
            background: "var(--sf)",
            borderRadius: "18px",
            padding: "16px",
          }}
        >
          <div
            style={{
              color: "var(--go)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {L.streamLabel}
            {result.film?.watchCountry ? ` · ${result.film.watchCountry}` : ""}
          </div>

          {hasProviders ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {watchOptions.flatrate && watchOptions.flatrate.length > 0 && (
                <ProviderRow label={L.streamIn} providers={watchOptions.flatrate} />
              )}
              {watchOptions.rent && watchOptions.rent.length > 0 && (
                <ProviderRow label={L.rentIn} providers={watchOptions.rent} />
              )}
              {watchOptions.buy && watchOptions.buy.length > 0 && (
                <ProviderRow label={L.buyIn} providers={watchOptions.buy} />
              )}
              {watchOptions.link && (
                <a
                  href={watchOptions.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--gl)",
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginTop: "4px",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--gl)",
                    alignSelf: "start",
                    paddingBottom: "2px",
                  }}
                >
                  {lang === "en" ? "More info →" : "Περισσότερα →"}
                </a>
              )}
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                color: "var(--mu)",
                fontSize: "14px",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
              }}
            >
              {L.notAvailable}
            </p>
          )}
        </div>

        {showNavArrows && (
          <div style={{ marginTop: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              disabled={!canGoOlder}
              onClick={handleGoOlder}
              className="history-nav-arrow"
              style={{ opacity: canGoOlder ? 1 : 0.2 }}
              title={lang === "en" ? "Older" : "Προηγούμενη"}
            >
              ←
            </button>
            <span
              style={{
                color: "var(--mu)",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.05em",
              }}
            >
              {displayedPosition} / {history.length}
            </span>
            <button
              type="button"
              disabled={!canGoNewer}
              onClick={handleGoNewer}
              className="history-nav-arrow"
              style={{ opacity: canGoNewer ? 1 : 0.2 }}
              title={lang === "en" ? "Newer" : "Επόμενη"}
            >
              →
            </button>
          </div>
        )}

        {!isHistoryMode && (
          <div
            style={{
              marginTop: "10px",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              color: atLimit ? "#cf6c6c" : "var(--mu)",
              letterSpacing: "0.05em",
            }}
          >
            {atLimit
              ? (lang === "en"
                ? "50/50 — Maximum reached. Start a new DNA profile to continue."
                : "50/50 — Έφτασες στο όριο. Ξεκίνα νέο DNA για να συνεχίσεις.")
              : `${currentCount} / 50`}
          </div>
        )}

        {error && (
          <p
            style={{
              color: "#cf6c6c",
              marginTop: "10px",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "12px",
            }}
          >
            {error}
          </p>
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={loading || isHistoryMode || atLimit}
            onClick={rerollRecommendation}
            className="btn-primary"
            style={{
              borderRadius: "999px",
              padding: "12px 18px",
              cursor: loading || isHistoryMode || atLimit ? "not-allowed" : "pointer",
              fontFamily: "var(--font-label)",
              fontSize: "12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: loading || isHistoryMode || atLimit ? 0.5 : 1,
            }}
          >
            {loading ? (lang === "en" ? "Loading..." : "Φορτώνει...") : t.another}
          </button>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="btn-secondary"
            style={{
              borderRadius: "999px",
              padding: "12px 18px",
              cursor: "pointer",
              fontFamily: "var(--font-label)",
              fontSize: "12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {t.profile_tab}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="btn-secondary"
            style={{
              borderRadius: "999px",
              padding: "12px 18px",
              cursor: "pointer",
              fontFamily: "var(--font-label)",
              fontSize: "12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {copied
              ? (lang === "en" ? "Copied!" : "Αντιγράφηκε!")
              : (lang === "en" ? "Share" : "Κοινοποίηση")}
          </button>
        </div>

        {isHistoryMode && (
          <p style={{
            marginTop: "10px",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "11px",
            color: "var(--mu)",
            letterSpacing: "0.05em",
          }}>
            {lang === "en"
              ? "← → Navigate history · Go to newest to get a new recommendation"
              : "← → Πλοήγηση ιστορικού · Πήγαινε στην πιο πρόσφατη για νέα σύσταση"}
          </p>
        )}

        <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--br)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <a
            href="https://forms.gle/UmJXTXYnsZUbsCoZ9"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              color: "var(--go)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "1px solid rgba(196,150,42,0.3)",
              paddingBottom: "2px",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderBottomColor = "var(--go)"}
            onMouseLeave={e => e.currentTarget.style.borderBottomColor = "rgba(196,150,42,0.3)"}
          >
            {lang === "el" ? "Πες μας τη γνώμη σου →" : "Share your feedback →"}
          </a>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("cinedna:lastResult");
              localStorage.removeItem("cinedna:shownFilmIds");
              localStorage.removeItem("cinedna_history");
              localStorage.removeItem("cinedna:history");
              router.push("/onboarding");
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--mu)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: 0,
              textDecoration: "none",
              borderBottom: "1px solid var(--br)",
              paddingBottom: "2px",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--cr)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--mu)"}
          >
            {lang === "el" ? "Νέο DNA →" : "New DNA →"}
          </button>
        </div>
      </section>

      <style jsx>{`
        .history-nav-arrow {
          border: none;
          background: transparent;
          color: #444;
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
          padding: 10px 16px;
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          transition: background 140ms ease, color 140ms ease;
        }
        .history-nav-arrow:hover:not(:disabled) {
          color: #c4962a;
          background: rgba(196,150,42,0.08);
        }
        .film-card-grid {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 14px;
        }
        .film-poster {
          width: 120px;
          height: 174px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--bk);
          border: 1px solid var(--br);
        }
        @media (max-width: 520px) {
          .film-card-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .film-poster {
            width: 100%;
            max-width: 220px;
            height: auto;
            aspect-ratio: 2 / 3;
            margin: 0 auto;
          }
        }
      `}</style>
    </main>
  );
}

function ProviderRow({ label, providers }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <span
        style={{
          color: "var(--mu)",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          minWidth: "80px",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {providers.map((p, idx) => (
          <div
            key={`${p.name}-${idx}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid var(--br)",
              borderRadius: "999px",
              padding: "4px 10px 4px 4px",
              background: "var(--bk)",
            }}
            title={p.name}
          >
            {p.logo ? (
              <img
                src={p.logo}
                alt={p.name}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            ) : null}
            <span
              style={{
                color: "var(--cr)",
                fontSize: "12px",
                fontFamily: "var(--font-label), monospace",
              }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

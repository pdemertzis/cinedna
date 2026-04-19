"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FilmInput from "@/components/FilmInput";
import MoodCard from "@/components/MoodCard";
import EraCard from "@/components/EraCard";
import TopBackButton from "@/components/TopBackButton";
import { useLanguage } from "@/lib/LanguageContext";

export default function OnboardingPage() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [films, setFilms] = useState(Array.from({ length: 5 }, () => ({ id: null, title: "" })));
  const [mood, setMood] = useState("");
  const [era, setEra] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedFilms = useMemo(
    () => films.filter((film) => film.id && film.title.trim()),
    [films],
  );
  const selectedFilmTitles = useMemo(
    () => selectedFilms.map((film) => film.title.trim()),
    [selectedFilms],
  );

  const canGoStep2 = selectedFilms.length >= 3;
  const canGoStep3 = Boolean(mood);
  const canSubmit = Boolean(era) && selectedFilms.length >= 3;

  const goToStep = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateFilm = (index, film) => {
    setFilms((prev) => prev.map((item, i) => (i === index ? { id: film.id, title: film.title } : item)));
  };

  const runRecommendation = async () => {
    if (!canSubmit) return;

    setStep(4);
    setLoading(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const shownIds = JSON.parse(localStorage.getItem("cinedna:shownFilmIds") || "[]");
      const payload = {
        films: selectedFilmTitles,
        mood,
        era: era || t.eras[0],
        lang,
        excludeIds: shownIds,
      };

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.recommend_fail);
      }

      const resultPayload = {
        ...data,
        mood,
        era,
        inputFilms: selectedFilmTitles,
        createdAt: new Date().toISOString(),
      };
      const historyEntry = {
        film: data.film,
        dnaType: data.dnaName,
        dnaKey: data.dnaKey,
        dnaName: data.dnaName,
        dnaDesc: data.dnaDesc,
        mood,
        era,
        why: data?.film?.why || "",
        inputFilms: selectedFilmTitles,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("cinedna:lastResult", JSON.stringify(resultPayload));
      if (data?.film?.id) {
        const nextShown = Array.from(new Set([data.film.id, ...shownIds]));
        localStorage.setItem("cinedna:shownFilmIds", JSON.stringify(nextShown));
      }

      const prevHistory = JSON.parse(localStorage.getItem("cinedna_history") || localStorage.getItem("cinedna:history") || "[]");
      const nextHistory = [historyEntry, ...prevHistory].slice(0, 50);
      localStorage.setItem("cinedna_history", JSON.stringify(nextHistory));
      localStorage.setItem("cinedna:history", JSON.stringify(nextHistory));

      router.push("/result");
    } catch (err) {
      setError(err?.message || t.generic_error);
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        padding: "28px",
      }}
    >
      <TopBackButton href="/" />
      <section style={{ width: "100%", maxWidth: "920px", margin: "0 auto" }}>

        {step < 4 && (
          <div
            style={{
              marginBottom: "18px",
              color: "var(--mu)",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {t.step_of} {step} / 3
          </div>
        )}

        {step === 1 && (
          <div key="step1" className="step-animate">
            <h1
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "clamp(38px, 7vw, 62px)",
                marginTop: 0,
                marginBottom: "12px",
              }}
            >
              {t.step1_title}
            </h1>
            <p style={{ color: "var(--mu)", marginBottom: "20px", fontSize: "18px" }}>
              {t.step1_sub}
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              {films.map((film, index) => (
                <FilmInput
                  key={index}
                  index={index}
                  value={film}
                  onSelect={updateFilm}
                  placeholder={t.step1_placeholder}
                  optional={index >= 3}
                />
              ))}
            </div>

            <p style={{
              marginTop: "12px",
              marginBottom: 0,
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "11px",
              color: canGoStep2 ? "var(--go)" : "var(--mu)",
              letterSpacing: "0.05em",
              transition: "color 200ms ease",
            }}>
              {selectedFilms.length} / 3 {lang === "en" ? "selected from search" : "επιλεγμένες από αναζήτηση"}
            </p>

            <button
              type="button"
              disabled={!canGoStep2}
              onClick={() => goToStep(2)}
              className="btn-primary"
              style={{
                marginTop: "24px",
                borderRadius: "999px",
                padding: "12px 20px",
                cursor: canGoStep2 ? "pointer" : "not-allowed",
                fontFamily: "var(--font-label)",
                fontSize: "13px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                opacity: canGoStep2 ? 1 : 0.5,
              }}
            >
              {t.continue}
            </button>
          </div>
        )}

        {step === 2 && (
          <div key="step2" className="step-animate">
            <h1
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "clamp(38px, 7vw, 62px)",
                marginTop: 0,
                marginBottom: "12px",
              }}
            >
              {t.step2_title}
            </h1>
            <p style={{ color: "var(--mu)", marginBottom: "20px", fontSize: "18px" }}>{t.step2_sub}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {t.moods.map((moodOption) => (
                <MoodCard
                  key={moodOption.id}
                  label={moodOption.label}
                  selected={mood === moodOption.id}
                  onClick={() => setMood(moodOption.id)}
                  description={moodOption.desc}
                />
              ))}
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="btn-secondary"
                style={{
                  borderRadius: "999px",
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontFamily: "var(--font-label)",
                }}
              >
                {t.previous}
              </button>
              <button
                type="button"
                disabled={!canGoStep3}
                onClick={() => goToStep(3)}
                className="btn-primary"
                style={{
                  borderRadius: "999px",
                  padding: "12px 20px",
                  cursor: canGoStep3 ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-label)",
                  opacity: canGoStep3 ? 1 : 0.5,
                }}
              >
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="step3" className="step-animate">
            <h1
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "clamp(38px, 7vw, 62px)",
                marginTop: 0,
                marginBottom: "12px",
              }}
            >
              {t.step3_title}
            </h1>
            <p style={{ color: "var(--mu)", marginBottom: "20px", fontSize: "18px" }}>{t.step3_sub}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {t.eras.map((label, index) => (
                <EraCard key={label} label={label} selected={era === label} onClick={() => setEra(label)} description={t.era_descs[index]} />
              ))}
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="btn-secondary"
                style={{
                  borderRadius: "999px",
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontFamily: "var(--font-label)",
                }}
              >
                {t.previous}
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={runRecommendation}
                className="btn-primary"
                style={{
                  borderRadius: "999px",
                  padding: "12px 20px",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-label)",
                  opacity: canSubmit ? 1 : 0.5,
                }}
              >
                {t.submit_step}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div
            style={{
              minHeight: "60vh",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "74px",
                height: "74px",
                borderRadius: "999px",
                border: "2px solid var(--go)",
                borderTopColor: "transparent",
                animation: "cinednaSpin 900ms linear infinite",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "42px",
                color: "var(--gl)",
              }}
            >
              {t.loading}
            </h2>
            <p style={{ margin: 0, color: "var(--mu)", fontFamily: "var(--font-dm-mono), monospace" }}>
              {t.analysing_sub}
            </p>
            {!loading && error ? (
              <div style={{ marginTop: "6px" }}>
                <p style={{ color: "#cf6c6c", marginBottom: "10px" }}>{error}</p>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="btn-secondary"
                  style={{
                    borderRadius: "999px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontFamily: "var(--font-label)",
                  }}
                >
                  {t.loading_back}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes cinednaSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

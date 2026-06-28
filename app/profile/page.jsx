"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDNAStrings } from "@/lib/dna";
import TopBackButton from "@/components/TopBackButton";
import { useLanguage } from "@/lib/LanguageContext";
import { createClient } from "@/lib/supabase/client";

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

const TABS = ["recommendations", "watched", "favourites"];

export default function ProfilePage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [tab, setTab] = useState("recommendations");
  // Anonymous localStorage history — shown for logged-out users, and used
  // as the one-time migration source on first login. Read lazily so this
  // doesn't trigger a setState-in-effect render cascade.
  const [history] = useState(() => {
    if (typeof window === "undefined") return [];
    const savedHistory =
      localStorage.getItem("cinedna_history") ||
      localStorage.getItem("cinedna:history");
    if (!savedHistory) return [];
    try {
      const parsed = JSON.parse(savedHistory);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

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
        </div>

        {!user && (
          <div
            style={{
              border: "1px solid var(--br)",
              borderRadius: "16px",
              background: "var(--sf)",
              padding: "18px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--cr)",
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "18px",
              }}
            >
              {t.login_to_save}
            </p>
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="btn-primary"
              style={{
                borderRadius: "999px",
                padding: "10px 18px",
                cursor: "pointer",
                fontFamily: "var(--font-label)",
                fontSize: "12px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {t.login}
            </button>
          </div>
        )}

        {user ? (
          <LoggedInTabs tab={tab} setTab={setTab} lang={lang} t={t} user={user} localHistory={history} />
        ) : (
          <AnonymousHistory history={history} lang={lang} t={t} router={router} />
        )}
      </section>
    </main>
  );
}

function TabBar({ tab, setTab, t }) {
  const labels = {
    recommendations: t.tab_recommendations,
    watched: t.tab_watched,
    favourites: t.tab_favourites,
  };
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "16px", borderBottom: "1px solid var(--br)" }}>
      {TABS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setTab(id)}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: tab === id ? "2px solid var(--go)" : "2px solid transparent",
            color: tab === id ? "var(--gl)" : "var(--mu)",
            padding: "10px 14px",
            cursor: "pointer",
            fontFamily: "var(--font-label)",
            fontSize: "12px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "color 160ms ease, border-color 160ms ease",
          }}
        >
          {labels[id]}
        </button>
      ))}
    </div>
  );
}

function LoggedInTabs({ tab, setTab, lang, t, user, localHistory }) {
  const supabase = useMemo(() => createClient(), []);
  const [recommendations, setRecommendations] = useState([]);
  const [watched, setWatched] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // One-time migration of localStorage history into Supabase on first login.
  useEffect(() => {
    const migrate = async () => {
      if (typeof window === "undefined") return;
      if (localStorage.getItem("cinedna_migrated")) return;
      if (!localHistory || localHistory.length === 0) {
        localStorage.setItem("cinedna_migrated", "1");
        return;
      }
      try {
        const rows = localHistory
          .filter((item) => item?.film?.id)
          .map((item) => ({
            user_id: user.id,
            film_id: item.film.id,
            film_title: item.film.title || "",
            film_poster: item.film.poster || null,
            film_year: item.film.year || null,
            dna_type: item.dnaKey || null,
            why_text: item.why || "",
          }));
        if (rows.length > 0) {
          await supabase.from("recommendations").insert(rows);
        }
      } catch {
        // best-effort migration — ignore failures
      } finally {
        localStorage.setItem("cinedna_migrated", "1");
      }
    };
    migrate();
  }, [localHistory, supabase, user.id]);

  const loadAll = async () => {
    setLoading(true);
    const [recRes, watchedRes, favRes] = await Promise.all([
      supabase.from("recommendations").select("*").order("created_at", { ascending: false }),
      supabase.from("watched_films").select("*").order("added_at", { ascending: false }),
      supabase.from("favourite_films").select("*").order("added_at", { ascending: false }),
    ]);
    setRecommendations(recRes.data || []);
    setWatched(watchedRes.data || []);
    setFavourites(favRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const handleAddWatched = async (movie) => {
    setShowAddModal(false);
    try {
      await supabase.from("watched_films").insert({
        user_id: user.id,
        film_id: movie.id,
        film_title: movie.title,
        film_poster: movie.poster,
        film_year: movie.year,
      });
      loadAll();
    } catch {
      // ignore duplicates / failures
    }
  };

  return (
    <div>
      <TabBar tab={tab} setTab={setTab} t={t} />

      {loading ? (
        <p style={{ color: "var(--mu)", fontFamily: "var(--font-cormorant), serif", fontSize: "18px" }}>
          {t.searching}
        </p>
      ) : tab === "recommendations" ? (
        <RecommendationsList items={recommendations} lang={lang} t={t} />
      ) : tab === "watched" ? (
        <>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn-secondary"
            style={{
              borderRadius: "999px",
              padding: "10px 16px",
              marginBottom: "14px",
              cursor: "pointer",
              fontFamily: "var(--font-label)",
              fontSize: "12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {t.add_film_btn}
          </button>
          <FilmGrid items={watched} emptyText={t.no_watched} />
        </>
      ) : (
        <FilmGrid items={favourites} emptyText={t.no_favourites} />
      )}

      {showAddModal && (
        <AddFilmModal t={t} onClose={() => setShowAddModal(false)} onPick={handleAddWatched} />
      )}
    </div>
  );
}

function RecommendationsList({ items, lang, t }) {
  if (items.length === 0) {
    return (
      <p style={{ margin: 0, color: "var(--mu)", fontFamily: "var(--font-cormorant), serif", fontSize: "20px" }}>
        {t.no_recommendations}
      </p>
    );
  }
  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {items.map((item) => {
        const dnaName = item.dna_type ? getDNAStrings(item.dna_type, lang).name : "";
        return (
          <div
            key={item.id}
            style={{
              border: "1px solid var(--br)",
              borderRadius: "14px",
              background: "var(--sf)",
              padding: "12px",
              display: "grid",
              gridTemplateColumns: "70px 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--br)",
                background: "var(--bk)",
              }}
            >
              {item.film_poster ? (
                <img src={item.film_poster} alt={item.film_title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : null}
            </div>
            <div style={{ display: "grid", gap: "4px", alignContent: "start" }}>
              <strong style={{ color: "var(--gl)", fontFamily: "var(--font-body)", fontSize: "20px", fontStyle: "italic" }}>
                {item.film_title}
              </strong>
              <span style={{ color: "var(--mu)", fontFamily: "var(--font-label)", fontSize: "11px" }}>
                {item.film_year || "----"}
              </span>
              {dnaName && (
                <span
                  className="badge"
                  style={{ width: "fit-content", padding: "4px 10px", fontSize: "10px" }}
                >
                  {dnaName}
                </span>
              )}
              {item.why_text && (
                <p
                  style={{
                    margin: 0,
                    color: "var(--cr)",
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "15px",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.why_text}
                </p>
              )}
              <span style={{ color: "var(--mu)", fontFamily: "var(--font-label)", fontSize: "10px" }}>
                {formatDate(item.created_at, lang)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FilmGrid({ items, emptyText }) {
  if (items.length === 0) {
    return (
      <p style={{ margin: 0, color: "var(--mu)", fontFamily: "var(--font-cormorant), serif", fontSize: "20px" }}>
        {emptyText}
      </p>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "14px" }}>
      {items.map((item) => (
        <div key={item.id} style={{ display: "grid", gap: "6px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "2 / 3",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid var(--br)",
              background: "var(--sf)",
            }}
          >
            {item.film_poster ? (
              <img src={item.film_poster} alt={item.film_title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : null}
          </div>
          <strong style={{ color: "var(--cr)", fontFamily: "var(--font-body)", fontSize: "14px", fontStyle: "italic", lineHeight: 1.2 }}>
            {item.film_title}
          </strong>
          <span style={{ color: "var(--mu)", fontFamily: "var(--font-label)", fontSize: "10px" }}>
            {item.film_year || "----"}
          </span>
        </div>
      ))}
    </div>
  );
}

function AddFilmModal({ t, onClose, onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "440px",
          border: "1px solid var(--br)",
          borderRadius: "16px",
          background: "var(--sf)",
          padding: "20px",
        }}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.step1_placeholder}
          style={{
            width: "100%",
            border: "1px solid var(--br)",
            background: "var(--bk)",
            color: "var(--cr)",
            borderRadius: "12px",
            padding: "12px 14px",
            outline: "none",
            fontSize: "17px",
            fontFamily: "var(--font-cormorant), serif",
            marginBottom: "12px",
          }}
        />
        {loading && (
          <div style={{ color: "var(--mu)", fontFamily: "var(--font-dm-mono), monospace", fontSize: "12px" }}>
            {t.searching}
          </div>
        )}
        <div style={{ display: "grid", gap: "6px", maxHeight: "320px", overflowY: "auto" }}>
          {results.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => onPick(movie)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid var(--br)",
                borderRadius: "10px",
                background: "var(--bk)",
                color: "var(--cr)",
                padding: "8px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ width: "44px", height: "62px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "var(--sf)" }}>
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : null}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontFamily: "var(--font-cormorant), serif" }}>{movie.title}</div>
                <div style={{ fontSize: "11px", color: "var(--go)", fontFamily: "var(--font-dm-mono), monospace" }}>{movie.year || "----"}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnonymousHistory({ history, lang, t, router }) {
  return (
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
        {history.length === 0 ? (
          <p style={{ margin: 0, color: "var(--mu)", fontFamily: "var(--font-cormorant), serif", fontSize: "20px" }}>
            {t.no_history_long}
          </p>
        ) : (
          history.map((item, idx) => (
            <HistoryCard
              key={`${item?.timestamp || item?.createdAt || "item"}-${idx}`}
              item={item}
              lang={lang}
              onClick={() => router.push(`/result?index=${idx}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function HistoryCard({ item, lang, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? "1px solid #666" : "1px solid var(--br)",
        borderRadius: "12px",
        background: "var(--bk)",
        padding: "10px 12px",
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: "12px",
        textAlign: "left",
        cursor: "pointer",
        transition: "border-color 160ms ease",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "112px",
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
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
      </div>
      <div style={{ display: "grid", gap: "4px", alignContent: "start" }}>
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
        <span style={{ color: "var(--mu)", fontFamily: "var(--font-label)", fontSize: "11px" }}>
          {item?.film?.year || "----"}
          {item?.film?.director ? ` • ${item.film.director}` : ""}
        </span>
        <span style={{ color: "var(--mu)", fontFamily: "var(--font-label)", fontSize: "11px" }}>
          {formatDate(item?.timestamp || item?.createdAt, lang)}
        </span>
      </div>
    </button>
  );
}

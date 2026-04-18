"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FilmInput({ index = 0, value, onSelect, placeholder = "" }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(value?.title || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value?.title || "");
  }, [value?.title]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || t.generic_error);
        }

        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch (err) {
        setResults([]);
        setError(err?.message || t.generic_error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handlePick = (movie) => {
    setQuery(movie.title);
    setResults([]);
    setOpen(false);
    setError("");
    onSelect?.(index, { id: movie.id, title: movie.title });
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "var(--mu)",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "12px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {t.film_label} {index + 1}
      </label>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        placeholder={placeholder || t.step1_placeholder}
        style={{
          width: "100%",
          border: "1px solid var(--br)",
          background: "var(--sf)",
          color: "var(--cr)",
          borderRadius: "12px",
          padding: "12px 14px",
          outline: "none",
          fontSize: "17px",
          fontFamily: "var(--font-cormorant), serif",
        }}
      />

      {loading && (
        <div
          style={{
            marginTop: "6px",
            color: "var(--mu)",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
          }}
        >
          {t.searching}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "6px",
            color: "#cf6c6c",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {open && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "8px",
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid var(--br)",
            borderRadius: "14px",
            background: "var(--sf)",
            zIndex: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        >
          {results.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => handlePick(movie)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "none",
                borderBottom: "1px solid var(--br)",
                background: "transparent",
                color: "var(--cr)",
                padding: "10px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "56px",
                  borderRadius: "6px",
                  background: "var(--bk)",
                  border: "1px solid var(--br)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : null}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "18px", fontFamily: "var(--font-cormorant), serif" }}>{movie.title}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--mu)",
                    fontFamily: "var(--font-dm-mono), monospace",
                  }}
                >
                  {movie.year || "----"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

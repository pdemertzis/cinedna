"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FilmInput({ index = 0, value, onSelect, placeholder = "", optional = false }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(value?.title || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const resultRefs = useRef([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value?.title || "");
  }, [value?.title]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
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
        if (!response.ok) throw new Error(data?.error || t.generic_error);
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
        setFocusedIndex(-1);
      } catch (err) {
        setResults([]);
        setError(err?.message || t.generic_error);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handlePick = (movie) => {
    setQuery(movie.title);
    setResults([]);
    setOpen(false);
    setError("");
    setFocusedIndex(-1);
    onSelect?.(index, { id: movie.id, title: movie.title });
  };

  // Typing manually clears the confirmed TMDB selection
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    onSelect?.(index, { id: null, title: val });
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown" && open && results.length > 0) {
      e.preventDefault();
      setFocusedIndex(0);
      resultRefs.current[0]?.focus();
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleResultKeyDown = (e, movie, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePick(movie);
      inputRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx + 1;
      if (next < results.length) {
        setFocusedIndex(next);
        resultRefs.current[next]?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx - 1;
      if (prev >= 0) {
        setFocusedIndex(prev);
        resultRefs.current[prev]?.focus();
      } else {
        setFocusedIndex(-1);
        inputRef.current?.focus();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const isConfirmed = Boolean(value?.id);

  const inputBorder = isConfirmed
    ? "1px solid var(--go)"
    : optional
    ? "1px dashed #3a3a3a"
    : "1px solid var(--br)";

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: isConfirmed ? "var(--go)" : optional ? "#555" : "var(--mu)",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "12px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          transition: "color 160ms ease",
        }}
      >
        {t.film_label} {index + 1} {isConfirmed ? "✓" : ""}
      </label>
      <input
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={() => { if (results.length > 0) setOpen(true); }}
        placeholder={placeholder || t.step1_placeholder}
        style={{
          width: "100%",
          border: inputBorder,
          background: "var(--sf)",
          color: "var(--cr)",
          borderRadius: "12px",
          padding: "12px 14px",
          outline: "none",
          fontSize: "17px",
          fontFamily: "var(--font-cormorant), serif",
          transition: "border-color 160ms ease",
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
          {results.map((movie, idx) => (
            <button
              key={movie.id}
              ref={(el) => { resultRefs.current[idx] = el; }}
              type="button"
              onClick={() => handlePick(movie)}
              onKeyDown={(e) => handleResultKeyDown(e, movie, idx)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "none",
                borderBottom: "1px solid var(--br)",
                background: focusedIndex === idx ? "rgba(196,150,42,0.08)" : "transparent",
                color: "var(--cr)",
                padding: "10px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "90px",
                  borderRadius: "8px",
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
                <div style={{ fontSize: "19px", fontFamily: "var(--font-cormorant), serif", lineHeight: 1.2 }}>{movie.title}</div>
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "13px",
                    color: "var(--go)",
                    fontFamily: "var(--font-dm-mono), monospace",
                    letterSpacing: "0.04em",
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

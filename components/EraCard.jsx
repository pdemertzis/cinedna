"use client";

import { useState } from "react";

export default function EraCard({ label, description = "", selected = false, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "14px",
        padding: "14px 16px",
        cursor: "pointer",
        fontFamily: "var(--font-label)",
        fontSize: "13px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        border: selected
          ? "1px solid var(--gold)"
          : hovered
          ? "1px solid #666"
          : "1px solid var(--br)",
        background: selected ? "var(--gold-bg)" : "transparent",
        color: selected ? "var(--gl)" : "var(--cr)",
        opacity: selected ? 1 : 0.6,
        position: "relative",
        textAlign: "left",
        transition: "var(--transition-fast)",
      }}
    >
      {selected ? (
        <span
          style={{
            position: "absolute",
            top: "8px",
            right: "10px",
            color: "var(--go)",
            fontSize: "14px",
            lineHeight: 1,
          }}
        >
          ✦
        </span>
      ) : null}
      <div>{label}</div>
      {description ? (
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: selected ? "var(--cr)" : "var(--mu)",
            fontFamily: "var(--font-label)",
            letterSpacing: "0.02em",
            textTransform: "none",
          }}
        >
          {description}
        </div>
      ) : null}
    </button>
  );
}

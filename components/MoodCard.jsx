"use client";

import { useState } from "react";

export default function MoodCard({ label, description = "", selected = false, onClick }) {
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
        fontFamily: "var(--font-body)",
        fontSize: "22px",
        fontStyle: "italic",
        border: selected
          ? "1px solid #c4962a"
          : hovered
          ? "1px solid #666"
          : "1px solid var(--br)",
        background: selected ? "rgba(196, 150, 42, 0.12)" : "transparent",
        color: selected ? "#e8c76a" : "var(--cr)",
        position: "relative",
        textAlign: "left",
        transition: "all 160ms ease",
      }}
    >
      {selected ? (
        <span
          style={{
            position: "absolute",
            top: "8px",
            right: "10px",
            color: "#c4962a",
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
            fontSize: "12px",
            fontFamily: "var(--font-label)",
            color: selected ? "#e8dcc8" : "var(--mu)",
            letterSpacing: "0.02em",
          }}
        >
          {description}
        </div>
      ) : null}
    </button>
  );
}

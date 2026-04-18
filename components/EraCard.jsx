"use client";

export default function EraCard({ label, description = "", selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: "14px",
        padding: "14px 16px",
        cursor: "pointer",
        fontFamily: "var(--font-label)",
        fontSize: "13px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        border: selected ? "1px solid #c4962a" : "1px solid var(--br)",
        background: selected ? "rgba(196, 150, 42, 0.12)" : "transparent",
        color: selected ? "#e8c76a" : "var(--cr)",
        opacity: selected ? 1 : 0.6,
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
            fontSize: "11px",
            color: selected ? "#e8dcc8" : "var(--mu)",
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

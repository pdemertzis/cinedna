import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CineDNA — Ανακάλυψε το κινηματογραφικό σου DNA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#080808",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Grid lines decoration */}
        <div style={{ position: "absolute", inset: 0, display: "flex", opacity: 0.06 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ flex: 1, borderRight: "1px solid #c4962a" }} />
          ))}
        </div>

        {/* Gold border frame */}
        <div
          style={{
            position: "absolute",
            inset: 48,
            border: "1px solid #2a2a2a",
            borderRadius: 4,
            display: "flex",
          }}
        />

        {/* DNA symbol */}
        <svg width="72" height="108" viewBox="14 12 52 108">
          <rect x="20" y="18" width="1.8" height="96" fill="#c4962a" opacity="0.9" />
          <rect x="58" y="18" width="1.8" height="96" fill="#c4962a" opacity="0.9" />
          <rect x="20" y="22" width="40" height="1.4" fill="#e8c76a" opacity="0.9" />
          <rect x="20" y="36" width="40" height="1.4" fill="#c4962a" opacity="0.7" />
          <rect x="20" y="50" width="40" height="1.4" fill="#e8c76a" opacity="0.9" />
          <rect x="20" y="64" width="40" height="1.4" fill="#c4962a" opacity="0.7" />
          <rect x="20" y="78" width="40" height="1.4" fill="#e8c76a" opacity="0.9" />
          <rect x="20" y="92" width="40" height="1.4" fill="#c4962a" opacity="0.7" />
          <rect x="20" y="106" width="40" height="1.4" fill="#e8c76a" opacity="0.9" />
          <circle cx="24" cy="22" r="2.5" fill="#080808" />
          <circle cx="58" cy="22" r="2.5" fill="#080808" />
          <circle cx="24" cy="106" r="2.5" fill="#080808" />
          <circle cx="58" cy="106" r="2.5" fill="#080808" />
          <polygon points="40,55 48,66 40,77 32,66" fill="none" stroke="#e8c76a" strokeWidth="1.2" />
          <polygon points="40,59 44,66 40,73 36,66" fill="#c4962a" opacity="0.6" />
          <rect x="14" y="12" width="52" height="108" fill="none" stroke="#2a2a2a" strokeWidth="0.8" rx="2" />
        </svg>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 32,
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontStyle: "italic",
              color: "#e8dcc8",
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            Cine
          </span>
          <span
            style={{
              fontSize: 96,
              fontFamily: "monospace",
              color: "#c4962a",
              letterSpacing: 8,
              lineHeight: 1,
            }}
          >
            DNA
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 320,
            height: 1,
            background: "#2a2a2a",
            marginTop: 16,
            marginBottom: 20,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            fontFamily: "monospace",
            color: "#888",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          FILM · IDENTITY · DISCOVERY
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 26,
            color: "#e8dcc8",
            marginTop: 28,
            opacity: 0.7,
            fontStyle: "italic",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Βάλε 3 ταινίες που αγαπάς. Ανακάλυψε το κινηματογραφικό σου DNA.
        </div>
      </div>
    ),
    { ...size }
  );
}

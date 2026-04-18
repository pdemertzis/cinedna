import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <svg width="90" height="130" viewBox="14 10 52 112">
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
      </div>
    ),
    { ...size }
  );
}

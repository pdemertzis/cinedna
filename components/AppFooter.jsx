"use client";

import Link from "next/link";

export default function AppFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid #2a2a2a",
        padding: "20px 28px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "10px",
          color: "#444",
          letterSpacing: "0.05em",
        }}
      >
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#444", textDecoration: "underline" }}
        >
          TMDB
        </a>
        .
      </p>
      <Link
        href="/privacy"
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "10px",
          color: "#444",
          letterSpacing: "0.05em",
          textDecoration: "none",
          borderBottom: "1px solid #2a2a2a",
          paddingBottom: "1px",
        }}
      >
        Privacy Policy
      </Link>
    </footer>
  );
}

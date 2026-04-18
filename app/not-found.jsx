import Link from "next/link";

export const metadata = {
  title: "404 — CineDNA",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <section>
        <div
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "11px",
            color: "var(--mu)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "clamp(38px, 7vw, 72px)",
            color: "var(--go)",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Η σκηνή δεν βρέθηκε
        </h1>
        <p
          style={{
            marginTop: "16px",
            marginBottom: "32px",
            color: "var(--mu)",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            padding: "12px 24px",
            textDecoration: "none",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--go)",
            border: "1px solid var(--go)",
          }}
        >
          ← Back to CineDNA
        </Link>
      </section>
    </main>
  );
}

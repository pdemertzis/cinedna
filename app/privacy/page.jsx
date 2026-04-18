import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — CineDNA",
};

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        padding: "60px 28px",
      }}
    >
      <section style={{ maxWidth: "680px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "11px",
            color: "var(--mu)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderBottom: "1px solid var(--br)",
            paddingBottom: "2px",
          }}
        >
          ← Back
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "clamp(32px, 6vw, 56px)",
            color: "var(--go)",
            marginTop: "32px",
            marginBottom: "8px",
          }}
        >
          Privacy Policy
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "11px",
            color: "var(--mu)",
            letterSpacing: "0.05em",
            marginBottom: "40px",
          }}
        >
          Last updated: April 2026
        </p>

        <Section title="What we collect">
          <p>
            CineDNA does not require registration and does not store personal data on
            any server. The films you enter, your DNA profile, and your recommendation
            history are stored exclusively in your browser&apos;s localStorage and never
            leave your device.
          </p>
          <p>
            We use{" "}
            <a
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--go)" }}
            >
              Vercel Analytics
            </a>{" "}
            to collect anonymous, aggregated data: page views, device type, and
            country. No personally identifiable information is collected. No cookies
            are set by Vercel Analytics.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            CineDNA uses the{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--go)" }}
            >
              TMDB API
            </a>{" "}
            to search for films and retrieve posters and streaming availability. Queries
            are sent to TMDB servers when you search for a film or request a
            recommendation. TMDB&apos;s own{" "}
            <a
              href="https://www.themoviedb.org/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--go)" }}
            >
              privacy policy
            </a>{" "}
            applies to those requests.
          </p>
        </Section>

        <Section title="Your data">
          <p>
            Because all data is stored in your browser&apos;s localStorage, you can delete
            it at any time by clearing your browser data for this site. There is nothing
            stored server-side to request or delete.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email us at{" "}
            <a href="mailto:pdemertzis@gmail.com" style={{ color: "var(--go)" }}>
              pdemertzis@gmail.com
            </a>
            .
          </p>
        </Section>
      </section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "12px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--mu)",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          lineHeight: 1.6,
          color: "var(--cr)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

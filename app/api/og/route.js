import { ImageResponse } from "next/og";

export const runtime = "edge";

const DNA_LABELS = {
  d:  { el: "Ονειρικός Εξερευνητής",   en: "Dreamy Explorer" },
  st: { el: "Υπαρξιστής Στοχαστής",    en: "Existential Thinker" },
  h:  { el: "Ανθρωπιστής Ρεαλιστής",   en: "Humanist Realist" },
  of: { el: "Οπτικός Φορμαλιστής",     en: "Visual Formalist" },
  r:  { el: "Σκοτεινός Ρομαντικός",    en: "Dark Romantic" },
  c:  { el: "Κοινωνικός Κριτής",       en: "Social Critic" },
  ea: { el: "Επικός Αφηγητής",         en: "Epic Storyteller" },
  op: { el: "Ονειρικός Ψυχαναλυτής",   en: "Psychoanalytic Dreamer" },
  n:  { el: "Ποιητής Φύσης & Χώρου",   en: "Poet of Nature & Space" },
  pp: { el: "Παιχνιδιάρικο Πνεύμα",   en: "Playful Spirit" },
  a:  { el: "Ψυχή του Animation",      en: "Animation Soul" },
  ve: { el: "Βιρτουόζος του Είδους",   en: "Genre Virtuoso" },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dnaKey = searchParams.get("dna") || "d";
  const lang = searchParams.get("lang") === "en" ? "en" : "el";
  const film = searchParams.get("film") || "";

  const label = DNA_LABELS[dnaKey]?.[lang] ?? DNA_LABELS.d[lang];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Gold accent line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#c4962a",
          display: "flex",
        }} />

        {/* CINEDNA label */}
        <div style={{
          color: "#c4962a",
          fontSize: "14px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "32px",
          fontFamily: "monospace",
          display: "flex",
        }}>
          CINEDNA
        </div>

        {/* DNA type */}
        <div style={{
          color: "#e8dcc8",
          fontSize: film ? "64px" : "80px",
          fontStyle: "italic",
          lineHeight: 1.05,
          marginBottom: film ? "24px" : "0",
          display: "flex",
        }}>
          {label}
        </div>

        {/* Film title */}
        {film && (
          <div style={{
            color: "#c4962a",
            fontSize: "32px",
            fontStyle: "italic",
            display: "flex",
          }}>
            {film}
          </div>
        )}

        {/* Bottom tagline */}
        <div style={{
          position: "absolute",
          bottom: "48px",
          left: "80px",
          color: "#444",
          fontSize: "14px",
          letterSpacing: "0.1em",
          fontFamily: "monospace",
          display: "flex",
        }}>
          cinedna-pi.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

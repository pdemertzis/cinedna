import { ImageResponse } from "next/og";

export const runtime = "edge";

const DNA_LABELS = {
  d:  { el: "Ονειρικός Εξερευνητής",   en: "Dreamy Explorer",          dir: "Tarkovsky · Lynch · Malick" },
  st: { el: "Υπαρξιστής Στοχαστής",    en: "Existential Thinker",      dir: "Bergman · Bresson · Haneke" },
  h:  { el: "Ανθρωπιστής Ρεαλιστής",   en: "Humanist Realist",         dir: "De Sica · Cassavetes · Ozu" },
  of: { el: "Οπτικός Φορμαλιστής",     en: "Visual Formalist",         dir: "Kubrick · Eisenstein · Welles" },
  r:  { el: "Σκοτεινός Ρομαντικός",    en: "Dark Romantic",            dir: "Wong Kar-wai · Antonioni" },
  c:  { el: "Κοινωνικός Κριτής",       en: "Social Critic",            dir: "Bong Joon-ho · Loach · Godard" },
  ea: { el: "Επικός Αφηγητής",         en: "Epic Storyteller",         dir: "Lean · Kurosawa · Leone" },
  op: { el: "Ονειρικός Ψυχαναλυτής",   en: "Psychoanalytic Dreamer",   dir: "Buñuel · Polanski · Cronenberg" },
  n:  { el: "Ποιητής Φύσης & Χώρου",   en: "Poet of Nature & Space",   dir: "Herzog · Malick · Kiarostami" },
  pp: { el: "Παιχνιδιάρικο Πνεύμα",   en: "Playful Spirit",           dir: "Tati · Anderson · Coen" },
  a:  { el: "Ψυχή του Animation",      en: "Animation Soul",           dir: "Miyazaki · Chappuis · Clampett" },
  ve: { el: "Βιρτουόζος του Είδους",   en: "Genre Virtuoso",           dir: "Tarantino · De Palma · Carpenter" },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dnaKey = searchParams.get("dna") || "d";
  const lang   = searchParams.get("lang") === "en" ? "en" : "el";
  const film   = searchParams.get("film") || "";

  const dna   = DNA_LABELS[dnaKey] ?? DNA_LABELS.d;
  const label = dna[lang];
  const dir   = dna.dir;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          background: "#080808",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Film strip decoration — left */}
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: "6px",
          background: "repeating-linear-gradient(to bottom,#c4962a 0,#c4962a 20px,transparent 20px,transparent 48px)",
          opacity: 0.15, display: "flex",
        }} />
        {/* Film strip decoration — right */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "6px",
          background: "repeating-linear-gradient(to bottom,#c4962a 0,#c4962a 20px,transparent 20px,transparent 48px)",
          opacity: 0.15, display: "flex",
        }} />

        {/* Top: gold rule + badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ width: "100%", height: "2px", background: "#c4962a", display: "flex" }} />
          <div style={{
            color: "#c4962a", fontSize: "20px", letterSpacing: "0.3em",
            textTransform: "uppercase", fontFamily: "monospace", display: "flex",
          }}>
            CINE · DNA
          </div>
        </div>

        {/* Center: DNA type + film */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <div style={{
            color: "#444", fontSize: "18px", letterSpacing: "0.12em",
            textTransform: "uppercase", fontFamily: "monospace",
            marginBottom: "24px", display: "flex",
          }}>
            {lang === "el" ? "ΤΟ DNA ΣΟΥ" : "YOUR DNA"}
          </div>

          <div style={{
            color: "#c4962a", fontSize: "88px", fontStyle: "italic",
            lineHeight: 1.0, marginBottom: "32px", display: "flex",
            flexWrap: "wrap",
          }}>
            {label}
          </div>

          <div style={{ width: "60px", height: "1px", background: "rgba(196,150,42,0.4)", marginBottom: "28px", display: "flex" }} />

          {film ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{
                color: "#555", fontSize: "18px", letterSpacing: "0.1em",
                textTransform: "uppercase", fontFamily: "monospace", display: "flex",
              }}>
                {lang === "el" ? "ΣYΣΤΑΣΗ" : "RECOMMENDATION"}
              </div>
              <div style={{
                color: "#e8dcc8", fontSize: "48px", fontStyle: "italic",
                lineHeight: 1.1, display: "flex",
              }}>
                {film}
              </div>
            </div>
          ) : (
            <div style={{
              color: "#888", fontSize: "28px", fontStyle: "italic",
              lineHeight: 1.4, maxWidth: "720px", display: "flex", flexWrap: "wrap",
            }}>
              {dir}
            </div>
          )}
        </div>

        {/* Bottom: URL */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <div style={{
            color: "#333", fontSize: "18px", letterSpacing: "0.08em",
            fontFamily: "monospace", display: "flex",
          }}>
            cinedna-pi.vercel.app
          </div>
          <div style={{
            color: "#1a1a1a", fontSize: "14px", letterSpacing: "0.06em",
            fontFamily: "monospace", display: "flex",
          }}>
            FILM · IDENTITY · DISCOVERY
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}

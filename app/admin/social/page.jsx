"use client";

import { useState, useEffect } from "react";

const DNA_LIST = [
  { key: "d",  el: "Ονειρικός Εξερευνητής",   en: "Dreamy Explorer",         desc_el: "Αναζητάς το υπαινικτικό, το ονειρικό και το εσωτερικό ταξίδι της εικόνας.", desc_en: "You seek the suggestive, the dreamlike, and the inner journey of the image." },
  { key: "st", el: "Υπαρξιστής Στοχαστής",    en: "Existential Thinker",     desc_el: "Σε ελκύει ο στοχαστικός κινηματογράφος που θέτει ηθικά και υπαρξιακά ερωτήματα.", desc_en: "You are drawn to thoughtful cinema that poses ethical and existential questions." },
  { key: "h",  el: "Ανθρωπιστής Ρεαλιστής",   en: "Humanist Realist",        desc_el: "Προτιμάς ιστορίες καθημερινών ανθρώπων, με τρυφερότητα και κοινωνική ευαισθησία.", desc_en: "You prefer stories of everyday people, with tenderness and social sensitivity." },
  { key: "of", el: "Οπτικός Φορμαλιστής",     en: "Visual Formalist",        desc_el: "Σε κερδίζει η αυστηρή φόρμα, η γεωμετρία κάδρου και η κινηματογραφική κατασκευή.", desc_en: "You are captivated by strict form, frame geometry, and cinematic construction." },
  { key: "r",  el: "Σκοτεινός Ρομαντικός",    en: "Dark Romantic",           desc_el: "Αγαπάς τη μελαγχολία, τον έρωτα και την ατμόσφαιρα που μένει μετά τους τίτλους τέλους.", desc_en: "You love melancholy, love, and the atmosphere that lingers after the credits roll." },
  { key: "c",  el: "Κοινωνικός Κριτής",       en: "Social Critic",           desc_el: "Θέλεις σινεμά που παρατηρεί δομές εξουσίας και σχολιάζει την κοινωνική πραγματικότητα.", desc_en: "You want cinema that observes power structures and comments on social reality." },
  { key: "ea", el: "Επικός Αφηγητής",         en: "Epic Storyteller",        desc_el: "Σε συναρπάζουν μεγάλες αφηγήσεις, ιστορικά σκηνικά και η δύναμη της κλίμακας.", desc_en: "You are captivated by grand narratives, historical settings, and the power of scale." },
  { key: "op", el: "Ονειρικός Ψυχαναλυτής",   en: "Psychoanalytic Dreamer",  desc_el: "Σε τραβά το υποσυνείδητο, το σουρεαλιστικό και η ψυχολογία ως αφηγηματικό εργαλείο.", desc_en: "You are drawn to the subconscious, the surreal, and psychology as a narrative tool." },
  { key: "n",  el: "Ποιητής Φύσης & Χώρου",   en: "Poet of Nature & Space",  desc_el: "Ψάχνεις ταινίες όπου ο τόπος γίνεται χαρακτήρας — η φύση ως γλώσσα.", desc_en: "You seek films where place becomes character — nature as language." },
  { key: "pp", el: "Παιχνιδιάρικο Πνεύμα",   en: "Playful Spirit",          desc_el: "Αγαπάς τη φαντασία, την ειρωνεία και τις ταινίες που παίζουν με τον ίδιο τον κινηματογράφο.", desc_en: "You love imagination, irony, and films that play with cinema itself." },
  { key: "a",  el: "Ψυχή του Animation",      en: "Animation Soul",          desc_el: "Βλέπεις animation ως τέχνη ισότιμη του live-action — συχνά ανώτερη.", desc_en: "You see animation as an art form equal to live-action — often superior." },
  { key: "ve", el: "Βιρτουόζος του Είδους",   en: "Genre Virtuoso",          desc_el: "Γνωρίζεις τους κανόνες κάθε είδους — και αγαπάς τους σκηνοθέτες που τους ανατρέπουν.", desc_en: "You know the rules of every genre — and love directors who subvert them." },
];

const BASE = "https://cinedna-pi.vercel.app";

export default function AdminSocialPage() {
  const [secret,    setSecret]    = useState("");
  const [authed,    setAuthed]    = useState(false);
  const [authError, setAuthError] = useState("");

  const [dnaKey,    setDnaKey]    = useState("r");
  const [lang,      setLang]      = useState("el");
  const [filmTitle, setFilmTitle] = useState("");
  const [platforms, setPlatforms] = useState({ instagram: true, facebook: true, linkedin: true });

  const [posting,   setPosting]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [log,       setLog]       = useState([]);

  // Load log from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cinedna:admin:log");
      if (saved) setLog(JSON.parse(saved));
    } catch {}
  }, []);

  const selectedDna = DNA_LIST.find(d => d.key === dnaKey) ?? DNA_LIST[0];
  const dnaName     = lang === "el" ? selectedDna.el : selectedDna.en;
  const dnaDesc     = lang === "el" ? selectedDna.desc_el : selectedDna.desc_en;

  const imageUrl = `${BASE}/api/og/square?dna=${dnaKey}&lang=${lang}${filmTitle ? `&film=${encodeURIComponent(filmTitle)}` : ""}`;

  const activePlatforms = Object.entries(platforms).filter(([,v]) => v).map(([k]) => k);

  function handleLogin(e) {
    e.preventDefault();
    if (!secret.trim()) { setAuthError("Εισάγετε κωδικό."); return; }
    // Verification happens server-side on first API call
    setAuthed(true);
    setAuthError("");
  }

  async function handlePost() {
    if (activePlatforms.length === 0) return;
    setPosting(true);
    setResult(null);

    try {
      const res = await fetch("/api/social/post", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          dnaKey,
          dnaName,
          dnaDesc,
          filmTitle,
          lang,
          platforms: activePlatforms,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setAuthed(false);
        setAuthError("Λάθος κωδικός.");
        return;
      }

      setResult(data);

      // Append to log
      const entry = {
        ts:        new Date().toISOString(),
        dnaName,
        filmTitle,
        platforms: activePlatforms,
        results:   data.results ?? [],
        errors:    data.errors  ?? [],
      };
      const next = [entry, ...log].slice(0, 20);
      setLog(next);
      try { sessionStorage.setItem("cinedna:admin:log", JSON.stringify(next)); } catch {}
    } catch (err) {
      setResult({ errors: [{ platform: "network", error: err.message }] });
    } finally {
      setPosting(false);
    }
  }

  const S = {
    page:  { minHeight: "100vh", background: "#080808", color: "#e8dcc8", fontFamily: "'DM Mono', monospace", padding: "40px 32px" },
    badge: { display: "inline-block", border: "1px solid #c4962a", color: "#c4962a", borderRadius: "999px", padding: "6px 14px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" },
    h1:    { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(36px,5vw,56px)", margin: "0 0 8px" },
    sub:   { color: "#444", fontSize: "12px", letterSpacing: "0.06em", marginBottom: "40px" },
    card:  { border: "1px solid #2a2a2a", borderRadius: "16px", background: "#111", padding: "24px", marginBottom: "16px" },
    label: { fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: "8px", display: "block" },
    input: { width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 12px", color: "#e8dcc8", fontFamily: "'DM Mono', monospace", fontSize: "13px", outline: "none" },
    select:{ width: "100%", background: "#0c0c0c", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 12px", color: "#e8dcc8", fontFamily: "'DM Mono', monospace", fontSize: "13px", outline: "none" },
    btn:   { border: "1px solid #c4962a", background: "transparent", color: "#e8c76a", borderRadius: "999px", padding: "11px 22px", fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 160ms ease" },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" },
    row:   { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" },
  };

  // ── LOGIN ─────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...S.page, display: "grid", placeItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <div style={S.badge}>CineDNA Admin</div>
          <h1 style={S.h1}>Social Dashboard</h1>
          <p style={S.sub}>Εισάγετε τον κωδικό πρόσβασης.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: "12px" }}>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Admin secret"
              style={S.input}
              autoFocus
            />
            {authError && <p style={{ color: "#cf6c6c", fontSize: "12px", margin: 0 }}>{authError}</p>}
            <button type="submit" style={{ ...S.btn, justifySelf: "start" }}>Είσοδος →</button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        <div style={S.badge}>CineDNA Admin</div>
        <h1 style={S.h1}>Social Dashboard</h1>
        <p style={S.sub}>Post σε Instagram · Facebook · LinkedIn</p>

        <div style={S.grid2}>

          {/* LEFT — composer */}
          <div>
            {/* DNA type */}
            <div style={S.card}>
              <span style={S.label}>DNA Type</span>
              <select value={dnaKey} onChange={e => setDnaKey(e.target.value)} style={S.select}>
                {DNA_LIST.map(d => (
                  <option key={d.key} value={d.key}>{d.el} / {d.en}</option>
                ))}
              </select>
              <p style={{ margin: "10px 0 0", color: "#555", fontSize: "11px", lineHeight: 1.5 }}>
                {dnaDesc}
              </p>
            </div>

            {/* Language */}
            <div style={S.card}>
              <span style={S.label}>Γλώσσα caption</span>
              <div style={S.row}>
                {["el","en"].map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    ...S.btn,
                    background:  lang === l ? "rgba(196,150,42,0.12)" : "transparent",
                    borderColor: lang === l ? "#c4962a" : "#2a2a2a",
                    color:       lang === l ? "#e8c76a" : "#555",
                    padding:     "8px 18px",
                    fontSize:    "11px",
                  }}>
                    {l === "el" ? "Ελληνικά" : "English"}
                  </button>
                ))}
              </div>
            </div>

            {/* Film title (optional) */}
            <div style={S.card}>
              <span style={S.label}>Ταινία (προαιρετικό)</span>
              <input
                value={filmTitle}
                onChange={e => setFilmTitle(e.target.value)}
                placeholder="π.χ. In the Mood for Love"
                style={S.input}
              />
              <p style={{ margin: "8px 0 0", color: "#333", fontSize: "10px" }}>
                Αν συμπληρωθεί, εμφανίζεται στο post και στην εικόνα.
              </p>
            </div>

            {/* Platforms */}
            <div style={S.card}>
              <span style={S.label}>Πλατφόρμες</span>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  { key: "instagram", label: "Instagram" },
                  { key: "facebook",  label: "Facebook" },
                  { key: "linkedin",  label: "LinkedIn" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={platforms[key]}
                      onChange={() => setPlatforms(p => ({ ...p, [key]: !p[key] }))}
                      style={{ accentColor: "#c4962a", width: "14px", height: "14px" }}
                    />
                    <span style={{ fontSize: "12px", color: platforms[key] ? "#e8dcc8" : "#555", letterSpacing: "0.06em" }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={posting || activePlatforms.length === 0}
              style={{
                ...S.btn,
                width:   "100%",
                padding: "14px",
                opacity: posting || activePlatforms.length === 0 ? 0.4 : 1,
                cursor:  posting || activePlatforms.length === 0 ? "not-allowed" : "pointer",
                fontSize: "13px",
              }}
            >
              {posting ? "Αποστολή..." : `Post → ${activePlatforms.join(", ")}`}
            </button>

            {/* Result */}
            {result && (
              <div style={{
                marginTop: "14px",
                border: `1px solid ${result.ok === false || (result.errors?.length > 0) ? "#cf6c6c" : "#2a5a2a"}`,
                borderRadius: "12px",
                background: result.ok === false || (result.errors?.length > 0) ? "rgba(207,108,108,0.06)" : "rgba(42,90,42,0.08)",
                padding: "16px",
              }}>
                {result.results?.map((r, i) => (
                  <div key={i} style={{ color: "#3a8a3a", fontSize: "11px", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    ✓ {r.platform} — ID: {r.id}
                  </div>
                ))}
                {result.errors?.map((e, i) => (
                  <div key={i} style={{ color: "#cf6c6c", fontSize: "11px", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    ✗ {e.platform}: {e.error}
                  </div>
                ))}
                {result.imageUrl && (
                  <a href={result.imageUrl} target="_blank" rel="noreferrer"
                    style={{ display: "block", marginTop: "8px", color: "#c4962a", fontSize: "10px", letterSpacing: "0.05em" }}>
                    Δες εικόνα →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — preview + env status + log */}
          <div>
            {/* Image preview */}
            <div style={S.card}>
              <span style={S.label}>Preview εικόνας (1080×1080)</span>
              <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #1a1a1a" }}>
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt="Preview"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
              <a
                href={imageUrl} target="_blank" rel="noreferrer"
                style={{ display: "inline-block", marginTop: "8px", color: "#c4962a", fontSize: "10px", letterSpacing: "0.05em" }}
              >
                Πλήρης ανάλυση →
              </a>
            </div>

            {/* Env status */}
            <div style={S.card}>
              <span style={S.label}>Env vars — τρέχε /api/social/check για λεπτομέρειες</span>
              <div style={{ display: "grid", gap: "6px" }}>
                {[
                  { key: "META_PAGE_ACCESS_TOKEN",    label: "Meta access token",      hint: "developers.facebook.com → Graph API Explorer" },
                  { key: "META_PAGE_ID",              label: "Facebook Page ID",       hint: "Page Settings → About → Page ID" },
                  { key: "META_INSTAGRAM_ACCOUNT_ID", label: "Instagram Account ID",   hint: "GET /{page-id}?fields=instagram_business_account" },
                  { key: "LINKEDIN_ACCESS_TOKEN",     label: "LinkedIn access token",  hint: "linkedin.com/developers → OAuth2 token" },
                  { key: "LINKEDIN_ORGANIZATION_ID",  label: "LinkedIn Org ID",        hint: "Company page URL → last number" },
                  { key: "ADMIN_SECRET",              label: "Admin secret",           hint: "Vercel env: ADMIN_SECRET" },
                  { key: "CRON_SECRET",               label: "Cron secret",            hint: "Auto-set by Vercel for cron auth" },
                ].map(({ key, label, hint }) => (
                  <div key={key} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid #161616" }}>
                    <span style={{ fontSize: "13px", marginTop: "1px" }}>?</span>
                    <div>
                      <div style={{ fontSize: "10px", color: "#888", letterSpacing: "0.05em" }}>{label}</div>
                      <div style={{ fontSize: "9px", color: "#333", letterSpacing: "0.03em", marginTop: "2px" }}>{hint}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post log */}
            {log.length > 0 && (
              <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ ...S.label, marginBottom: 0 }}>Ιστορικό session</span>
                  <button onClick={() => { setLog([]); try { sessionStorage.removeItem("cinedna:admin:log"); } catch {} }} style={{ background: "transparent", border: "none", color: "#333", cursor: "pointer", fontSize: "10px", letterSpacing: "0.05em" }}>
                    Καθαρισμός
                  </button>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  {log.map((entry, i) => (
                    <div key={i} style={{ border: "1px solid #1a1a1a", borderRadius: "8px", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ color: "#e8dcc8", fontSize: "11px" }}>{entry.dnaName}</span>
                        <span style={{ color: "#333", fontSize: "10px" }}>{new Date(entry.ts).toLocaleTimeString("el-GR")}</span>
                      </div>
                      {entry.filmTitle && <div style={{ color: "#888", fontSize: "10px", marginBottom: "4px" }}>{entry.filmTitle}</div>}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {entry.results.map((r, j) => (
                          <span key={j} style={{ background: "rgba(42,90,42,0.2)", border: "1px solid #1a3a1a", borderRadius: "4px", padding: "2px 6px", fontSize: "9px", color: "#3a8a3a", letterSpacing: "0.05em" }}>
                            ✓ {r.platform}
                          </span>
                        ))}
                        {entry.errors.map((e, j) => (
                          <span key={j} style={{ background: "rgba(207,108,108,0.1)", border: "1px solid #3a1a1a", borderRadius: "4px", padding: "2px 6px", fontSize: "9px", color: "#cf6c6c", letterSpacing: "0.05em" }}>
                            ✗ {e.platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Setup guide */}
        <div style={{ ...S.card, marginTop: "8px" }}>
          <span style={{ ...S.label, color: "#c4962a" }}>Οδηγός ρύθμισης — Vercel env vars</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px", marginTop: "12px" }}>

            <div>
              <div style={{ color: "#888", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Meta (Instagram + Facebook)</div>
              <ol style={{ color: "#444", fontSize: "11px", lineHeight: 2, paddingLeft: "16px" }}>
                <li>developers.facebook.com → Create App → Business</li>
                <li>Add products: Instagram Graph API, Pages API</li>
                <li>Graph API Explorer → Get User Access Token</li>
                <li>Permissions: instagram_content_publish, pages_manage_posts</li>
                <li>Extend to long-lived token (60 days)</li>
                <li>Get Page ID: Page Settings → About</li>
                <li>Get IG ID: GET /{"{page-id}"}?fields=instagram_business_account</li>
              </ol>
            </div>

            <div>
              <div style={{ color: "#888", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>LinkedIn</div>
              <ol style={{ color: "#444", fontSize: "11px", lineHeight: 2, paddingLeft: "16px" }}>
                <li>linkedin.com/developers → Create App</li>
                <li>Associate with CineDNA Company Page</li>
                <li>Products: Share on LinkedIn + Marketing Developer Platform</li>
                <li>Auth → OAuth 2.0 scopes: w_organization_social</li>
                <li>Generate token via OAuth flow</li>
                <li>Org ID: Company Page URL → /company/{"{id}"}</li>
              </ol>
            </div>

            <div>
              <div style={{ color: "#888", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Vercel Env Vars</div>
              <div style={{ color: "#444", fontSize: "11px", lineHeight: 2 }}>
                <div>Vercel Dashboard → Project → Settings → Environment Variables</div>
                <div style={{ marginTop: "8px", display: "grid", gap: "4px" }}>
                  {["META_PAGE_ACCESS_TOKEN","META_PAGE_ID","META_INSTAGRAM_ACCOUNT_ID","LINKEDIN_ACCESS_TOKEN","LINKEDIN_ORGANIZATION_ID","ADMIN_SECRET"].map(v => (
                    <code key={v} style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", color: "#c4962a", display: "block" }}>{v}</code>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Weekly cron info */}
        <div style={{ ...S.card, borderColor: "#1a1a2a" }}>
          <span style={S.label}>Αυτόματο weekly cron</span>
          <p style={{ color: "#555", fontSize: "11px", lineHeight: 1.8, margin: 0 }}>
            Κάθε <strong style={{ color: "#888" }}>Δευτέρα 10:00 UTC</strong> το app κάνει αυτόματα post σε όλες τις πλατφόρμες.
            Κάθε εβδομάδα άλλο DNA type (rotation από τα 12).
            Ο cron τρέχει μόνο σε production (Vercel) — όχι locally.
            Route: <code style={{ color: "#c4962a", fontSize: "10px" }}>GET /api/cron/weekly</code>
          </p>
        </div>

      </div>
    </div>
  );
}

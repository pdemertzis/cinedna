"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { SITE_URL } from "@/lib/siteUrl";
import TopBackButton from "@/components/TopBackButton";

export default function AuthPage() {
  const { lang, t } = useLanguage();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${SITE_URL}/auth/callback` },
    });
    if (authError) setError(t.auth_error);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
    });
    setLoading(false);
    if (authError) {
      setError(t.auth_error);
    } else {
      setSent(true);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bk)",
        color: "var(--cr)",
        padding: "28px",
      }}
    >
      <TopBackButton href="/" />
      <section style={{ width: "100%", maxWidth: "440px", margin: "0 auto" }}>
        <h1
          style={{
            margin: "34px 0 24px",
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "clamp(34px, 7vw, 52px)",
            color: "var(--gl)",
            textAlign: "center",
          }}
        >
          {lang === "en" ? "Welcome to CineDNA" : "Καλώς ήρθες στο CineDNA"}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "20px",
            borderBottom: "1px solid var(--br)",
          }}
        >
          <TabButton active={mode === "signin"} onClick={() => setMode("signin")}>
            {t.signin_tab}
          </TabButton>
          <TabButton active={mode === "magic_link"} onClick={() => setMode("magic_link")}>
            {t.magic_link_tab}
          </TabButton>
        </div>

        <div
          style={{
            border: "1px solid var(--br)",
            borderRadius: "18px",
            background: "var(--sf)",
            padding: "24px",
          }}
        >
          {mode === "signin" ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="btn-primary"
              style={{ width: "100%", borderRadius: "999px", padding: "14px 20px" }}
            >
              {t.google_signin}
            </button>
          ) : sent ? (
            <p
              style={{
                margin: 0,
                color: "var(--gl)",
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "18px",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {t.magic_link_sent}
            </p>
          ) : (
            <form onSubmit={handleMagicLink} style={{ display: "grid", gap: "12px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email_placeholder}
                required
                style={{
                  width: "100%",
                  border: "1px solid var(--br)",
                  background: "var(--bk)",
                  color: "var(--cr)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", borderRadius: "999px", padding: "14px 20px" }}
              >
                {loading ? t.searching : t.continue_with_email}
              </button>
            </form>
          )}

          {error && (
            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                color: "var(--error)",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "12px",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        background: "transparent",
        border: "none",
        borderBottom: active ? "2px solid var(--go)" : "2px solid transparent",
        color: active ? "var(--gl)" : "var(--mu)",
        padding: "10px 8px",
        cursor: "pointer",
        fontFamily: "var(--font-label)",
        fontSize: "12px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "color 160ms ease, border-color 160ms ease",
      }}
    >
      {children}
    </button>
  );
}

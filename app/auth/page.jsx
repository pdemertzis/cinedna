"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { SITE_URL } from "@/lib/siteUrl";
import TopBackButton from "@/components/TopBackButton";
import GdprNotice from "@/components/GdprNotice";

export default function AuthPage() {
  const { lang, t } = useLanguage();
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

      <section style={{ width: "100%", maxWidth: "380px", margin: "0 auto" }}>
        <h1
          style={{
            margin: "56px 0 8px",
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "clamp(32px, 7vw, 48px)",
            lineHeight: 1.15,
            color: "var(--gl)",
            textAlign: "center",
          }}
        >
          {t.auth_heading_1}
          <br />
          {t.auth_heading_2}
        </h1>

        <p
          style={{
            margin: "0 0 36px",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--mu)",
            textAlign: "center",
          }}
        >
          {t.auth_subtitle}
        </p>

        <GdprNotice lang={lang} />

        <button type="button" onClick={handleGoogleSignIn} className="auth-google-btn">
          <GoogleIcon />
          {t.google_signin}
        </button>

        <div className="auth-divider">
          <span>{t.or_divider}</span>
        </div>

        {sent ? (
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
          <form onSubmit={handleMagicLink}>
            <label className="auth-field-label" htmlFor="auth-email">
              {t.email_label}
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email_placeholder}
              required
              className="auth-email-input"
            />
            <button type="submit" disabled={loading} className="auth-magic-btn">
              <EnvelopeIcon />
              {loading ? t.searching : t.send_magic_link}
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
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <p className="auth-consent">
          {t.auth_consent_pre}
          <Link href="/terms">{t.auth_terms}</Link>
          {t.auth_consent_and}
          <Link href="/privacy">{t.auth_privacy}</Link>
          {t.auth_consent_end}
        </p>
      </section>

      <style jsx>{`
        .auth-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          border: none;
          border-radius: 2px;
          background: var(--go);
          color: #0a0a0a;
          font-family: var(--font-dm-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .auth-google-btn:hover {
          background: var(--gl);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(196, 150, 42, 0.35);
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--br);
        }
        .auth-divider span {
          font-family: var(--font-dm-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: var(--mu);
          white-space: nowrap;
        }

        .auth-field-label {
          display: block;
          margin-bottom: 8px;
          font-family: var(--font-dm-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mu);
        }

        .auth-email-input {
          width: 100%;
          background: #181818;
          border: 1px solid rgba(196, 150, 42, 0.25);
          border-radius: 2px;
          color: var(--cr);
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          padding: 12px 14px;
          outline: none;
          transition: var(--transition-fast);
        }
        .auth-email-input:focus {
          border-color: var(--go);
        }

        .auth-magic-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 12px;
          padding: 16px;
          border: 1px solid var(--go);
          border-radius: 2px;
          background: transparent;
          color: var(--gl);
          font-family: var(--font-dm-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .auth-magic-btn:hover:not(:disabled) {
          background: rgba(201, 168, 76, 0.12);
        }
        .auth-magic-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-consent {
          margin: 28px 0 0;
          font-family: var(--font-dm-mono), monospace;
          font-size: 9px;
          line-height: 1.6;
          color: var(--mu);
          text-align: center;
        }
        .auth-consent :global(a) {
          color: var(--mu);
          text-decoration: underline;
        }
        .auth-consent :global(a:hover) {
          color: var(--gl);
        }
      `}</style>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A14.5 14.5 0 0 1 10.89 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 6l9 7 9-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

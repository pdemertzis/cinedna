/**
 * GdprNotice — Drop this component just ABOVE your auth buttons
 * (Google OAuth button + magic link input) on the login/signup page.
 *
 * Usage:
 *   import GdprNotice from "@/components/GdprNotice";
 *   // Inside your login JSX, before the auth buttons:
 *   <GdprNotice lang={lang} />
 *
 * Props:
 *   lang: "el" | "en"  — matches your existing LanguageContext
 */

"use client";

import Link from "next/link";

const strings = {
  el: {
    notice:
      "Συνεχίζοντας, αποδέχεσαι τους",
    terms: "Όρους Χρήσης",
    and: "και την",
    privacy: "Πολιτική Απορρήτου",
    detail:
      "Αποθηκεύουμε μόνο το email σου (για login) και τις προτιμήσεις σου. Δεν υπάρχουν διαφημίσεις ούτε πώληση δεδομένων. Δεδομένα εντός ΕΕ.",
    gdpr: "GDPR",
  },
  en: {
    notice: "By continuing, you accept our",
    terms: "Terms of Use",
    and: "and",
    privacy: "Privacy Policy",
    detail:
      "We store only your email (for login) and your preferences. No ads, no data selling. Data hosted in the EU.",
    gdpr: "GDPR",
  },
};

export default function GdprNotice({ lang = "el" }) {
  const t = strings[lang];

  return (
    <div className="w-full mb-5">
      {/* GDPR badge line */}
      <div className="flex items-start gap-3 p-4 border border-[#2a2a2a] bg-[#0f0f0f]">
        <span className="font-['DM_Mono'] text-[10px] text-[#c9a84c] border border-[#c9a84c]/40 px-1.5 py-0.5 shrink-0 mt-0.5">
          {t.gdpr}
        </span>
        <div>
          <p className="font-['Cormorant_Garamond'] text-sm text-[#b8a890] leading-snug">
            {t.notice}{" "}
            <Link
              href="/terms"
              className="text-[#c9a84c] hover:text-[#e8dcc8] underline underline-offset-2 transition-colors"
            >
              {t.terms}
            </Link>{" "}
            {t.and}{" "}
            <Link
              href="/privacy"
              className="text-[#c9a84c] hover:text-[#e8dcc8] underline underline-offset-2 transition-colors"
            >
              {t.privacy}
            </Link>
            .
          </p>
          <p className="font-['DM_Mono'] text-[10px] text-[#3a3a3a] mt-1.5 leading-relaxed">
            {t.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

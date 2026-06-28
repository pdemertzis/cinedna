"use client";

import { useState } from "react";
import Link from "next/link";

const content = {
  el: {
    lang: "Ελληνικά",
    title: "Πολιτική Απορρήτου",
    subtitle: "Τελευταία ενημέρωση: Ιούνιος 2025",
    intro:
      "Σεβόμαστε τα δεδομένα σου. Αυτή η πολιτική εξηγεί τι μαζεύουμε, γιατί, και πώς μπορείς να τα διαγράψεις.",
    sections: [
      {
        title: "1. Υπεύθυνος Επεξεργασίας",
        body: `Υπεύθυνος επεξεργασίας των προσωπικών σου δεδομένων είναι:\n\nΠέτρος Δεμερτζής\n📧 pdemertzis@gmail.com\n🌐 cinedna.site\n\nΕάν έχεις οποιαδήποτε ερώτηση για τα δεδομένα σου, επικοινώνησε μαζί μας στο παραπάνω email.`,
      },
      {
        title: "2. Δεδομένα που συλλέγουμε",
        body: `Συλλέγουμε **μόνο** αυτά που χρειάζονται για τη λειτουργία της εφαρμογής:

**Αν χρησιμοποιείς χωρίς λογαριασμό (ανώνυμα):**
• Τα αποτελέσματα DNA και οι προτάσεις αποθηκεύονται αποκλειστικά στο localStorage του browser σου — δεν αποστέλλονται πουθενά.

**Αν δημιουργήσεις λογαριασμό (Google OAuth ή magic link):**
• Email address (για ταυτοποίηση)
• Ταινίες που έχεις επιλέξει στο onboarding
• Αποτέλεσμα DNA αρχέτυπου
• Ιστορικό προτάσεων ταινιών
• Timestamp εγγραφής και τελευταίας σύνδεσης

**Τι ΔΕΝ συλλέγουμε ποτέ:**
• Passwords (χρησιμοποιούμε μόνο OAuth / magic link)
• Δεδομένα πληρωμής
• Geolocation
• Δεδομένα τρίτων (contacts, social graph)
• Cookies τρίτων για διαφήμιση`,
      },
      {
        title: "3. Πώς χρησιμοποιούμε τα δεδομένα",
        body: `Τα δεδομένα χρησιμοποιούνται αποκλειστικά για:\n\n• Παροχή των εξατομικευμένων κινηματογραφικών προτάσεων.\n• Αποθήκευση του ιστορικού σου ώστε να συνεχίσεις από εκεί που σταμάτησες σε διαφορετική συσκευή.\n• Αποστολή email εβδομαδιαίας πρότασης — μόνο αν έχεις συναινέσει ρητά.\n\n**Δεν πουλάμε, δεν νοικιάζουμε και δεν μοιραζόμαστε τα δεδομένα σου με τρίτους για εμπορικούς σκοπούς.**`,
      },
      {
        title: "4. Νομική βάση επεξεργασίας (GDPR)",
        body: `Επεξεργαζόμαστε τα δεδομένα σου βάσει:\n\n• **Εκτέλεσης σύμβασης** (άρθ. 6 παρ. 1β GDPR): για την παροχή της υπηρεσίας που ζήτησες.\n• **Συγκατάθεσης** (άρθ. 6 παρ. 1α GDPR): για αποστολή email ενημερώσεων — μπορείς να αποσυρθείς οποτεδήποτε.\n• **Εννόμου συμφέροντος** (άρθ. 6 παρ. 1στ GDPR): για ανάλυση συγκεντρωτικών, ανώνυμων στατιστικών χρήσης.`,
      },
      {
        title: "5. Υποεπεξεργαστές & υποδομή",
        body: `Για τη λειτουργία της εφαρμογής χρησιμοποιούμε:\n\n• **Supabase** (Frankfurt, EU) — authentication και βάση δεδομένων. GDPR-compliant, ISO 27001.\n• **Vercel** (EU edge nodes) — hosting. Δεν αποθηκεύει user data. GDPR-compliant.\n• **TMDB** — δεδομένα ταινιών. Δεν λαμβάνει προσωπικά δεδομένα χρηστών.\n• **Meta / LinkedIn** — αυτόματη δημοσίευση περιεχομένου της εφαρμογής (posts). Δεν κοινοποιούνται δεδομένα χρηστών.\n\nΌλα τα δεδομένα αποθηκεύονται εντός ΕΕ.`,
      },
      {
        title: "6. Cookies & Tracking",
        body: `Χρησιμοποιούμε:\n\n• **Session cookie** (Supabase Auth) — για να παραμένεις συνδεδεμένος. Απαραίτητο για τη λειτουργία.\n• **Vercel Analytics** — ανώνυμη καταμέτρηση επισκεπτών (χωρίς fingerprinting, χωρίς cross-site tracking).\n\nΔΕΝ χρησιμοποιούμε cookies διαφήμισης, Google Analytics ή pixels τρίτων.`,
      },
      {
        title: "7. Τα δικαιώματά σου (GDPR)",
        body: `Ως χρήστης εντός ΕΕ/ΕΟΧ έχεις δικαίωμα:\n\n• **Πρόσβασης** — να ζητήσεις αντίγραφο των δεδομένων σου.\n• **Διόρθωσης** — να διορθώσεις ανακριβή δεδομένα.\n• **Διαγραφής** — να ζητήσεις οριστική διαγραφή του λογαριασμού και όλων των δεδομένων σου (μπορείς να το κάνεις και μόνος σου από τις ρυθμίσεις).\n• **Φορητότητας** — να λάβεις τα δεδομένα σου σε μορφή JSON.\n• **Εναντίωσης** — να αντιταχθείς στην επεξεργασία βάσει εννόμου συμφέροντος.\n• **Ανάκλησης συγκατάθεσης** — οποτεδήποτε, χωρίς αιτιολογία.\n\nΓια άσκηση δικαιωμάτων: pdemertzis@gmail.com — απάντηση εντός 30 ημερών.\n\nΈχεις επίσης δικαίωμα καταγγελίας στην **Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα** (dpa.gr).`,
      },
      {
        title: "8. Διατήρηση δεδομένων",
        body: `• Δεδομένα λογαριασμού: διατηρούνται όσο ο λογαριασμός είναι ενεργός.\n• Ανενεργοί λογαριασμοί (>24 μήνες χωρίς σύνδεση): διαγράφονται αυτόματα μετά από ειδοποίηση.\n• Ανώνυμα (localStorage): δεν φτάνουν ποτέ σε server — διαγράφονται αν σβήσεις το history του browser σου.`,
      },
      {
        title: "9. Ασφάλεια",
        body: `• Όλες οι επικοινωνίες κρυπτογραφούνται με TLS 1.3.\n• Η αποθήκευση στη Supabase γίνεται με encryption at rest.\n• Δεν αποθηκεύουμε passwords (χρησιμοποιούμε OAuth / magic link).\n• Η πρόσβαση στη βάση γίνεται μόνο μέσω Row Level Security (RLS) — κανείς δεν βλέπει τα δεδομένα άλλου.`,
      },
      {
        title: "10. Αλλαγές στην πολιτική",
        body: `Σε περίπτωση ουσιώδους αλλαγής θα σε ειδοποιήσουμε με email (αν έχεις λογαριασμό) τουλάχιστον 14 ημέρες πριν την εφαρμογή της. Η συνέχιση χρήσης μετά την ειδοποίηση αποτελεί αποδοχή των νέων όρων.`,
      },
      {
        title: "11. Επικοινωνία",
        body: `Για οποιοδήποτε ζήτημα απορρήτου:\n📧 pdemertzis@gmail.com\n\nΑπαντούμε εντός 5 εργάσιμων ημερών.`,
      },
    ],
  },
  en: {
    lang: "English",
    title: "Privacy Policy",
    subtitle: "Last updated: June 2025",
    intro:
      "We respect your data. This policy explains what we collect, why, and how you can delete it.",
    sections: [
      {
        title: "1. Data Controller",
        body: `The controller of your personal data is:\n\nPetros Demertzis\n📧 pdemertzis@gmail.com\n🌐 cinedna.site\n\nFor any questions about your data, contact us at the email above.`,
      },
      {
        title: "2. Data We Collect",
        body: `We collect **only** what is necessary to operate the app:

**If you use without an account (anonymously):**
• DNA results and film suggestions are stored exclusively in your browser's localStorage — nothing is sent to our servers.

**If you create an account (Google OAuth or magic link):**
• Email address (for authentication)
• Films you selected during onboarding
• Your DNA archetype result
• Film recommendation history
• Timestamps for registration and last login

**What we NEVER collect:**
• Passwords (we use only OAuth / magic link)
• Payment data
• Geolocation
• Third-party data (contacts, social graph)
• Third-party advertising cookies`,
      },
      {
        title: "3. How We Use Your Data",
        body: `Your data is used solely to:\n\n• Deliver personalised film recommendations.\n• Store your history so you can continue from where you left off on any device.\n• Send a weekly film suggestion email — only if you have explicitly opted in.\n\n**We do not sell, rent, or share your data with third parties for commercial purposes.**`,
      },
      {
        title: "4. Legal Basis for Processing (GDPR)",
        body: `We process your data on the basis of:\n\n• **Contract performance** (Art. 6(1)(b) GDPR): to provide the service you requested.\n• **Consent** (Art. 6(1)(a) GDPR): for sending email updates — you may withdraw at any time.\n• **Legitimate interest** (Art. 6(1)(f) GDPR): for aggregated, anonymous usage analytics.`,
      },
      {
        title: "5. Sub-processors & Infrastructure",
        body: `To operate the app we use:\n\n• **Supabase** (Frankfurt, EU) — authentication and database. GDPR-compliant, ISO 27001.\n• **Vercel** (EU edge nodes) — hosting. Does not store user data. GDPR-compliant.\n• **TMDB** — film data. Does not receive personal user data.\n• **Meta / LinkedIn** — automated publishing of app content (posts). No user data is shared.\n\nAll data is stored within the EU.`,
      },
      {
        title: "6. Cookies & Tracking",
        body: `We use:\n\n• **Session cookie** (Supabase Auth) — to keep you logged in. Strictly necessary.\n• **Vercel Analytics** — anonymous visitor counting (no fingerprinting, no cross-site tracking).\n\nWe do NOT use advertising cookies, Google Analytics, or third-party pixels.`,
      },
      {
        title: "7. Your Rights (GDPR)",
        body: `As a user within the EU/EEA you have the right to:\n\n• **Access** — request a copy of your data.\n• **Rectification** — correct inaccurate data.\n• **Erasure** — request permanent deletion of your account and all data (you can also do this yourself in settings).\n• **Portability** — receive your data in JSON format.\n• **Objection** — object to processing based on legitimate interest.\n• **Withdrawal of consent** — at any time, without justification.\n\nTo exercise your rights: pdemertzis@gmail.com — response within 30 days.\n\nYou also have the right to lodge a complaint with the **Hellenic Data Protection Authority** (dpa.gr).`,
      },
      {
        title: "8. Data Retention",
        body: `• Account data: retained while the account is active.\n• Inactive accounts (>24 months without login): automatically deleted after notification.\n• Anonymous (localStorage): never reaches our servers — deleted when you clear your browser history.`,
      },
      {
        title: "9. Security",
        body: `• All communications are encrypted with TLS 1.3.\n• Supabase storage uses encryption at rest.\n• We store no passwords (we use OAuth / magic link only).\n• Database access is enforced via Row Level Security (RLS) — no user can see another user's data.`,
      },
      {
        title: "10. Changes to This Policy",
        body: `For material changes, we will notify you by email (if you have an account) at least 14 days before the change takes effect. Continued use after notification constitutes acceptance of the updated policy.`,
      },
      {
        title: "11. Contact",
        body: `For any privacy-related matter:\n📧 pdemertzis@gmail.com\n\nWe respond within 5 business days.`,
      },
    ],
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState("el");
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8dcc8]">
      {/* Nav */}
      <nav className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-['Cormorant_Garamond'] text-xl text-[#c9a84c] tracking-widest hover:text-[#e8dcc8] transition-colors"
        >
          CINEDNA
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang("el")}
            className={`font-['DM_Mono'] text-xs px-3 py-1.5 border transition-colors ${
              lang === "el"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a84c]/50 hover:text-[#c9a84c]/70"
            }`}
          >
            ΕΛ
          </button>
          <button
            onClick={() => setLang("en")}
            className={`font-['DM_Mono'] text-xs px-3 py-1.5 border transition-colors ${
              lang === "en"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a84c]/50 hover:text-[#c9a84c]/70"
            }`}
          >
            EN
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="font-['DM_Mono'] text-xs text-[#c9a84c] tracking-[0.2em] uppercase mb-3">
            cinedna.site
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-[#e8dcc8] mb-3">
            {t.title}
          </h1>
          <p className="font-['DM_Mono'] text-xs text-[#4a4a4a] mb-6">{t.subtitle}</p>
          <p className="font-['Cormorant_Garamond'] text-lg text-[#a09070] italic leading-relaxed">
            {t.intro}
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-[#c9a84c]/40 via-[#c9a84c]/10 to-transparent" />
        </div>

        {/* GDPR Quick-summary card */}
        <div className="mb-10 p-5 border border-[#c9a84c]/20 bg-[#c9a84c]/5">
          <p className="font-['DM_Mono'] text-xs text-[#c9a84c] tracking-wider uppercase mb-3">
            {lang === "el" ? "Σύντομη Ανακεφαλαίωση" : "Quick Summary"}
          </p>
          <ul className="space-y-1.5">
            {(lang === "el"
              ? [
                  "✓ Δωρεάν — χωρίς διαφημίσεις, χωρίς πώληση δεδομένων",
                  "✓ Email μόνο για login — τίποτα άλλο χωρίς συγκατάθεση",
                  "✓ Δεδομένα στην ΕΕ (Supabase Frankfurt)",
                  "✓ Μπορείς να διαγράψεις τα πάντα οποτεδήποτε",
                  "✓ Κανένα cookie διαφήμισης ή third-party tracker",
                ]
              : [
                  "✓ Free — no ads, no data selling",
                  "✓ Email for login only — nothing else without consent",
                  "✓ Data in the EU (Supabase Frankfurt)",
                  "✓ You can delete everything at any time",
                  "✓ No advertising cookies or third-party trackers",
                ]
            ).map((item, i) => (
              <li
                key={i}
                className="font-['Cormorant_Garamond'] text-[1rem] text-[#b8a890]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#c9a84c] mb-3">
                {section.title}
              </h2>
              <div className="font-['Cormorant_Garamond'] text-[1.05rem] text-[#b8a890] leading-relaxed whitespace-pre-line">
                {section.body.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="text-[#e8dcc8] font-semibold">
                      {part}
                    </strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-6 items-center">
          <Link
            href="/terms"
            className="font-['DM_Mono'] text-xs text-[#c9a84c] hover:text-[#e8dcc8] transition-colors tracking-wider"
          >
            {lang === "el" ? "→ Όροι Χρήσης" : "→ Terms of Use"}
          </Link>
          <Link
            href="/"
            className="font-['DM_Mono'] text-xs text-[#4a4a4a] hover:text-[#6b6b6b] transition-colors tracking-wider"
          >
            {lang === "el" ? "← Αρχική" : "← Home"}
          </Link>
        </div>
      </main>
    </div>
  );
}

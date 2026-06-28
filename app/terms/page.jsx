"use client";

import { useState } from "react";
import Link from "next/link";

const content = {
  el: {
    lang: "Ελληνικά",
    title: "Όροι Χρήσης",
    subtitle: "Τελευταία ενημέρωση: Ιούνιος 2025",
    intro:
      "Χρησιμοποιώντας το CineDNA αποδέχεσαι τους παρακάτω όρους. Διάβασέ τους — είναι γραμμένοι για να τους καταλαβαίνεις.",
    sections: [
      {
        title: "1. Τι είναι το CineDNA",
        body: `Το CineDNA (cinedna.site) είναι μια δωρεάν εφαρμογή εξατομικευμένων κινηματογραφικών προτάσεων. Μέσα από ένα σύντομο ερωτηματολόγιο, ο αλγόριθμος σου αποδίδει έναν κινηματογραφικό αρχέτυπο ("DNA") και σου προτείνει ταινίες που ταιριάζουν στο προφίλ σου.

Η εφαρμογή αναπτύσσεται και συντηρείται από τον Πέτρο Δεμερτζή (pdemertzis@gmail.com). Δεδομένα ταινιών παρέχονται από το TMDB (The Movie Database), χωρίς επίσημη σχέση με αυτό.`,
      },
      {
        title: "2. Αποδοχή όρων",
        body: `Χρησιμοποιώντας το CineDNA επιβεβαιώνεις ότι:\n\n• Είσαι άνω των 13 ετών (ή έχεις τη συγκατάθεση γονέα/κηδεμόνα αν είσαι κάτω από αυτή την ηλικία).\n• Έχεις διαβάσει και αποδέχεσαι τους παρόντες Όρους Χρήσης και την Πολιτική Απορρήτου.\n• Θα χρησιμοποιείς την εφαρμογή μόνο για νόμιμους, προσωπικούς σκοπούς.`,
      },
      {
        title: "3. Δωρεάν χρήση & δεσμεύσεις",
        body: `Το CineDNA είναι και θα παραμείνει δωρεάν. Δεν υπάρχουν συνδρομές, διαφημίσεις ή πώληση δεδομένων χρηστών.

Διατηρούμε το δικαίωμα να:\n• Αλλάξουμε, παύσουμε ή αναστείλουμε τη λειτουργία της υπηρεσίας οποτεδήποτε.\n• Τροποποιήσουμε τους παρόντες όρους — θα σε ενημερώσουμε με email αν η αλλαγή είναι ουσιώδης.`,
      },
      {
        title: "4. Λογαριασμός & ασφάλεια",
        body: `Μπορείς να χρησιμοποιείς το CineDNA ανώνυμα ή να δημιουργήσεις λογαριασμό μέσω Google OAuth ή magic link email (μέσω Supabase Auth).

Είσαι υπεύθυνος για:\n• Τη διατήρηση της εμπιστευτικότητας του λογαριασμού σου.\n• Κάθε δραστηριότητα που γίνεται μέσω αυτού.\n\nΑν υποψιαστείς μη εξουσιοδοτημένη πρόσβαση, επικοινώνησε άμεσα στο pdemertzis@gmail.com.`,
      },
      {
        title: "5. Πνευματική ιδιοκτησία",
        body: `Το σύστημα 12 κινηματογραφικών αρχέτυπων («DNA»), η αισθητική, οι κειμενικές περιγραφές, ο αλγόριθμος αντιστοίχισης και το σύνολο του κώδικα της εφαρμογής είναι πνευματική ιδιοκτησία του CineDNA / Πέτρου Δεμερτζή.

Τα δεδομένα ταινιών (τίτλοι, αφίσες, περιγραφές) ανήκουν στο TMDB και τους αντίστοιχους δικαιούχους. Απαγορεύεται η αντιγραφή, αναδημοσίευση ή εμπορική αξιοποίηση του περιεχομένου χωρίς γραπτή άδεια.`,
      },
      {
        title: "6. Αποποίηση ευθύνης",
        body: `Οι προτάσεις ταινιών παράγονται αλγοριθμικά και δεν αποτελούν επαγγελματική κριτική. Δεν εγγυόμαστε ότι μια ταινία είναι διαθέσιμη στη χώρα σου ή ότι τα στοιχεία διαθεσιμότητας (π.χ. streaming πλατφόρμα) είναι πάντα επίκαιρα.

Το CineDNA παρέχεται «ως έχει» χωρίς εγγύηση αδιάλειπτης λειτουργίας.`,
      },
      {
        title: "7. Δεσμοί σε τρίτες υπηρεσίες",
        body: `Η εφαρμογή χρησιμοποιεί:\n• **TMDB API** — για δεδομένα ταινιών (tmdb.org).\n• **Supabase** — για authentication και αποθήκευση δεδομένων (supabase.com).\n• **Vercel** — για hosting (vercel.com).\n\nΔεν φέρουμε ευθύνη για τις πολιτικές απορρήτου ή τη λειτουργία αυτών των τρίτων υπηρεσιών.`,
      },
      {
        title: "8. Εφαρμοστέο δίκαιο",
        body: `Οι παρόντες Όροι διέπονται από το ελληνικό δίκαιο. Για οποιαδήποτε διαφορά αρμόδια είναι τα δικαστήρια της Αθήνας.`,
      },
      {
        title: "9. Επικοινωνία",
        body: `Για οποιαδήποτε απορία σχετικά με τους παρόντες Όρους:\n📧 pdemertzis@gmail.com`,
      },
    ],
  },
  en: {
    lang: "English",
    title: "Terms of Use",
    subtitle: "Last updated: June 2025",
    intro:
      "By using CineDNA you agree to the following terms. They are written to be understood, not avoided.",
    sections: [
      {
        title: "1. What is CineDNA",
        body: `CineDNA (cinedna.site) is a free, AI-powered film recommendation app. Through a short questionnaire, the algorithm assigns you a cinematic archetype ("DNA") and suggests films that match your profile.

The app is developed and maintained by Petros Demertzis (pdemertzis@gmail.com). Film data is provided by TMDB (The Movie Database); CineDNA is not officially affiliated with TMDB.`,
      },
      {
        title: "2. Acceptance of Terms",
        body: `By using CineDNA you confirm that:\n\n• You are at least 13 years old (or have parental/guardian consent if under that age).\n• You have read and accept these Terms of Use and the Privacy Policy.\n• You will use the app only for lawful, personal purposes.`,
      },
      {
        title: "3. Free Service & Commitments",
        body: `CineDNA is and will remain free. There are no subscriptions, ads, or sale of user data.

We reserve the right to:\n• Change, pause, or suspend the service at any time.\n• Modify these terms — we will notify you by email if the change is material.`,
      },
      {
        title: "4. Account & Security",
        body: `You may use CineDNA anonymously or create an account via Google OAuth or magic link email (powered by Supabase Auth).

You are responsible for:\n• Maintaining the confidentiality of your account.\n• All activity that occurs under it.\n\nIf you suspect unauthorized access, contact pdemertzis@gmail.com immediately.`,
      },
      {
        title: "5. Intellectual Property",
        body: `The 12-archetype DNA system, the aesthetic, the descriptive texts, the matching algorithm, and the application code are the intellectual property of CineDNA / Petros Demertzis.

Film data (titles, posters, overviews) belongs to TMDB and the respective rights holders. Copying, republishing, or commercial use of any content without written permission is prohibited.`,
      },
      {
        title: "6. Disclaimer",
        body: `Film recommendations are generated algorithmically and do not constitute professional criticism. We do not guarantee that a film is available in your country or that availability data (e.g., streaming platform) is always current.

CineDNA is provided "as is" without any guarantee of uninterrupted availability.`,
      },
      {
        title: "7. Third-Party Services",
        body: `The app uses:\n• **TMDB API** — for film data (tmdb.org).\n• **Supabase** — for authentication and data storage (supabase.com).\n• **Vercel** — for hosting (vercel.com).\n\nWe are not responsible for the privacy policies or operation of these third-party services.`,
      },
      {
        title: "8. Governing Law",
        body: `These Terms are governed by Greek law. Any disputes shall be subject to the exclusive jurisdiction of the courts of Athens, Greece.`,
      },
      {
        title: "9. Contact",
        body: `For any questions about these Terms:\n📧 pdemertzis@gmail.com`,
      },
    ],
  },
};

export default function TermsPage() {
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
            href="/privacy"
            className="font-['DM_Mono'] text-xs text-[#c9a84c] hover:text-[#e8dcc8] transition-colors tracking-wider"
          >
            {lang === "el" ? "→ Πολιτική Απορρήτου" : "→ Privacy Policy"}
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

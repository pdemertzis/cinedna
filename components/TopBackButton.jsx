"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function TopBackButton({ href = "/" }) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="btn-secondary"
      style={{
        position: "fixed",
        top: "72px",
        left: "16px",
        zIndex: 40,
        borderRadius: "999px",
        padding: "8px 14px",
        cursor: "pointer",
        fontFamily: "var(--font-label)",
        fontSize: "12px",
        letterSpacing: "0.06em",
      }}
    >
      {t.back}
    </button>
  );
}

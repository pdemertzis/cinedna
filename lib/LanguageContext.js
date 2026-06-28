"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "./i18n";

const LanguageContext = createContext({
  lang: "el",
  setLang: () => {},
  t: STRINGS.el,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("el");

  useEffect(() => {
    const stored = window.localStorage.getItem("cinedna_lang");
    if (stored === "el" || stored === "en") {
      // Deferred to after mount (not lazy useState init) so SSR and the
      // first client render both produce "el", avoiding a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cinedna_lang", lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: STRINGS[lang] ?? STRINGS.el,
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export { LanguageContext };

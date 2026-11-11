"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANG_COOKIE, translate, type Lang } from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  isAr: boolean;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LangContextValue | null>(null);

function applyDocumentLang(lang: Lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    applyDocumentLang(lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    // Remember the choice for the next visit (the server reads this cookie on page load).
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    applyDocumentLang(next);
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      isAr: lang === "ar",
      setLang,
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

/** Button that switches between Arabic and English. Shows the language it will switch TO. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={
        className ??
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C9A227]/50 px-3 py-2 text-xs font-bold text-[#F2D16B] transition hover:bg-[#C9A227] hover:text-black"
      }
    >
      <span aria-hidden="true">🌐</span>
      {t("lang.switch")}
    </button>
  );
}

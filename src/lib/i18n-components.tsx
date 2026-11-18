import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { writeLangCookie } from "./lang-cookie";
import {
  applyLang,
  DICTS,
  EN,
  I18nContext,
  LANG_KEY,
  useI18n,
  type I18nValue,
  type Lang,
} from "./i18n";

export function I18nProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  // `initialLang` comes from the SSR cookie (via the root route's beforeLoad),
  // so the server HTML, the client hydration pass and the first client render
  // all agree on the same language — no hydration mismatch and no English
  // flash. localStorage is still kept in sync as a fallback.
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    let stored: string | null = null;
    let fromQuery = false;
    try {
      // hreflang links point to ?lang=xx. Honour them so those alternate URLs
      // actually switch language on this statically prerendered site, where
      // the server cannot read a cookie at request time.
      const queryLang = new URLSearchParams(window.location.search).get("lang");
      if (queryLang === "ar" || queryLang === "en") {
        stored = queryLang;
        fromQuery = true;
      } else {
        stored = window.localStorage.getItem(LANG_KEY);
      }
    } catch {
      /* storage unavailable */
    }
    if (stored === "ar") {
      setLangState("ar");
      writeLangCookie("ar");
    } else if (fromQuery && stored === "en") {
      setLangState("en");
      writeLangCookie("en");
    }
  }, []);

  useEffect(() => {
    applyLang(lang);
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    applyLang(next);
    writeLangCookie(next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      let str = DICTS[lang][key] ?? EN[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang],
  );

  const tOr = useCallback(
    (key: string, fallback: string, params?: Record<string, string>) => {
      const found = DICTS[lang][key] ?? EN[key];
      let str = found ?? fallback;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t,
      tOr,
      setLang,
      toggleLang: () => setLang(lang === "en" ? "ar" : "en"),
    }),
    [lang, t, tOr, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "en" ? "Switch to العربية" : "Switch to English"}
      className={`grid size-9 place-items-center rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`}
    >
      {lang === "en" ? "ع" : "EN"}
    </button>
  );
}

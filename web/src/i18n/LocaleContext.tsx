"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  dictionaries,
  formatTemplate,
  type Locale,
  type TranslationKey,
} from "./dictionary";

const STORAGE_KEY = "meetsync.locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall through
  }
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Server-rendered and first client render both use "en"; the real
  // preference is applied post-mount to avoid a hydration mismatch.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Reads navigator/localStorage, which don't exist during SSR — this
    // one-time correction after mount is the only place it can happen.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(detectInitialLocale());
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures — the switch still works for this session
    }
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>) {
    return formatTemplate(dictionaries[locale][key], vars);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

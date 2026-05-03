// src/i18n/LanguageContext.tsx
// Lightweight EN/SV language context — no external dependencies.

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Lang } from "@/data/chapters";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "blix-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage if available, else default to "en"
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return (stored === "sv" || stored === "en") ? stored : "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState(prev => (prev === "en" ? "sv" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

// Static UI strings for buttons, labels, navigation etc.
export const UI_STRINGS = {
  en: {
    story: "Story",
    theory: "Theory",
    build: "Build",
    challenge: "Challenge",
    chapter: "Chapter",
    of: "of",
    sessions: "sessions",
    checkpoint: "Checkpoint",
    concept: "Concept",
    skills: "Skills",
    lgr22Alignment: "Lgr22 alignment",
    sdgGoals: "SDG goals",
    realWorldExamples: "Real world examples",
    newWords: "New words",
    components: "Components",
    step: "Step",
    submitAnswer: "Submit answer",
    skip: "Skip for now",
    hint: "Hint",
    nextStep: "Next",
    previousStep: "Previous",
    languageSwitch: "Switch to Swedish",
  },
  sv: {
    story: "Berättelse",
    theory: "Teori",
    build: "Bygg",
    challenge: "Utmaning",
    chapter: "Lektion",
    of: "av",
    sessions: "lektioner",
    checkpoint: "Avstämning",
    concept: "Begrepp",
    skills: "Förmågor",
    lgr22Alignment: "Lgr22-koppling",
    sdgGoals: "Globala målen",
    realWorldExamples: "Verkliga exempel",
    newWords: "Nya ord",
    components: "Delar",
    step: "Steg",
    submitAnswer: "Skicka svar",
    skip: "Hoppa över",
    hint: "Tips",
    nextStep: "Nästa",
    previousStep: "Föregående",
    languageSwitch: "Byt till engelska",
  },
} as const;

export function useUIStrings() {
  const { lang } = useLanguage();
  return UI_STRINGS[lang];
}

// src/components/LanguageSwitcher.tsx
// EN / SV toggle pill. Drop it into your site header.

import { useLanguage } from "@/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-amber-50 rounded-full text-xs font-medium">
      <span className="px-1 text-amber-900/60" aria-hidden>🌐</span>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full transition ${
          lang === "en"
            ? "bg-orange-500 text-white shadow-sm"
            : "text-amber-900/70 hover:text-amber-900"
        }`}
        aria-pressed={lang === "en"}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => setLang("sv")}
        className={`px-3 py-1 rounded-full transition ${
          lang === "sv"
            ? "bg-orange-500 text-white shadow-sm"
            : "text-amber-900/70 hover:text-amber-900"
        }`}
        aria-pressed={lang === "sv"}
        aria-label="Svenska"
      >
        SV
      </button>
    </div>
  );
}

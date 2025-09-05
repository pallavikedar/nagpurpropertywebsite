"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { englishTranslations } from "@/translations/english";
import { hindiTranslations } from "@/translations/hindi";
import { marathiTranslations } from "@/translations/marathi";

type TranslationsType = typeof englishTranslations;

type LanguageContextType = {
  language: string;
  translations: TranslationsType;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>("");
  const [translations, setTranslations] = useState<TranslationsType>(englishTranslations);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    switch (language) {
      case "hindi":
        setTranslations(hindiTranslations);
        break;
      case "marathi":
        setTranslations(marathiTranslations);
        break;
      default:
        setTranslations(englishTranslations);
    }
    localStorage.setItem("language", language);
  }, [language]);

  const value = { language, translations, setLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/language-context";


export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
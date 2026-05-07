"use client";

import { useState, useEffect } from "react";
import { LanguageProvider, useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import HeroSection from "@/components/hero-section";
import FloatingContact from "@/components/floatingcontact";
import { useRouter } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const { language, translations, setLanguage } = useLanguage();
  const t = translations;
  const [languageSelected, setLanguageSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    if (storedLanguage) {
      setLanguageSelected(true);
    } else {
      setLanguageSelected(false);
    }
    setLoading(false);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    localStorage.setItem("selectedLanguage", lang);
    setLanguageSelected(true);
    setLanguage(lang);
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setSearchTrigger(prev => prev + 1);
    
    // Smooth scroll to properties section
    setTimeout(() => {
      const propertiesSection = document.querySelector('#properties-section');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewAllProperties = () => {
    router.push("/properties");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>{t.Loading}</p>
      </div>
    );
  }

  if (!languageSelected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <LanguageSelector setLanguage={handleLanguageSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection onSearch={handleSearch} />
        
        <section className="py-16 px-4 md:px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                  {t.FeaturedProperties}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {searchFilters 
                    ? "Properties matching your search criteria" 
                    : t.ExploreourhandpickedpropertiesinNagpur}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" onClick={handleViewAllProperties}>
                  {t.ViewAllProperties}
                </Button>
              </div>
            </div>
            
            <PropertyCard filters={searchFilters} searchTrigger={searchTrigger} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}

export default function HomePage() {
  return <HomeContent />;
}

export function LanguageSelector({ setLanguage }: { setLanguage: (lang: string) => void }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Select Your Language</CardTitle>
        <CardDescription>Choose your preferred language</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="h-16 text-lg" onClick={() => setLanguage("english")}>
          English
        </Button>
        <Button variant="outline" className="h-16 text-lg" onClick={() => setLanguage("hindi")}>
          हिन्दी (Hindi)
        </Button>
        <Button variant="outline" className="h-16 text-lg" onClick={() => setLanguage("marathi")}>
          मराठी (Marathi)
        </Button>
      </CardContent>
    </Card>
  );
}
// "use client"
// import { useState,useEffect } from "react"
// import Link from "next/link"
// import { ArrowRight, Building, Home, MapPin } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
// import PropertyCard from "@/components/property-card"
// import HeroSection from "@/components/hero-section"
// import { properties as staticProperties } from "@/lib/data"
// import type { Property } from "@/lib/types"

// export default function HomePage() {
//   // start with static list (fallback)
//   const [data, setData] = useState<Property[]>(staticProperties)

//   useEffect(() => {
//     const stored = localStorage.getItem("properties")
//     if (stored) {
//       try {
//         const localProps = JSON.parse(stored) as Property[]
//         // show localStorage entries first, then static ones
//         setData([...localProps, ...staticProperties])
//       } catch (err) {
//         console.error("Failed to parse stored properties:", err)
//       }
//     }
//   }, [])
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <HeroSection />

//         {/* Featured Properties Section */}
//         <section className="py-16 px-4 md:px-6 bg-white">
//           <div className="container mx-auto">
//             <div className="flex flex-col md:flex-row justify-between items-center mb-12">
//               <div className="animate-fade-in">
//                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Properties</h2>
//                 <p className="mt-2 text-muted-foreground">Explore our handpicked properties in Nagpur</p>
//               </div>
//               <div className="mt-4 md:mt-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
//                 <Link href="/properties">
//                   <Button variant="outline" className="group">
//                     View All Properties
//                     <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                   </Button>
//                 </Link>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {data.map((property, idx) => (
//                 <PropertyCard key={property.id} property={property} index={idx} />
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Services Section */}
//         <section className="py-16 px-4 md:px-6 bg-gray-50">
//           <div className="container mx-auto">
//             <div className="text-center mb-12 animate-fade-up">
//               <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Services</h2>
//               <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
//                 Comprehensive real estate solutions for all your property needs in Nagpur
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div
//                 className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] animate-fade-up"
//                 style={{ animationDelay: "100ms" }}
//               >
//                 <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
//                   <Home className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">Buy Properties</h3>
//                 <p className="text-muted-foreground">
//                   Find your dream home in Nagpur with our extensive listings of residential properties.
//                 </p>
//                 <Link href="/properties?type=buy" className="mt-4 inline-block text-primary font-medium">
//                   Learn more →
//                 </Link>
//               </div>

//               <div
//                 className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] animate-fade-up"
//                 style={{ animationDelay: "200ms" }}
//               >
//                 <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
//                   <Building className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">Rent Properties</h3>
//                 <p className="text-muted-foreground">
//                   Explore rental options that fit your budget and lifestyle in prime Nagpur locations.
//                 </p>
//                 <Link href="/properties?type=rent" className="mt-4 inline-block text-primary font-medium">
//                   Learn more →
//                 </Link>
//               </div>

//               <div
//                 className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px] animate-fade-up"
//                 style={{ animationDelay: "300ms" }}
//               >
//                 <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
//                   <MapPin className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">Legal Consultancy</h3>
//                 <p className="text-muted-foreground">
//                   Expert legal advice for all your property transactions and documentation needs.
//                 </p>
//                 <Link href="/enquiry/legal" className="mt-4 inline-block text-primary font-medium">
//                   Learn more →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-16 px-4 md:px-6 bg-primary text-primary-foreground relative overflow-hidden">
//           <div
//             className="absolute inset-0 bg-cover bg-center opacity-20"
//             style={{
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1920&auto=format&fit=crop')",
//             }}
//           ></div>
//           <div className="container mx-auto relative z-10">
//             <div className="max-w-3xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 animate-fade-up">
//                 List Your Property With Us
//               </h2>
//               <p
//                 className="text-primary-foreground/90 mb-8 text-lg animate-fade-up"
//                 style={{ animationDelay: "100ms" }}
//               >
//                 Whether you're looking to sell or rent out your property, we can help you find the right buyers or
//                 tenants.
//               </p>
//               <div
//                 className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
//                 style={{ animationDelay: "200ms" }}
//               >
//                 <Link href="/add-property">
//                   <Button size="lg" variant="secondary" className="transition-transform hover:scale-105">
//                     Add Your Property
//                   </Button>
//                 </Link>
//                 <Link href="/contact">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="bg-transparent border-white hover:bg-white/10 transition-transform hover:scale-105"
//                   >
//                     Contact Us
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   )
// }
"use client";

import { useState, useEffect } from "react";

import { LanguageProvider, useLanguage } from "@/context/language-context";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import HeroSection from "@/components/hero-section";
import { properties as staticProperties } from "@/lib/data";
import type { Property } from "@/lib/types";

// Separate component for main content
function HomeContent() {
  const { language, translations, setLanguage } = useLanguage()
  const t = translations
  const [languageSelected, setLanguageSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Property[]>(staticProperties);
 

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    if (storedLanguage) {
      setLanguageSelected(true);
    } else {
      setLanguageSelected(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("properties");
    if (stored) {
      try {
        const localProps = JSON.parse(stored) as Property[];
        setData([...localProps, ...staticProperties]);
      } catch (err) {
        console.error("Failed to parse stored properties:", err);
      }
    }
  }, []);

  const handleLanguageSelect = (lang: string) => {
    localStorage.setItem("selectedLanguage", lang);
    setLanguageSelected(true);
    setLanguage(lang);
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
        <HeroSection />
        <section className="py-16 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.FeaturedProperties}</h2>
                <p className="mt-2 text-muted-foreground">{t.ExploreourhandpickedpropertiesinNagpur}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline">{t.ViewAllProperties}</Button>
              </div>
            </div>
           
             
                <PropertyCard  />
            
          
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return <HomeContent />;
}

// Accept setLanguage as prop here
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

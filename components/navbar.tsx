// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//               Nagpur Properties
//             </span>
//           </Link>
//         </div>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
//             Home
//           </Link>
//           <Link href="/properties" className="text-sm font-medium transition-colors hover:text-primary">
//             Properties
//           </Link>
//           <Link href="/add-property" className="text-sm font-medium transition-colors hover:text-primary">
//             Add Property
//           </Link>
//           <Link href="/enquiry/legal" className="text-sm font-medium transition-colors hover:text-primary">
//             Legal Consultancy
//           </Link>
//           <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
//             Contact
//           </Link>
//         </nav>

//         <div className="hidden md:flex items-center gap-4">
//           <Link href="/admin">
//             <Button variant="outline">Admin Login</Button>
//           </Link>
//           <Link href="/enquiry/general">
//             <Button>Enquire Now</Button>
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
//           {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       <div
//         className={cn(
//           "md:hidden fixed inset-0 top-16 z-50 bg-background transition-transform duration-300 ease-in-out",
//           isMenuOpen ? "translate-x-0" : "translate-x-full",
//         )}
//       >
//         <nav className="container flex flex-col gap-6 p-6">
//           <Link
//             href="/"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             href="/properties"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Properties
//           </Link>
//           <Link
//             href="/add-property"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Add Property
//           </Link>
//           <Link
//             href="/enquiry/legal"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Legal Consultancy
//           </Link>
//           <Link
//             href="/contact"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             Contact
//           </Link>
//           <div className="flex flex-col gap-4 mt-4">
//             <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
//               <Button variant="outline" className="w-full">
//                 Admin Login
//               </Button>
//             </Link>
//             <Link href="/enquiry/general" onClick={() => setIsMenuOpen(false)}>
//               <Button className="w-full">Enquire Now</Button>
//             </Link>
//           </div>
//         </nav>
//       </div>
//     </header>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Menu, X, User } from "lucide-react"
// import { LanguageProvider, useLanguage } from "@/context/language-context"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// export default function Navbar() {
//   return <NavbarDashboard />
   
// }
//  function NavbarDashboard() {
//   const { language, translations, setLanguage } = useLanguage()
//   const t = translations
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isLoggedIn, setIsLoggedIn] = useState(false) // Replace with actual authentication logic
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

//   // Simulate fetching login status (replace with actual logic)
//   useEffect(() => {
//     // Example: Check if the user is logged in (replace with real authentication check)
//     const userLoggedIn = Boolean(localStorage.getItem("userLoggedIn")) // Example: Replace with actual logic
//     setIsLoggedIn(userLoggedIn)
//   }, [])

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//               {t.appName}
//             </span>
//           </Link>
//         </div>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
//            {t.home}
//           </Link>
//           <Link href="/properties" className="text-sm font-medium transition-colors hover:text-primary">
//             {t.Properties}
//           </Link>
//           <Link href="/add-property" className="text-sm font-medium transition-colors hover:text-primary">
//             {t.AddProperty}
//           </Link>
//           <Link href="/enquiry/legal" className="text-sm font-medium transition-colors hover:text-primary">
//             {t.LegalConsultancy}
//           </Link>
//           <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
//             {t.Contact}
//           </Link>
//         </nav>

//         <div className="hidden md:flex items-center gap-4">
//           {isLoggedIn ? (
//             <div className="relative">
//               <button
//                 className="flex items-center space-x-2"
//                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                 aria-label="Toggle profile menu"
//               >
//                 <User className="h-6 w-6" />
//               </button>
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
//                   <Link
//                     href="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setIsProfileMenuOpen(false)}
//                   >
//                    {t.Profile}
//                   </Link>
//                   <Link
//                     href="/myproperty"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setIsProfileMenuOpen(false)}
//                   >
//                     {t.MyProperties}
//                   </Link>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => {
//                       // Simulate logout (replace with actual logout logic)
//                       localStorage.removeItem("isLoggedIn")
//                       localStorage.removeItem("usertoken") // Example: Replace with actual logic
//                       setIsLoggedIn(false)
//                       setIsProfileMenuOpen(false)
//                     }}
//                   >
//                     {t.Logout}
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link href="/Login">
//               <Button>{t.Login}</Button>
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
//           {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       <div
//         className={cn(
//           "md:hidden fixed inset-0 top-16 z-50 bg-background transition-transform duration-300 ease-in-out",
//           isMenuOpen ? "translate-x-0" : "translate-x-full",
//         )}
//       >
//         <nav className="container flex flex-col gap-6 p-6">
//           <Link
//             href="/"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             {t.home}
//           </Link>
//           <Link
//             href="/properties"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             {t.Properties}
//           </Link>
//           <Link
//             href="/add-property"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             {t.AddProperty}
//           </Link>
//           <Link
//             href="/enquiry/legal"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             {t.LegalConsultancy}
//           </Link>
//           <Link
//             href="/contact"
//             className="text-lg font-medium transition-colors hover:text-primary"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             {t.Contact}
//           </Link>
//           <div className="flex flex-col gap-4 mt-4">
//             {isLoggedIn ? (
//               <button
//                 className="text-lg font-medium transition-colors hover:text-primary"
//                 onClick={() => {
//                   // Simulate logout (replace with actual logout logic)
//                   localStorage.removeItem("isLoggedIn")
//                   setIsLoggedIn(false)
//                   setIsMenuOpen(false)
//                 }}
//               >
//                 {t.Logout}
//               </button>
//             ) : (
//               <Link href="/Login" onClick={() => setIsMenuOpen(false)}>
//                 <Button className="w-full">{t.Login}</Button>
//               </Link>
//             )}
//           </div>
          
//         </nav>
//       </div>
//     </header>
//   )
// }




"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return <NavbarDashboard />;
}

function NavbarDashboard() {
  const { language, translations, setLanguage } = useLanguage();
  const t = translations;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual authentication logic
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // Simulate fetching login status (replace with actual logic)
  useEffect(() => {
    const userLoggedIn = Boolean(localStorage.getItem("userLoggedIn")); // Example: Replace with actual logic
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang); // Update the language in the context
    localStorage.setItem("language", lang); // Persist the selected language
    setIsLanguageMenuOpen(false); // Close the language dropdown
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t.appName || "Nagpur Properties"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            {t.home || "Home"}
          </Link>
          <Link href="/properties" className="text-sm font-medium transition-colors hover:text-primary">
            {t.Properties || "Properties"}
          </Link>
          <Link href="/add-property" className="text-sm font-medium transition-colors hover:text-primary">
            {t.AddProperty || "Add Property"}
          </Link>
          <Link href="/enquiry/legal" className="text-sm font-medium transition-colors hover:text-primary">
            {t.LegalConsultancy || "Legal Consultancy"}
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            {t.Contact || "Contact"}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              {language === "english" ? "English" : language === "hindi" ? "हिंदी" : "मराठी"}
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleLanguageChange("english")}
                >
                  English
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleLanguageChange("hindi")}
                >
                  हिंदी
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleLanguageChange("marathi")}
                >
                  मराठी
                </button>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle profile menu"
              >
                <User className="h-6 w-6" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.Profile || "Profile"}
                  </Link>
                  <Link
                    href="/myproperty"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.MyProperties || "My Properties"}
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      localStorage.removeItem("isLoggedIn");
                      localStorage.removeItem("usertoken");
                      setIsLoggedIn(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {t.Logout || "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/Login">
              <Button>{t.Login || "Login"}</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
}
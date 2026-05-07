"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, ChevronDown, Home, Building2, PlusCircle, Scale, Phone, Globe, LogOut, UserCircle, Key, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Memoized NavItem for better performance
const NavItem = memo(({ href, label, icon: Icon, isActive }) => (
  <Link
    href={href}
    prefetch={true} // Enable prefetching for instant navigation
    className={cn(
      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
      "hover:text-primary hover:bg-primary/5",
      isActive 
        ? "text-primary bg-primary/10" 
        : "text-gray-600"
    )}
  >
    <span className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="activeNav"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
        transition={{ duration: 0.15 }}
      />
    )}
  </Link>
));

NavItem.displayName = "NavItem";

export default function Navbar() {
  return <NavbarDashboard />;
}

function NavbarDashboard() {
  const { language, translations, setLanguage } = useLanguage();
  const t = translations;
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");
  
  const languageMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check login status - optimized
  useEffect(() => {
    const checkLoginStatus = () => {
      const userToken = localStorage.getItem("usertoken");
      const adminToken = localStorage.getItem("admintoken");
      const token = userToken || adminToken;
      const loggedIn = !!token;
      
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const storedName = localStorage.getItem("userName") || localStorage.getItem("adminName") || "User";
        setUserName(storedName);
      }
    };
    
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Handle scroll effect - passive for performance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change - immediate
  useEffect(() => {
    setIsMenuOpen(false);
    setIsLanguageMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple body scroll lock for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setIsLanguageMenuOpen(false);
  }, [setLanguage]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("admintoken");
    localStorage.removeItem("userName");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("adminEmail");
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    router.push("/");
  }, [router]);

  // Prefetch all important routes on mount for instant navigation
  useEffect(() => {
    const routes = ["/", "/properties", "/add-property", "/enquiry/legal", "/contact"];
    routes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  const navItems = [
    { href: "/", label: t.home || "Home", icon: Home },
    { href: "/properties", label: t.Properties || "Properties", icon: Building2 },
    { href: "/add-property", label: t.AddProperty || "Add Property", icon: PlusCircle },
    { href: "/enquiry/legal", label: t.LegalConsultancy || "Legal Consultancy", icon: Scale },
    { href: "/contact", label: t.Contact || "Contact", icon: Phone },
  ];

  const languages = [
    { code: "english", label: "English", nativeLabel: "English" },
    { code: "hindi", label: "हिंदी", nativeLabel: "Hindi" },
    { code: "marathi", label: "मराठी", nativeLabel: "Marathi" },
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b" 
          : "bg-white/80 backdrop-blur-sm border-b"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group flex-shrink-0"
              aria-label="Home"
              prefetch={true}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/70 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-200" />
                <span className="relative text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent whitespace-nowrap">
                  {t.appName || "Nagpur Properties"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                  />
                );
              })}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Dropdown */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    "hover:text-primary hover:bg-primary/5",
                    isLanguageMenuOpen && "text-primary bg-primary/5"
                  )}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  aria-label="Select language"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLanguage.nativeLabel}</span>
                  <ChevronDown className={cn(
                    "w-3 h-3 transition-transform duration-150",
                    isLanguageMenuOpen && "rotate-180"
                  )} />
                </button>
                
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={cn(
                            "w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-primary/5",
                            language === lang.code && "text-primary bg-primary/5 font-medium"
                          )}
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Section */}
              {isLoggedIn ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150",
                      "hover:bg-primary/5",
                      isProfileMenuOpen && "bg-primary/5"
                    )}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white">
                      <span className="text-sm font-semibold">
                        {userName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "w-3 h-3 text-gray-500 transition-transform duration-150",
                      isProfileMenuOpen && "rotate-180"
                    )} />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Welcome back!</p>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                            prefetch={true}
                          >
                            <UserCircle className="w-4 h-4" />
                            {t.Profile || "Profile"}
                          </Link>
                          <Link
                            href="/myproperty"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                            prefetch={true}
                          >
                            <Briefcase className="w-4 h-4" />
                            {t.MyProperties || "My Properties"}
                          </Link>
                          <Link
                            href="/change-password"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                            prefetch={true}
                          >
                            <Key className="w-4 h-4" />
                            Change Password
                          </Link>
                          <hr className="my-1" />
                          <button
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4" />
                            {t.Logout || "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/Login" prefetch={true}>
                  <Button className="bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all duration-200">
                    <User className="w-4 h-4 mr-2" />
                    {t.Login || "Login"}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative z-[60] w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer - Optimized for fast open/close */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Drawer Panel - Fast spring animation */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400,
                mass: 0.3
              }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[70] lg:hidden overflow-y-auto"
            >
              <div className="p-6 pt-20">
                {/* User Info for Mobile */}
                {isLoggedIn && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white">
                        <span className="text-lg font-semibold">
                          {userName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userName}</p>
                        <p className="text-sm text-gray-500">Welcome back!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links - No animations for speed */}
                <nav className="flex flex-col space-y-1 mb-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-150",
                          "hover:bg-primary/5 hover:text-primary active:bg-primary/10",
                          isActive && "bg-primary/10 text-primary"
                        )}
                        prefetch={true}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t pt-6 space-y-4">
                  {/* Mobile Language Selection */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Select Language</p>
                    <div className="grid grid-cols-3 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            "hover:bg-primary/5 active:bg-primary/10",
                            language === lang.code && "bg-primary text-white hover:bg-primary"
                          )}
                          onClick={() => {
                            handleLanguageChange(lang.code);
                            setIsMenuOpen(false);
                          }}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Auth Buttons */}
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-primary/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                        prefetch={true}
                      >
                        <UserCircle className="w-5 h-5" />
                        {t.Profile || "Profile"}
                      </Link>
                      <Link
                        href="/myproperty"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-primary/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                        prefetch={true}
                      >
                        <Briefcase className="w-5 h-5" />
                        {t.MyProperties || "My Properties"}
                      </Link>
                      <button
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5" />
                        {t.Logout || "Logout"}
                      </button>
                    </div>
                  ) : (
                    <Link href="/Login" onClick={() => setIsMenuOpen(false)} prefetch={true}>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/70">
                        <User className="w-4 h-4 mr-2" />
                        {t.Login || "Login"}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
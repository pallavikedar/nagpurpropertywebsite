"use client"; 

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Home, 
  Building2, 
  MapPin, 
  DollarSign, 
  ArrowRight,
  ChevronDown,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Star,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function HeroSection({ onSearch }) {
  const { translations } = useLanguage();
  const t = translations;
  const [searchTab, setSearchTab] = useState("buy");
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: ""
  });

  const handleSearchParamChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const searchFilters = {
      ...searchParams,
      purpose: searchTab,
      minPrice: calculateMinPrice(searchParams.priceRange),
      maxPrice: calculateMaxPrice(searchParams.priceRange)
    };
    onSearch(searchFilters);
  };

  const calculateMinPrice = (priceRange) => {
    const ranges = {
      "0-50lakh": 0,
      "50lakh-1cr": 5000000,
      "1cr-2cr": 10000000,
      "2cr+": 20000000
    };
    return ranges[priceRange] || 0;
  };

  const calculateMaxPrice = (priceRange) => {
    const ranges = {
      "0-50lakh": 5000000,
      "50lakh-1cr": 10000000,
      "1cr-2cr": 20000000,
      "2cr+": 100000000
    };
    return ranges[priceRange] || 100000000;
  };

  const features = [
    { icon: Shield, label: "Verified Properties", color: "from-blue-500 to-cyan-500" },
    { icon: Clock, label: "Quick Response", color: "from-purple-500 to-pink-500" },
    { icon: Users, label: "Expert Advisors", color: "from-green-500 to-emerald-500" },
    { icon: TrendingUp, label: "Best Prices", color: "from-orange-500 to-red-500" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, delay: 1 }}
          className="absolute bottom-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container px-4 mx-auto py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-4 py-2">
              <Sparkles className="w-3 h-3 mr-2" />
             {t.IndiasLeadingRealEstatePlatform}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t.FindYourDreamPropertyinNagpur}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {t.YourPerfectHomeAwaits}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
              {t.DiscovertheperfectpropertyforyourneedswithNagpursmosttrustedrealestatepartner}
            </p>
          </motion.div>

        

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{feature.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center gap-2 text-white/80 cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-sm">{t.Scrolltoexplore}</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
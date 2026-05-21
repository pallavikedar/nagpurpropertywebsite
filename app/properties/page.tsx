
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bath, 
  Bed, 
  MapPin, 
  Move, 
  Tag, 
  Filter, 
  X, 
  ChevronDown,
  Home,
  Building2,
  TreePine,
  Store,
  Layers,
  Search,
  Heart,
  ArrowUpDown,
  SlidersHorizontal,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/app/baseurl";

export default function PropertiesPage() {
  return <PropertiesDashboard />;
}

function PropertiesDashboard() {
  const { translations } = useLanguage();
  const t = translations;

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]);

  // Property types with icons
  const propertyTypes = [
    { name: "Apartment", icon: <Building2 className="h-4 w-4" />, translationKey: "Apartment" },
    { name: "House", icon: <Home className="h-4 w-4" />, translationKey: "House" },
    { name: "Villa", icon: <TreePine className="h-4 w-4" />, translationKey: "Villa" },
    { name: "Plot", icon: <Layers className="h-4 w-4" />, translationKey: "Plot" },
    { name: "Commercial", icon: <Store className="h-4 w-4" />, translationKey: "Commercial" },
  ];

  const statusTypes = [
    { name: t.statusSale ?? "For Sale", value: "sale" },
    { name: t.statusRent ?? "For Rent", value: "rent" },
  ];

  // Helper function to toggle filter arrays safely
  const toggleArrayValue = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) => {
    setArr(prev => {
      if (prev.includes(val)) {
        return prev.filter(x => x !== val);
      } else {
        return [...prev, val];
      }
    });
  };

  // Reset filters
  const clearFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setBedrooms("");
    setPriceRange([0, 10000000]);
    setAreaRange([0, 10000]);
  };

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const cached = localStorage.getItem("properties");
        if (cached) {
          setProperties(JSON.parse(cached));
          setLoading(false);
        }

        const res = await fetch(`${BASE_URL}/properties/accepted`, {});

        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();

        setProperties(data);
        localStorage.setItem("properties", JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters and sorting
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const address = (p.address || "").toLowerCase();
      const type = (p.type || "").trim().toLowerCase();
      const price = Number(p.price || 0);
      const beds = Number(p.bedrooms || 0);
      const area = Number(p.area || 0);

      // Search filter
      if (search && !title.includes(search.toLowerCase()) && !address.includes(search.toLowerCase())) 
        return false;
      
      // Property type filter
      if (selectedTypes.length && !selectedTypes.includes(p.propertyType)) 
        return false;
      
      // Status filter
      if (selectedStatuses.length && !selectedStatuses.includes(type)) 
        return false;
      
      // Bedrooms filter
      if (bedrooms) {
        if (bedrooms === "5+" && beds < 5) return false;
        if (bedrooms !== "5+" && beds !== Number(bedrooms)) return false;
      }
      
      // Price range filter
      if (price < priceRange[0] || price > priceRange[1]) return false;
      
      // Area range filter
      if (area < areaRange[0] || area > areaRange[1]) return false;

      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [properties, search, selectedTypes, selectedStatuses, bedrooms, priceRange, areaRange, sortBy]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const activeFiltersCount = selectedTypes.length + selectedStatuses.length + (bedrooms ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0) +
    (areaRange[0] > 0 || areaRange[1] < 10000 ? 1 : 0);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-8">
            {/* Skeleton Filters */}
            <div className="bg-white rounded-xl p-6 mb-8 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1073&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {t.Properties ?? "Find Your Dream Property"}
              </h1>
              <p className="text-base text-blue-100">
                {t.Browseourlistingstofindyourperfectproperty ??
                  "Browse our extensive collection of premium properties"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters Bar - Sticky on Top */}
        <section className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="container px-4 md:px-6 py-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.Search ?? "Search by title or location..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {isFiltersExpanded ? (t.HideFilters ?? "Hide Filters") : (t.ShowFilters ?? "Show Filters")}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isFiltersExpanded && "rotate-180")} />
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={clearFilters} className="gap-2 text-red-600">
                    <X className="h-4 w-4" />
                    {t.Clear ?? "Clear"} ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </div>

            {/* Expandable Filters */}
            {isFiltersExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Property Type */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4" />
                      {t.PropertyType ?? "Property Type"}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyTypes.map((type) => (
                        <label key={type.name} className="flex items-center space-x-2 cursor-pointer group">
                          <Checkbox
                            checked={selectedTypes.includes(type.name)}
                            onCheckedChange={() => toggleArrayValue(selectedTypes, setSelectedTypes, type.name)}
                            className="h-3 w-3"
                          />
                          <div className="flex items-center gap-1">
                            {type.icon}
                            <span className="text-xs text-gray-700">{t[type.translationKey] ?? type.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.ListingStatus ?? "Listing Status"}</h3>
                    <div className="space-y-2">
                      {statusTypes.map((status) => (
                        <label key={status.value} className="flex items-center space-x-2 cursor-pointer group">
                          <Checkbox
                            checked={selectedStatuses.includes(status.value)}
                            onCheckedChange={() => toggleArrayValue(selectedStatuses, setSelectedStatuses, status.value)}
                            className="h-3 w-3"
                          />
                          <span className="text-xs text-gray-700">{status.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.Bedrooms ?? "Bedrooms"}</h3>
                    <div className="flex flex-wrap gap-2">
                      {[t.Any ?? "Any", "1", "2", "3", "4", "5+"].map((b) => (
                        <Button
                          key={b}
                          variant={bedrooms === (b === (t.Any ?? "Any") ? "" : b) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBedrooms(b === (t.Any ?? "Any") ? "" : b)}
                          className="h-8 px-3 text-xs"
                        >
                          {b}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.PriceRange ?? "Price Range"}</h3>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={10000000}
                        step={100000}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 p-1.5 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-500">{t.Min ?? "Min"}</p>
                          <p className="font-semibold text-xs">{formatPrice(priceRange[0])}</p>
                        </div>
                        <span className="text-gray-400 text-xs">—</span>
                        <div className="flex-1 p-1.5 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-500">{t.Max ?? "Max"}</p>
                          <p className="font-semibold text-xs">{formatPrice(priceRange[1])}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row of Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Area Range */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.Area ?? "Area"} (sq.ft)</h3>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={areaRange}
                        onValueChange={(value) => setAreaRange(value as [number, number])}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 p-1.5 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-500">{t.Min ?? "Min"}</p>
                          <p className="font-semibold text-xs">{areaRange[0]} sq.ft</p>
                        </div>
                        <span className="text-gray-400 text-xs">—</span>
                        <div className="flex-1 p-1.5 bg-gray-50 rounded text-center">
                          <p className="text-xs text-gray-500">{t.Max ?? "Max"}</p>
                          <p className="font-semibold text-xs">{areaRange[1]} sq.ft</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filter Chips */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.QuickFilters ?? "Quick Filters"}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setPriceRange([0, 5000000])}
                      >
                       Under ₹50L
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setPriceRange([5000000, 10000000])}
                      >
                       ₹50L - ₹1Cr
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setPriceRange([10000000, 20000000])}
                      >
                       ₹1Cr - ₹2Cr
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setBedrooms("2")}
                      >
                        2 BHK
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setBedrooms("3")}
                      >
                        3 BHK
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {selectedTypes.map(type => (
                  <Badge key={type} variant="secondary" className="gap-1 text-xs">
                    {type}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => toggleArrayValue(selectedTypes, setSelectedTypes, type)}
                    />
                  </Badge>
                ))}
                {selectedStatuses.map(status => (
                  <Badge key={status} variant="secondary" className="gap-1 text-xs">
                    {status === "sale" ? (t.statusSale ?? "For Sale") : (t.statusRent ?? "For Rent")}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => toggleArrayValue(selectedStatuses, setSelectedStatuses, status)}
                    />
                  </Badge>
                ))}
                {bedrooms && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    {bedrooms} {bedrooms !== "1" ? (t.Beds ?? "Beds") : (t.Bed ?? "Bed")}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setBedrooms("")} />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setPriceRange([0, 10000000])} />
                  </Badge>
                )}
                {(areaRange[0] > 0 || areaRange[1] < 10000) && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    {areaRange[0]} - {areaRange[1]} sq.ft
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setAreaRange([0, 10000])} />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Properties Grid Section - Data Display at Bottom */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-100 rounded-full">
                  <p className="text-sm font-semibold text-blue-700">
                    {filteredProperties.length} {t.PropertiesFound ?? "Properties Found"}
                  </p>
                </div>
                {activeFiltersCount > 0 && (
                  <p className="text-xs text-gray-500">
                    {t.withactivefilters ?? "with active filters"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t.Sortby ?? "Sort by"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t.NewestFirst ?? "Newest First"}</SelectItem>
                    <SelectItem value="oldest">{t.OldestFirst ?? "Oldest First"}</SelectItem>
                    <SelectItem value="price-low">{t.PriceLowtoHigh ?? "Price: Low to High"}</SelectItem>
                    <SelectItem value="price-high">{t.PriceHightoLow ?? "Price: High to Low"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12 bg-white rounded-xl">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <div className="text-red-500 text-lg font-semibold mb-2">{t.ErrorLoadingProperties ?? "Error Loading Properties"}</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  {t.TryAgain ?? "Try Again"}
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!error && filteredProperties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.Nopropertiesfound ?? "No properties found"}</h3>
                <p className="text-gray-500 mb-4">{t.Tryadjustingyourfiltersorsearchcriteria ?? "Try adjusting your filters or search criteria"}</p>
                <Button onClick={clearFilters}>{t.ClearFilters ?? "Clear Filters"}</Button>
              </div>
            )}

            {/* Properties Grid */}
            {!error && filteredProperties.length > 0 && (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <Link href={`/properties/${property.id}`}>
                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden bg-gray-100">
                          <Image
                            src={property.images?.[0] || "/api/placeholder/400/300"}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className={cn(
                              "px-2 py-1 text-xs font-semibold",
                              property.type === "rent" 
                                ? "bg-blue-500 hover:bg-blue-600" 
                                : "bg-green-500 hover:bg-green-600"
                            )}>
                              {property.type === "rent" ? (t.ForRent ?? "For Rent") : (t.ForSale ?? "For Sale")}
                            </Badge>
                          </div>
                          
                          {/* Favorite Button */}
                          <button 
                            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                            onClick={(e) => {
                              e.preventDefault();
                              // Add to favorites logic here
                            }}
                          >
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>

                          {/* Price Tag */}
                          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                            <div className="flex items-baseline gap-1">
                              <Tag className="h-3 w-3 text-white" />
                              <span className="text-white font-bold text-lg">
                                {formatPrice(property.price)}
                              </span>
                              {property.type === "rent" && (
                                <span className="text-white/80 text-xs">{t.month ?? "/month"}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-start gap-1 text-gray-500 mb-3">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm line-clamp-1">{property.address}</span>
                          </div>

                          {/* Features */}
                          <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Bed className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {property.bedrooms} {property.bedrooms === 1 ? (t.Bed ?? "Bed") : (t.Beds ?? "Beds")}
                              </span>
                            </div>
                            <div className="w-px h-4 bg-gray-200" />
                            <div className="flex items-center gap-1.5">
                              <Bath className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {property.bathrooms} {property.bathrooms === 1 ? (t.Bath ?? "Bath") : (t.Baths ?? "Baths")}
                              </span>
                            </div>
                            <div className="w-px h-4 bg-gray-200" />
                            <div className="flex items-center gap-1.5">
                              <Move className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{property.area} sq.ft</span>
                            </div>
                          </div>

                          {/* Owner & Action */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold text-xs">
                                  {property.ownerName?.charAt(0).toUpperCase() || "U"}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600">
                                {property.ownerName?.split(" ")[0] || (t.VerifiedOwner ?? "Verified Owner")}
                              </span>
                            </div>
                            <Button size="sm" className="shadow-sm hover:shadow transition-all">
                              {t.ViewDetails ?? "View Details"}
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Load More Button (Optional) */}
            {!error && filteredProperties.length > 0 && filteredProperties.length >= 12 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8">
                  {t.LoadMoreProperties ?? "Load More Properties"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
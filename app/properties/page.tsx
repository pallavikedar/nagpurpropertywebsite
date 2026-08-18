"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bath, Bed, MapPin, Move, Tag, X, ChevronDown, Home, Building2,
  TreePine, Store, Layers, Search, Heart, ArrowUpDown, SlidersHorizontal, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/app/baseurl";

/* -------------------------------------------------------------------------- */
/* Config — mirrors PropertyCard.tsx exactly                                  */
/* -------------------------------------------------------------------------- */

const PAGE_SIZE = 12;
const SORT: string[] = ["id,desc"];
const SEARCH_DEBOUNCE_MS = 300;

interface NormalizedProperty {
  id: string;
  title: string;
  address: string;
  image: string;
  type: "rent" | "sale";
  category: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  ownerName: string;
  createdAt: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

const emptyPage: PageResponse<any> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: PAGE_SIZE,
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
};

function normalizeProperty(raw: any): NormalizedProperty {
  return {
    id: String(raw.id),
    title: raw.title?.trim() || "Untitled Property",
    address: raw.address?.trim() || [raw.locality, raw.city, raw.state].filter(Boolean).join(", "),
    image: raw.images?.[0] || raw.image || "/api/placeholder/400/300",
    type: (raw.propertyFor || raw.type || "").toLowerCase() === "rent" ? "rent" : "sale",
    category: raw.propertyType || raw.category || "Apartment",
    price: Number(raw.price) || 0,
    bedrooms: Number(raw.bedrooms) || 0,
    bathrooms: Number(raw.bathrooms) || 0,
    area: Number(raw.buildUpArea || raw.carpetArea || raw.area) || 0,
    ownerName: raw.ownerName?.trim() || "Verified Owner",
    createdAt: raw.createdAt || new Date(0).toISOString(),
  };
}

/** Accepts either the Spring Page object or a bare array — same as PropertyCard. */
function normalizePage(data: unknown): PageResponse<any> {
  if (Array.isArray(data)) {
    return {
      ...emptyPage,
      content: data,
      totalElements: data.length,
      totalPages: 1,
      numberOfElements: data.length,
      empty: data.length === 0,
    };
  }
  const page = (data ?? {}) as Partial<PageResponse<any>>;
  const content = Array.isArray(page.content) ? page.content : [];
  return {
    content,
    totalElements: page.totalElements ?? content.length,
    totalPages: page.totalPages ?? 1,
    number: page.number ?? 0,
    size: page.size ?? PAGE_SIZE,
    first: page.first ?? true,
    last: page.last ?? true,
    numberOfElements: page.numberOfElements ?? content.length,
    empty: page.empty ?? content.length === 0,
  };
}

/** Same query-param shape as PropertyCard's buildUrl — no auth header. */
function buildUrl(pageNumber: number) {
  const params = new URLSearchParams({
    page: String(pageNumber),
    size: String(PAGE_SIZE),
  });
  SORT.forEach((rule) => params.append("sort", rule));
  return `${BASE_URL}/properties/accepted?${params.toString()}`;
}

function formatPrice(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${price.toLocaleString()}`;
}

function CardImage({ src, alt, priority, children }: { src: string; alt: string; priority?: boolean; children?: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-56 overflow-hidden bg-gray-100">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("object-cover transition-all duration-500 group-hover:scale-110", loaded ? "opacity-100" : "opacity-0")}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {children}
    </div>
  );
}

function RangeControl({
  min, max, step, value, onChange, formatValue,
}: {
  min: number; max: number; step: number; value: [number, number];
  onChange: (value: [number, number]) => void; formatValue: (v: number) => string;
}) {
  const [minText, setMinText] = useState(String(value[0]));
  const [maxText, setMaxText] = useState(String(value[1]));

  useEffect(() => {
    setMinText(String(value[0]));
    setMaxText(String(value[1]));
  }, [value]);

  const commitMin = () => {
    const parsed = Number(minText.replace(/[^0-9]/g, ""));
    const clamped = Math.min(Math.max(Number.isFinite(parsed) ? parsed : min, min), value[1]);
    onChange([clamped, value[1]]);
  };

  const commitMax = () => {
    const parsed = Number(maxText.replace(/[^0-9]/g, ""));
    const clamped = Math.max(Math.min(Number.isFinite(parsed) ? parsed : max, max), value[0]);
    onChange([value[0], clamped]);
  };

  return (
    <div className="space-y-3">
      <Slider min={min} max={max} step={step} value={value} onValueChange={(v) => onChange(v as [number, number])} className="w-full" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Min</p>
          <Input value={minText} onChange={(e) => setMinText(e.target.value)} onBlur={commitMin}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
            inputMode="numeric" className="h-8 text-xs text-center px-2" />
          <p className="text-[11px] text-gray-400 text-center mt-0.5">{formatValue(value[0])}</p>
        </div>
        <span className="text-gray-400 text-xs mt-4">—</span>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Max</p>
          <Input value={maxText} onChange={(e) => setMaxText(e.target.value)} onBlur={commitMax}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
            inputMode="numeric" className="h-8 text-xs text-center px-2" />
          <p className="text-[11px] text-gray-400 text-center mt-0.5">{formatValue(value[1])}</p>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return <PropertiesDashboard />;
}

function PropertiesDashboard() {
  const { translations } = useLanguage();
  const t = translations;

  const [properties, setProperties] = useState<NormalizedProperty[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // kept for the UI dropdown; see note below
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]);

  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const propertyTypes = useMemo(
    () => [
      { name: "Apartment", icon: <Building2 className="h-4 w-4" />, translationKey: "Apartment" },
      { name: "House", icon: <Home className="h-4 w-4" />, translationKey: "House" },
      { name: "Villa", icon: <TreePine className="h-4 w-4" />, translationKey: "Villa" },
      { name: "Plot", icon: <Layers className="h-4 w-4" />, translationKey: "Plot" },
      { name: "Commercial", icon: <Store className="h-4 w-4" />, translationKey: "Commercial" },
    ],
    []
  );

  const statusTypes = useMemo(
    () => [
      { name: "For Sell", value: "sale" },
      { name: t.statusRent ?? "For Rent", value: "rent" },
    ],
    [t]
  );

  const toggleArrayValue = useCallback(
    (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
      setArr((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setBedrooms("");
    setPriceRange([0, 10000000]);
    setAreaRange([0, 10000]);
  }, []);

  /* -------------------------------------------------------------------- */
  /* Load a page — plain GET, no headers, no credentials. Same call shape */
  /* as PropertyCard.tsx, which is confirmed working against this API.    */
  /* -------------------------------------------------------------------- */
  const loadPage = useCallback(async (pageNumber: number) => {
    const requestId = ++requestIdRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(pageNumber === 0 && properties.length === 0);
    setLoadingMore(pageNumber !== 0);
    setError("");

    try {
      const response = await fetch(buildUrl(pageNumber), {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Couldn't load properties (${response.status})`);
      }

      const pageData = normalizePage(await response.json());
      if (requestId !== requestIdRef.current) return;

      const normalized = pageData.content.map(normalizeProperty);
      setProperties((prev) => (pageNumber === 0 ? normalized : [...prev, ...normalized]));
      setPage(pageData.number);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      if (requestId !== requestIdRef.current) return;
      setError((err as Error).message || "Something went wrong");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [properties.length]);

  useEffect(() => {
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || page >= totalPages - 1) return;
    loadPage(page + 1);
  };

  // Client-side filtering + sorting over whatever pages have been loaded so far.
  const filteredProperties = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = properties.filter((p) => {
      if (searchLower && !p.title.toLowerCase().includes(searchLower) && !p.address.toLowerCase().includes(searchLower))
        return false;
      if (selectedTypes.length && !selectedTypes.includes(p.category)) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(p.type)) return false;
      if (bedrooms) {
        if (bedrooms === "5+" && p.bedrooms < 5) return false;
        if (bedrooms !== "5+" && p.bedrooms !== Number(bedrooms)) return false;
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.area < areaRange[0] || p.area > areaRange[1]) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low": sorted.sort((a, b) => a.price - b.price); break;
      case "price-high": sorted.sort((a, b) => b.price - a.price); break;
      case "oldest": sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "newest":
      default: sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [properties, search, selectedTypes, selectedStatuses, bedrooms, priceRange, areaRange, sortBy]);

  const activeFiltersCount =
    selectedTypes.length +
    selectedStatuses.length +
    (bedrooms ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0) +
    (areaRange[0] > 0 || areaRange[1] < 10000 ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-8">
            <div className="bg-white rounded-xl p-6 mb-8 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
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
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1073&auto=format&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.Properties ?? "Find Your Dream Property"}</h1>
              <p className="text-base text-blue-100">{t.Browseourlistingstofindyourperfectproperty ?? "Browse our extensive collection of premium properties"}</p>
            </motion.div>
          </div>
        </section>

        <section className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="container px-4 md:px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.Search ?? "Search by title or location..."}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)} className="gap-2">
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

            {isFiltersExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4" />
                      {t.PropertyType ?? "Property Type"}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyTypes.map((type) => (
                        <label key={type.name} className="flex items-center space-x-2 cursor-pointer group">
                          <Checkbox checked={selectedTypes.includes(type.name)} onCheckedChange={() => toggleArrayValue(selectedTypes, setSelectedTypes, type.name)} className="h-3 w-3" />
                          <div className="flex items-center gap-1">
                            {type.icon}
                            <span className="text-xs text-gray-700">{t[type.translationKey] ?? type.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.ListingStatus ?? "Listing Status"}</h3>
                    <div className="space-y-2">
                      {statusTypes.map((status) => (
                        <label key={status.value} className="flex items-center space-x-2 cursor-pointer group">
                          <Checkbox checked={selectedStatuses.includes(status.value)} onCheckedChange={() => toggleArrayValue(selectedStatuses, setSelectedStatuses, status.value)} className="h-3 w-3" />
                          <span className="text-xs text-gray-700">{status.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

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

                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.PriceRange ?? "Price Range"}</h3>
                    <RangeControl min={0} max={10000000} step={100000} value={priceRange} onChange={setPriceRange} formatValue={formatPrice} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.Area ?? "Area"} (sq.ft)</h3>
                    <RangeControl min={0} max={10000} step={100} value={areaRange} onChange={setAreaRange} formatValue={(v) => `${v} sq.ft`} />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-sm">{t.QuickFilters ?? "Quick Filters"}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setPriceRange([0, 5000000])}>Under ₹50L</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setPriceRange([5000000, 10000000])}>₹50L - ₹1Cr</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setPriceRange([10000000, 20000000])}>₹1Cr - ₹2Cr</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setBedrooms("2")}>2 BHK</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setBedrooms("3")}>3 BHK</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1 text-xs">
                    {type}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => toggleArrayValue(selectedTypes, setSelectedTypes, type)} />
                  </Badge>
                ))}
                {selectedStatuses.map((status) => (
                  <Badge key={status} variant="secondary" className="gap-1 text-xs">
                    {status === "sale" ? "For Sell" : (t.statusRent ?? "For Rent")}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => toggleArrayValue(selectedStatuses, setSelectedStatuses, status)} />
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

        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-100 rounded-full">
                  <p className="text-sm font-semibold text-blue-700">
                    {filteredProperties.length}
                    {!activeFiltersCount ? ` / ${totalElements}` : ""} {t.PropertiesFound ?? "Properties Found"}
                  </p>
                </div>
                {activeFiltersCount > 0 && <p className="text-xs text-gray-500">{t.withactivefilters ?? "with active filters"}</p>}
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

            {error && (
              <div className="text-center py-12 bg-white rounded-xl">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <div className="text-red-500 text-lg font-semibold mb-2">{t.ErrorLoadingProperties ?? "Error Loading Properties"}</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => loadPage(0)} className="mt-4">{t.TryAgain ?? "Try Again"}</Button>
              </div>
            )}

            {!error && filteredProperties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.Nopropertiesfound ?? "No properties found"}</h3>
                <p className="text-gray-500 mb-4">{t.Tryadjustingyourfiltersorsearchcriteria ?? "Try adjusting your filters or search criteria"}</p>
                <Button onClick={clearFilters}>{t.ClearFilters ?? "Clear Filters"}</Button>
              </div>
            )}

            {!error && filteredProperties.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index, 8) * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <Link href={`/properties/${property.id}`} prefetch={index < PAGE_SIZE}>
                        <CardImage src={property.image} alt={property.title} priority={index < 3}>
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className={cn("px-2 py-1 text-xs font-semibold", property.type === "rent" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600")}>
                              {property.type === "rent" ? (t.ForRent ?? "For Rent") : "For Sell"}
                            </Badge>
                          </div>
                          <button
                            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                            onClick={(e) => { e.preventDefault(); }}
                          >
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>
                          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 z-10">
                            <div className="flex items-baseline gap-1">
                              <Tag className="h-3 w-3 text-white" />
                              <span className="text-white font-bold text-lg">{formatPrice(property.price)}</span>
                              {property.type === "rent" && <span className="text-white/80 text-xs">{t.month ?? "/month"}</span>}
                            </div>
                          </div>
                        </CardImage>

                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                          <div className="flex items-start gap-1 text-gray-500 mb-3">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm line-clamp-1">{property.address}</span>
                          </div>

                          <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Bed className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{property.bedrooms} {property.bedrooms === 1 ? (t.Bed ?? "Bed") : (t.Beds ?? "Beds")}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-200" />
                            <div className="flex items-center gap-1.5">
                              <Bath className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{property.bathrooms} {property.bathrooms === 1 ? (t.Bath ?? "Bath") : (t.Baths ?? "Baths")}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-200" />
                            <div className="flex items-center gap-1.5">
                              <Move className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{property.area} sq.ft</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold text-xs">{property.ownerName.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-xs text-gray-600">{property.ownerName.split(" ")[0]}</span>
                            </div>
                            <Button size="sm" className="shadow-sm hover:shadow transition-all">{t.ViewDetails ?? "View Details"}</Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!error && !activeFiltersCount && page < totalPages - 1 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? (t.Loading ?? "Loading...") : (t.LoadMoreProperties ?? "Load More Properties")}
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
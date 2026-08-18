"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  Heart,
  MapPin,
  Move,
  Home,
  FilterX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/app/baseurl";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 6;

/**
 * Spring's Pageable binds from flat query params, one `sort` entry per rule:
 *   ?page=0&size=6&sort=id,desc&sort=price,asc
 * Field names must match the entity property, not the DB column.
 */
const SORT: string[] = ["id,desc"];

/**
 * Flip to `true` once the Spring controller accepts filter params
 * (propertyFor, city, propertyType, minPrice, maxPrice, bedrooms).
 * While `false`, filtering only applies to the page currently on screen.
 */
const FILTER_ON_SERVER = false;

const FAVORITES_KEY = "favorites";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Property {
  id: number | string;
  title: string;
  address: string;
  locality?: string;
  city?: string;
  images?: string[];
  propertyFor?: string;
  propertyType?: string;
  type?: "rent" | "sale";
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  buildUpArea?: string | null;
  carpetArea?: string | null;
  ownerName?: string;
  createdAt?: string;
  description?: string;
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

interface SearchFilters {
  purpose?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
}

interface PropertyCardProps {
  filters?: SearchFilters | null;
  searchTrigger?: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const emptyPage: PageResponse<Property> = {
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

/** Accepts either the Spring Page object or a bare array (older endpoint). */
function normalizePage(data: unknown): PageResponse<Property> {
  if (Array.isArray(data)) {
    return {
      ...emptyPage,
      content: data as Property[],
      totalElements: data.length,
      totalPages: 1,
      numberOfElements: data.length,
      empty: data.length === 0,
    };
  }

  const page = (data ?? {}) as Partial<PageResponse<Property>>;
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

function buildUrl(page: number, filters?: SearchFilters | null) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(PAGE_SIZE),
  });

  SORT.forEach((rule) => params.append("sort", rule));

  if (FILTER_ON_SERVER && filters) {
    if (filters.purpose && filters.purpose !== "all")
      params.set("propertyFor", filters.purpose);
    if (filters.location?.trim()) params.set("city", filters.location.trim());
    if (filters.propertyType && filters.propertyType !== "all")
      params.set("propertyType", filters.propertyType);
    if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    if (filters.bedrooms && filters.bedrooms !== "any")
      params.set("bedrooms", filters.bedrooms);
  }

  return `${BASE_URL}/properties/accepted?${params.toString()}`;
}

/** Page numbers to render, with -1 marking a gap. e.g. [0, -1, 4, 5, 6, -1, 9] */
function buildPageWindow(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages = new Set<number>([0, total - 1, current]);
  if (current - 1 > 0) pages.add(current - 1);
  if (current + 1 < total - 1) pages.add(current + 1);
  if (current <= 2) pages.add(1).add(2).add(3);
  if (current >= total - 3) pages.add(total - 2).add(total - 3).add(total - 4);

  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);

  const withGaps: number[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) withGaps.push(-1);
    withGaps.push(page);
  });
  return withGaps;
}

/** True only if at least one field would actually narrow the results. */
function hasRealFilters(f?: SearchFilters | null): boolean {
  if (!f) return false;
  return Boolean(
    (f.purpose && f.purpose !== "all") ||
      f.location?.trim() ||
      (f.propertyType && f.propertyType !== "all") ||
      f.minPrice != null ||
      f.maxPrice != null ||
      (f.bedrooms && f.bedrooms !== "any")
  );
}

function formatPrice(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function formatArea(property: Property) {
  const value = property.area ?? property.buildUpArea ?? property.carpetArea;
  if (value === null || value === undefined || value === "") return "—";
  return `${value} sq.ft`;
}

function isRent(property: Property) {
  return (
    property.propertyFor?.toLowerCase() === "rent" ||
    property.type?.toLowerCase() === "rent"
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PropertyCard({
  filters = null,
  searchTrigger = 0,
}: PropertyCardProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------- Load a page ---------------- */

  const loadPage = useCallback(
    async (pageNumber: number, currentFilters?: SearchFilters | null) => {
      const requestId = ++requestIdRef.current;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(buildUrl(pageNumber, currentFilters), {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Couldn't load properties (${response.status})`);
        }

        const pageData = normalizePage(await response.json());

        // A newer request already went out — discard this result.
        if (requestId !== requestIdRef.current) return;

        setProperties(pageData.content);
        setPage(pageData.number);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);

        // Page shrank under us (deleted listings) — step back to the last page.
        if (pageData.empty && pageData.totalPages > 0 && pageNumber > pageData.totalPages - 1) {
          loadPage(pageData.totalPages - 1, currentFilters);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;
        setError((err as Error).message || "Something went wrong");
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    []
  );

  /* ---------------- Initial load ---------------- */

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) setFavorites(parsed.map(String));
      }
    } catch {
      /* ignore malformed favorites */
    }

    loadPage(0, null);
  }, [loadPage]);

  /* ---------------- Re-run on search ---------------- */

  useEffect(() => {
    if (searchTrigger === 0) return;
    const next = hasRealFilters(filters) ? filters : null;
    setActiveFilters(next);
    if (FILTER_ON_SERVER) loadPage(0, next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger]);

  /* ---------------- Client-side filtering fallback ---------------- */

  const visibleProperties = useMemo(() => {
    if (FILTER_ON_SERVER || !activeFilters) return properties;

    return properties.filter((property) => {
      const f = activeFilters;

      if (f.purpose && f.purpose !== "all") {
        const purpose = f.purpose.toLowerCase();
        const matches =
          property.propertyFor?.toLowerCase() === purpose ||
          property.type?.toLowerCase() === purpose;
        if (!matches) return false;
      }

      if (f.location?.trim()) {
        const term = f.location.toLowerCase();
        const haystack = [property.title, property.address, property.locality, property.city]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (f.propertyType && f.propertyType !== "all") {
        if (property.propertyType?.toLowerCase() !== f.propertyType.toLowerCase())
          return false;
      }

      if (f.minPrice != null && property.price < f.minPrice) return false;
      if (f.maxPrice != null && property.price > f.maxPrice) return false;

      if (f.bedrooms && f.bedrooms !== "any") {
        const wanted = parseInt(f.bedrooms, 10);
        const beds = property.bedrooms ?? 0;
        if (wanted >= 4 ? beds < 4 : beds !== wanted) return false;
      }

      return true;
    });
  }, [properties, activeFilters]);

  const hasActiveFilters = activeFilters !== null;

  // Remove once the count is confirmed correct.
  if (process.env.NODE_ENV === "development") {
    console.log("[PropertyCard]", {
      fetched: properties.length,
      afterFilter: visibleProperties.length,
      totalElements,
      totalPages,
      activeFilters,
    });
  }
  const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = page * PAGE_SIZE + properties.length;

  /* ---------------- Actions ---------------- */

  const goToPage = (next: number) => {
    if (loading || next === page || next < 0 || next > totalPages - 1) return;
    loadPage(next, activeFilters);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setActiveFilters(null);
    loadPage(0, null);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  /* ---------------- Error state ---------------- */

  if (error && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Properties didn&apos;t load
          </div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => loadPage(page, activeFilters)} className="mt-4" variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="container mx-auto px-4 py-8" id="properties-section" ref={sectionRef}>
      {/* Results header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600">
          {loading && properties.length === 0 ? (
            "Loading properties…"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalElements}</span>{" "}
              {totalElements === 1 ? "property" : "properties"}
            </>
          )}
        </p>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <FilterX className="w-4 h-4" />
            Clear all filters
          </Button>
        )}
      </div>

      {loading ? (
        /* Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : visibleProperties.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No properties match this search
            </h3>
            <p className="text-gray-500 mb-4">
              Widen the price range or change the location to see more listings.
            </p>
            <Button onClick={clearFilters} variant="outline">
              View all properties
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleProperties.map((property, index) => {
            const id = String(property.id);
            const rent = isRent(property);

            return (
              <Link href={`/properties/${id}`} key={id}>
                <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <Image
                      src={
                        property.images?.length
                          ? property.images[0]
                          : "/api/placeholder/400/300"
                      }
                      alt={property.title}
                      fill
                      priority={index < 4}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <Badge
                      className={cn(
                        "absolute top-3 left-3 z-10 px-3 py-1 text-xs font-semibold",
                        rent
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-green-500 hover:bg-green-600"
                      )}
                    >
                      {rent ? "For Rent" : "For Sale"}
                    </Badge>

                    <button
                      type="button"
                      aria-label={
                        favorites.includes(id) ? "Remove from saved" : "Save this property"
                      }
                      onClick={(e) => toggleFavorite(id, e)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-colors",
                          favorites.includes(id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        )}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-white font-bold text-lg">
                          {formatPrice(property.price)}
                        </span>
                        {rent && <span className="text-white/80 text-xs">/month</span>}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-start gap-1 text-gray-500">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="text-sm line-clamp-1">{property.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {property.bedrooms ?? 0}{" "}
                          {property.bedrooms === 1 ? "Bed" : "Beds"}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {property.bathrooms ?? 0}{" "}
                          {property.bathrooms === 1 ? "Bath" : "Baths"}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <Move className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formatArea(property)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-xs">
                            {property.ownerName?.charAt(0).toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 line-clamp-1">
                          {property.ownerName ?? "Owner"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Property pages"
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={page === 0 || loading}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {buildPageWindow(page, totalPages).map((p, i) =>
              p === -1 ? (
                <span key={`gap-${i}`} className="px-2 text-gray-400 select-none">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  aria-label={`Page ${p + 1}`}
                  aria-current={p === page ? "page" : undefined}
                  disabled={loading}
                  onClick={() => goToPage(p)}
                  className={cn(
                    "min-w-[2.5rem]",
                    p === page && "bg-primary hover:bg-primary/90 text-white"
                  )}
                >
                  {p + 1}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => goToPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-gray-400">
            Page {page + 1} of {totalPages}
          </p>
        </nav>
      )}
    </div>
  );
}
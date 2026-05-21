"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, Heart, MapPin, Move, Home, FilterX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/app/baseurl";

interface Property {
  id: string;
  title: string;
  address: string;
  locality?: string;
  city?: string;
  images?: string[];
  propertyFor?: string;
  propertyType?: string;
  type?: "rent" | "sale";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  ownerName: string;
  createdAt?: string;
  description?: string;
}

export default function PropertyCard({ filters = null, searchTrigger = 0 }) {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const cachedData = localStorage.getItem("properties");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setAllProperties(parsed);
          setFilteredProperties(parsed);
          setLoading(false);
        }

        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        const response = await fetch(`${BASE_URL}/properties/accepted`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setAllProperties(data);
        setFilteredProperties(data);
        localStorage.setItem("properties", JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters when searchTrigger changes or filters update
  useEffect(() => {
    if (searchTrigger > 0 && filters) {
      applyFilters(filters);
    }
  }, [searchTrigger, filters]);

  const applyFilters = (searchFilters) => {
    let filtered = [...allProperties];

    // Filter by purpose (buy/rent)
    if (searchFilters.purpose && searchFilters.purpose !== "all") {
      filtered = filtered.filter(property => 
        property.propertyFor?.toLowerCase() === searchFilters.purpose.toLowerCase() ||
        property.type?.toLowerCase() === searchFilters.purpose.toLowerCase()
      );
    }

    // Filter by location
    if (searchFilters.location && searchFilters.location.trim()) {
      const searchTerm = searchFilters.location.toLowerCase();
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(searchTerm) ||
        property.address?.toLowerCase().includes(searchTerm) ||
        property.locality?.toLowerCase().includes(searchTerm) ||
        property.city?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by property type
    if (searchFilters.propertyType && searchFilters.propertyType !== "all") {
      filtered = filtered.filter(property => 
        property.propertyType?.toLowerCase() === searchFilters.propertyType.toLowerCase()
      );
    }

    // Filter by price range
    if (searchFilters.minPrice && searchFilters.maxPrice) {
      filtered = filtered.filter(property => 
        property.price >= searchFilters.minPrice && 
        property.price <= searchFilters.maxPrice
      );
    }

    // Filter by bedrooms
    if (searchFilters.bedrooms && searchFilters.bedrooms !== "any") {
      const bedroomCount = parseInt(searchFilters.bedrooms);
      if (bedroomCount === 4) {
        filtered = filtered.filter(property => property.bedrooms >= 4);
      } else {
        filtered = filtered.filter(property => property.bedrooms === bedroomCount);
      }
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setFilteredProperties(allProperties);
    if (window.scrollTo) {
      window.scrollTo({ top: document.querySelector('#properties-section')?.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const formatPrice = (price: number, type: string) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" id="properties-section">
      {/* Results Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        
        {filteredProperties.length !== allProperties.length && (
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <FilterX className="w-4 h-4" />
            Clear All Filters
          </Button>
        )}
      </div>

      {/* No Results */}
      {filteredProperties.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any properties matching your search criteria. Try adjusting your filters or browse all properties.
            </p>
            <Button onClick={clearFilters} variant="outline">
              View All Properties
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property, index) => (
              <Link href={`/properties/${property.id}`} key={property.id}>
                <div
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <Image
                      src={
                        property.images && property.images.length > 0
                          ? property.images[0]
                          : "/api/placeholder/400/300"
                      }
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Badge
                      className={cn(
                        "absolute top-3 left-3 z-10 px-3 py-1 text-xs font-semibold",
                        property.propertyFor === "rent" || property.type === "rent"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-green-500 hover:bg-green-600"
                      )}
                    >
                      {property.propertyFor === "rent" || property.type === "rent" ? "For Rent" : "For Sale"}
                    </Badge>

                    <button
                      onClick={(e) => toggleFavorite(property.id, e)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-colors",
                          favorites.includes(property.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        )}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-white font-bold text-lg">
                          {formatPrice(property.price, property.propertyFor || property.type)}
                        </span>
                        {(property.propertyFor === "rent" || property.type === "rent") && (
                          <span className="text-white/80 text-xs">/month</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
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
                          {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <Move className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{property.area} sq.ft</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-xs">
                            {property.ownerName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 line-clamp-1">
                          {property.ownerName}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {filteredProperties.length >= 8 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                Load More Properties
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
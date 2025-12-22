"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, MapPin, Move, Tag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

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
    setPriceMin("");
    setPriceMax("");
  };

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const cached = localStorage.getItem("properties");
        if (cached) setProperties(JSON.parse(cached));

        const token = localStorage.getItem("usertoken");
        const res = await fetch(`${BASE_URL}/properties/accepted`, {
          // headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();

        setProperties(data);
        localStorage.setItem("properties", JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters
  const filteredProperties = useMemo(() => {
    const min = priceMin ? Number(priceMin) : null;
    const max = priceMax ? Number(priceMax) : null;

    return properties.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const address = (p.address || "").toLowerCase();
      const type = (p.type || "").trim().toLowerCase();
      const status = (p.type || "").trim().toLowerCase(); // using same field if your API uses 'type' for rent/sale
      const price = Number(p.price || 0);
      const beds = Number(p.bedrooms || 0);

      if (search && !title.includes(search.toLowerCase()) && !address.includes(search.toLowerCase())) return false;
      if (selectedTypes.length && !selectedTypes.includes(p.propertyType)) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(status)) return false;
      if (bedrooms) {
        if (bedrooms === "5+" && beds < 5) return false;
        if (bedrooms !== "5+" && beds !== Number(bedrooms)) return false;
      }
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      return true;
    });
  }, [properties, search, selectedTypes, selectedStatuses, bedrooms, priceMin, priceMax]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t.Properties ?? "Properties"}</h1>
              <p className="text-muted-foreground">
                {t.Browseourlistingstofindyourperfectproperty ??
                  "Browse our listings to find your perfect property"}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-auto min-w-[200px]"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </section>

        {/* Filter + Property Grid */}
        <section className="py-12 px-4 md:px-6">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full md:w-64 shrink-0 space-y-6">
                {/* Property Type */}
                <div>
                  <h3 className="font-semibold mb-4">{t.PropertyType ?? "Property Type"}</h3>
                  {["Apartment", "House", "Villa", "Plot", "Commercial"].map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleArrayValue(selectedTypes, setSelectedTypes, type)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-4">{t.PriceRange ?? "Price Range"}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Bedrooms */}
                <div>
                  <h3 className="font-semibold mb-4">{t.Bedrooms ?? "Bedrooms"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {["", "1", "2", "3", "4", "5+"].map((b) => (
                      <Button
                        key={b || "any"}
                        variant={bedrooms === b ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBedrooms(b)}
                      >
                        {b || "Any"}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status */}
                {/* <div>
                  <h3 className="font-semibold mb-4">{t.PropertyStatus ?? "Property Status"}</h3>
                  {[
                    { label: t.ForSell ?? "For Sell", value: "sell" },
                    { label: t.ForRent ?? "For Rent", value: "rent" },
                  ].map((s) => (
                    <label key={s.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(s.value)}
                        onChange={() => toggleArrayValue(selectedStatuses, setSelectedStatuses, s.value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div> */}
              </aside>

              {/* Property Grid */}
              <div className="flex-1">
                {loading ? (
                  <p>Loading properties...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : filteredProperties.length === 0 ? (
                  <p>No properties match your filters.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="group relative overflow-hidden rounded-lg border bg-white hover:shadow-md transition-all"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={property.images?.[0] || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <Badge
                            className={cn(
                              "absolute top-3 left-3",
                              property.type === "rent"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-primary"
                            )}
                          >
                            {property.type === "rent" ? "For Rent" : "For Sell"}
                          </Badge>
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                          <div className="flex items-center text-muted-foreground mt-1 justify-between">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span className="text-sm line-clamp-1">{property.address}</span>
                            <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-bold text-lg">₹{property.price}</span>
                  </div>
                          </div>

                          <div className="flex justify-between items-center my-3 border-y py-3 text-sm text-muted-foreground">
                            
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" /> {property.bedrooms} Beds
                            </div>
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" /> {property.bathrooms} Baths
                            </div>
                            <div className="flex items-center">
                              <Move className="h-4 w-4 mr-1" /> {property.area} sq.ft
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Listed by {property.ownerName}
                            </span>
                            <Link href={`/properties/${property.id}`}>
                              <Button size="sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

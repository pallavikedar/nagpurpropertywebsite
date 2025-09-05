"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bath, Bed, Heart, MapPin, Move, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BASE_URL } from "@/app/baseurl"
interface Property {
  id: string;
  title: string;
  address: string;
  image: string;
  type: "rent" | "sale";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  ownerName: string;
}
export default function PropertyCard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("usertoken");

        // if (!token) {
       
        //   window.location.href = "/Login";
        //   return;
        // }

        const response = await fetch(`${BASE_URL}/properties`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties. Please try again.");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
      {properties.map((property, index) => {
        const animationDelay = `${index * 100}ms`;

        return (
          <div
            key={property.id}
            className="group w-[300px] relative overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-md animate-fade-up"
            style={{ animationDelay }}
          >
            <div className="relative aspect-video overflow-hidden">
            <Image
                src={property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Badge
                className={cn(
                  "absolute top-3 left-3",
                  property.type === "rent" ? "bg-secondary text-secondary-foreground" : "bg-primary"
                )}
              >
                {property.type === "rent" ? "For Rent" : "For Sale"}
              </Badge>
              <button
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center transition-colors hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
              >
                <Heart
                  className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
                />
                <span className="sr-only">Add to favorites</span>
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="text-sm line-clamp-1">{property.address}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-bold text-lg">₹{property.price}</span>
                  </div>
                  {property.type === "rent" && (
                    <span className="text-xs text-muted-foreground">/month</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-gray-100 my-3">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center">
                  <Move className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{property.area} sq.ft</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Listed by {property.ownerName}</span>
                <Link href={`/properties/${property.id}`}>
                  <Button size="sm" className="transition-all duration-300 hover:scale-105">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

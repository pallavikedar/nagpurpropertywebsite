"use client"
import Image from "next/image"
import Link from "next/link"
import { Bath, Bed, Calendar, ChevronRight, Home, MapPin, Move, Phone, Share2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { properties } from "@/lib/data"

import {LanguageProvider, useLanguage } from "@/context/language-context"
 

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { translations } = useLanguage()
  const t = translations

  // In a real app, you would fetch the property data based on the ID
  const propertyId = parseInt(params.id, 10);
  const property = properties.find((p) => p.id === params.id) || properties[0]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted py-4">
          <div className="container px-4 md:px-6">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                {t.home}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              <Link href="/properties" className="text-muted-foreground hover:text-foreground">
                {t.Properties}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              <span className="font-medium truncate">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Property Header */}
        <section className="py-6 md:py-10 animate-fade-up">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{property.title}</h1>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl md:text-3xl font-bold">₹{property.price.toLocaleString()}</span>
                </div>
                {property.type === "rent" && <span className="text-sm text-muted-foreground">/{t.month}</span>}
              </div>
            </div>
          </div>
        </section>

        {/* Property Images */}
        <section className="pb-10">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden animate-zoom-in">
                <Image src={property.image || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${(i + 1) * 100}ms` }}
                  >
                    <Image
                      src={`https://images.unsplash.com/photo-${1560184273 + i * 10000}-${Math.floor(Math.random() * 1000000)}?q=80&w=500&auto=format&fit=crop`}
                      alt={`${property.title} image ${i + 2}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="animate-slide-in-right">
                <Share2 className="h-4 w-4 mr-2" />
                {t.Share}
              </Button>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-10 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-up">
                  <h2 className="text-xl font-semibold mb-4">{t.Overview}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg transition-transform hover:scale-105">
                      <Bed className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">{t.Bedrooms}</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg transition-transform hover:scale-105">
                      <Bath className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">{t.bathrooms}</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg transition-transform hover:scale-105">
                      <Move className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">{t.Area}</span>
                      <span className="font-medium">{property.area} {t.sqft}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg transition-transform hover:scale-105">
                      <Home className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">{t.PropertyType}</span>
                      <span className="font-medium capitalize">{property.category}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-up" style={{ animationDelay: "100ms" }}>
                  <Tabs defaultValue="description">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="description">{t.Description}</TabsTrigger>
                      <TabsTrigger value="details">{t.Details}</TabsTrigger>
                      <TabsTrigger value="features">{t.Features}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="pt-4">
                      <p className="text-muted-foreground">
                        {t.Thisbeautiful} {property.bedrooms} {t.bedroompropertyislocatedintheheartof}{" "}
                        {property.address}.{t.Thepropertyoffersspaciousroomswithmodernamenitiesandisperfectfor}{" "}
                        {property.type === "rent" ? "renting" : "buying"}.
                      </p>
                      <p className="text-muted-foreground mt-4">
                       {t.Lorem}
                      </p>
                    </TabsContent>
                    <TabsContent value="details" className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.PropertyID}</p>
                          <p className="text-sm text-muted-foreground">{property.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.PropertyType}</p>
                          <p className="text-sm text-muted-foreground capitalize">{property.category}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.PropertyStatus}</p>
                          <p className="text-sm text-muted-foreground capitalize">For {property.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.PropertySize}</p>
                          <p className="text-sm text-muted-foreground">{property.area} sq.ft</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.YearBuilt}</p>
                          <p className="text-sm text-muted-foreground">2020</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.Furnishing}</p>
                          <p className="text-sm text-muted-foreground">Semi-Furnished</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="features" className="pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Air Conditioning</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Balcony</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Gym</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Swimming Pool</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Garden</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Parking</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Security</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-sm">Power Backup</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <h2 className="text-xl font-semibold mb-4">address</h2>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop"
                      alt="Map address"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <p className="text-white font-medium">Interactive map will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm animate-slide-in-right">
                  <h2 className="text-xl font-semibold mb-4">Enquire Now</h2>
                  <Link href={`/enquiry/property/${property.id}`}>
                    <Button className="w-full transition-transform hover:scale-105">Send Enquiry</Button>
                  </Link>
                  <Separator className="my-4" />
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call us at</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-lg shadow-sm animate-slide-in-right"
                  style={{ animationDelay: "100ms" }}
                >
                  <h2 className="text-xl font-semibold mb-4">Listed By</h2>
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-muted rounded-full mr-4 overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
                        alt="Agent"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{property.listedBy}</p>
                      <p className="text-sm text-muted-foreground">Property Agent</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Listed on April 15, 2023</span>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white p-6 rounded-lg shadow-sm animate-slide-in-right"
                  style={{ animationDelay: "200ms" }}
                >
                  <h2 className="text-xl font-semibold mb-4">Similar Properties</h2>
                  <div className="space-y-4">
                    {properties.slice(0, 3).map((p, index) => (
                      <Link href={`/properties/${p.id}`} key={p.id} className="flex gap-3 group">
                        <div className="relative h-16 w-20 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={p.image || "/placeholder.svg"}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{p.address}</p>
                          <p className="text-sm font-medium">₹{p.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

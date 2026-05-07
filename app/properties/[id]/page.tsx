


// "use client";
// import React from "react";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Bath,
//   Bed,
//   Calendar,
//   ChevronRight,
//   Home,
//   MapPin,
//   Move,
//   Phone,
//   Share2,
//   Tag,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import { BASE_URL } from "@/app/baseurl";
// import { useLanguage } from "@/context/language-context";

// interface Property {
//   id: string;
//   title: string;
//   address: string;
//   images?: string[];
//   image?: string;
//   type: "rent" | "sale";
//   price: number;
//   bedrooms: number;
//   bathrooms: number;
//   area: number;
//   category?: string;
//   listedBy?: string;
//   ownerName?: string;
// }

// export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
//    const { id } = React.use(params); 
//   const { translations } = useLanguage();
//   const t = translations;

//   const [property, setProperty] = useState<Property | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Fetch single property by ID
//   useEffect(() => {
//     const fetchPropertyById = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("usertoken");
//         const response = await fetch(`${BASE_URL}/property/${ id }`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch property details.");
//         }

//         const data = await response.json();
//         setProperty(data);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPropertyById();
//   }, [ id ]);

//   if (loading)
//     return <p className="text-center py-10 text-muted-foreground">Loading property details...</p>;

//   if (error)
//     return (
//       <p className="text-center py-10 text-red-500">
//         {error || "Error fetching property details."}
//       </p>
//     );

//   if (!property)
//     return (
//       <p className="text-center py-10 text-red-500">
//         No property found for this ID.
//       </p>
//     );

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         {/* Breadcrumb */}
//         <div className="bg-muted py-4">
//           <div className="container px-4 md:px-6">
//             <div className="flex items-center text-sm">
//               <Link href="/" className="text-muted-foreground hover:text-foreground">
//                 {t.home}
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//               <Link href="/properties" className="text-muted-foreground hover:text-foreground">
//                 {t.Properties}
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//               <span className="font-medium truncate">{property.title}</span>
//             </div>
//           </div>
//         </div>

//         {/* Property Header */}
//         <section className="py-6 md:py-10 animate-fade-up">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//                   {property.title}
//                 </h1>
//                 <div className="flex items-center mt-2 text-muted-foreground">
//                   <MapPin className="h-4 w-4 mr-1" />
//                   <span>{property.address}</span>
//                 </div>
//               </div>
//               <div className="flex flex-col items-end">
//                 <div className="flex items-center">
//                   <Tag className="h-5 w-5 mr-2 text-primary" />
//                   <span className="text-2xl md:text-3xl font-bold">
//                     ₹{property.price.toLocaleString()}
//                   </span>
//                 </div>
//                 {property.type === "rent" && (
//                   <span className="text-sm text-muted-foreground">/{t.month}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Property Images */}
//         <section className="pb-10">
//           <div className="container px-4 md:px-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="relative aspect-[4/3] rounded-lg overflow-hidden animate-zoom-in">
//                 <Image
//                   src={
//                     property.images && property.images.length > 0
//                       ? property.images[0]
//                       : property.image || "/placeholder.svg"
//                   }
//                   alt={property.title}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {(property.images?.slice(1, 5) || []).map((img, i) => (
//                   <div
//                     key={i}
//                     className="relative aspect-square rounded-lg overflow-hidden animate-fade-in"
//                     style={{ animationDelay: `${(i + 1) * 100}ms` }}
//                   >
//                     <Image
//                       src={img}
//                       alt={`${property.title} image ${i + 2}`}
//                       fill
//                       className="object-cover hover:scale-110 transition-transform duration-500"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-end mt-4">
//               {/* <Button variant="outline" size="sm" className="animate-slide-in-right">
//                 <Share2 className="h-4 w-4 mr-2" />
//                 {t.Share}
//               </Button> */}
//             </div>
//           </div>
//         </section>

//         {/* Overview + Tabs + Enquiry */}
//         <section className="py-10 bg-muted/30">
//           <div className="container px-4 md:px-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Overview + Tabs */}
//               <div className="lg:col-span-2 space-y-8">
//                 <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-up">
//                   <h2 className="text-xl font-semibold mb-4">{t.Overview}</h2>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
//                       <Bed className="h-6 w-6 text-primary mb-2" />
//                       <span className="text-sm text-muted-foreground">{t.Bedrooms}</span>
//                       <span className="font-medium">{property.bedrooms}</span>
//                     </div>
//                     <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
//                       <Bath className="h-6 w-6 text-primary mb-2" />
//                       <span className="text-sm text-muted-foreground">{t.bathrooms}</span>
//                       <span className="font-medium">{property.bathrooms}</span>
//                     </div>
//                     <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
//                       <Move className="h-6 w-6 text-primary mb-2" />
//                       <span className="text-sm text-muted-foreground">{t.Area}</span>
//                       <span className="font-medium">{property.area} sqft</span>
//                     </div>
//                     <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
//                       <Home className="h-6 w-6 text-primary mb-2" />
//                       <span className="text-sm text-muted-foreground">{t.PropertyType}</span>
//                       <span className="font-medium capitalize">{property.category}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-up">
//                   <Tabs defaultValue="description">
//                     <TabsList className="grid w-full grid-cols-3">
//                       <TabsTrigger value="description">{t.Description}</TabsTrigger>
//                       <TabsTrigger value="details">{t.Details}</TabsTrigger>
//                       <TabsTrigger value="features">{t.Features}</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="description" className="pt-4">
//                       <p className="text-muted-foreground">
//                         {t.Thisbeautiful} {property.bedrooms} {t.bedroompropertyislocatedintheheartof}{" "}
//                         {property.address}. {t.Thepropertyoffersspaciousroomswithmodernamenitiesandisperfectfor}{" "}
//                         {property.type === "rent" ? "renting" : "buying"}.
//                       </p>
//                     </TabsContent>
//                   </Tabs>
//                 </div>
//               </div>

//               {/* Sidebar */}
//               <div className="space-y-6">
//                 <div className="bg-white p-6 rounded-lg shadow-sm animate-slide-in-right">
//                   <h2 className="text-xl font-semibold mb-4">Enquire Now</h2>
//                   <Link href={`/enquiry/property/${property.id}`}>
//                     <Button className="w-full transition-transform hover:scale-105">
//                       Send Enquiry
//                     </Button>
//                   </Link>
//                   <Separator className="my-4" />
//                   <div className="flex items-center">
//                     <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
//                       <Phone className="h-6 w-6 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Call us at</p>
//                       <p className="font-medium">+91 98765 43210</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }


"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  ChevronRight,
  Home,
  MapPin,
  Move,
  Phone,
  Share2,
  Tag,
  Ruler,
  Building2,
  User,
  Shield,
  Wifi,
  ParkingCircle,
  Wind,
  Thermometer,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Heart,
  Printer,
  Mail,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Calendar,
  Clock,
  Eye,
  Award,
  Car,
  Coffee,
  Dumbbell,
  Utensils,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";
import { useLanguage } from "@/context/language-context";

interface Property {
  id: string;
  title: string;
  address: string;
  images?: string[];
  image?: string;
  type: "rent" | "sale";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  category?: string;
  listedBy?: string;
  ownerName?: string;
  description?: string;
  yearBuilt?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  furnishing?: string;
  parking?: string;
  amenities?: string[];
  createdAt?: string;
  views?: number;
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { translations } = useLanguage();
  const t = translations;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch single property by ID
  useEffect(() => {
    const fetchPropertyById = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("usertoken");
        const response = await fetch(`${BASE_URL}/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property details.");
        }

        const data = await response.json();
        setProperty(data);
        
        const firstImage = data.images && data.images.length > 0 
          ? data.images[0] 
          : (data.image || "/api/placeholder/1200/800");
        setSelectedImage(firstImage);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyById();
  }, [id]);

  const formatPrice = (price: number, type: string) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getAllImages = () => {
    const images = [];
    if (property?.images && property.images.length > 0) {
      images.push(...property.images);
    } else if (property?.image) {
      images.push(property.image);
    } else {
      images.push("/api/placeholder/1200/800");
    }
    return images;
  };

  const allImages = getAllImages();
  const hasMultipleImages = allImages.length > 1;
  const remainingImages = allImages.slice(1, 5);
  const hasMoreImages = allImages.length > 5;

  const nextImage = () => {
    if (hasMultipleImages) {
      setLightboxIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const amenitiesList = [
    { name: "Swimming Pool", icon: <Wifi className="h-4 w-4" />, available: true },
    { name: "Gymnasium", icon: <Dumbbell className="h-4 w-4" />, available: true },
    { name: "Parking", icon: <Car className="h-4 w-4" />, available: true },
    { name: "24/7 Security", icon: <Shield className="h-4 w-4" />, available: true },
    { name: "Central AC", icon: <Wind className="h-4 w-4" />, available: false },
    { name: "Power Backup", icon: <Sparkles className="h-4 w-4" />, available: true },
    { name: "Club House", icon: <Coffee className="h-4 w-4" />, available: true },
    { name: "Children's Play Area", icon: <Trees className="h-4 w-4" />, available: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-40 bg-gray-200 rounded-xl"></div>
                  <div className="h-96 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md text-center p-8">
            <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Property</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md text-center p-8">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Property Not Found</h3>
            <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container px-4 md:px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium truncate max-w-[300px]">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Property Header */}
        <section className="pt-6 pb-4 bg-white border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge className={property.type === "rent" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}>
                    {property.type === "rent" ? "For Rent" : "For Sale"}
                  </Badge>
                  {property.category && (
                    <Badge variant="secondary">{property.category}</Badge>
                  )}
                  {/* <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{property.views || 245} views</span>
                  </div> */}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{property.address}</span>
                </div>
              </div>
              
              <div className="text-left lg:text-right">
                <div className="mb-1">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {formatPrice(property.price, property.type)}
                  </span>
                  {property.type === "rent" && (
                    <span className="text-sm text-gray-500 ml-1">/month</span>
                  )}
                </div>
                {/* <div className="flex items-center gap-2 mt-3 justify-start lg:justify-end">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    Save
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section - Professional Layout */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Image - Takes 3/4 on desktop */}
              <div className="lg:col-span-3">
                <div 
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-pointer group"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <Image
                    src={selectedImage}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                  
                  {/* Overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10 backdrop-blur-sm"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                  </button>
                  
                  {/* Navigation Arrows on Main Image */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIndex = allImages.indexOf(selectedImage);
                          const newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                          setSelectedImage(allImages[newIndex]);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIndex = allImages.indexOf(selectedImage);
                          const newIndex = (currentIndex + 1) % allImages.length;
                          setSelectedImage(allImages[newIndex]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  
                  {/* Expand Icon */}
                  <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all">
                    🔍 Click to enlarge
                  </div>

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                      {allImages.indexOf(selectedImage) + 1} / {allImages.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Grid - Takes 1/4 on desktop */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {remainingImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-video lg:aspect-square rounded-xl overflow-hidden bg-gray-100 transition-all ${
                        selectedImage === img 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${property.title} thumbnail ${i + 2}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {i === 3 && hasMoreImages && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold">+{allImages.length - 4} more</span>
                        </div>
                      )}
                    </button>
                  ))}
                  {remainingImages.length === 0 && (
                    <div className="aspect-video lg:aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-400 text-sm text-center px-4">No additional images</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div 
              className="relative w-[90vw] h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[lightboxIndex]}
                alt={`${property.title} - Image ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {lightboxIndex + 1} of {allImages.length}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2">
                          <Bed className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500">Bedrooms</p>
                        <p className="text-xl font-bold text-gray-900">{property.bedrooms}</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2">
                          <Bath className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500">Bathrooms</p>
                        <p className="text-xl font-bold text-gray-900">{property.bathrooms}</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2">
                          <Ruler className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="text-xl font-bold text-gray-900">{property.area} sq.ft</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-2">
                          <Building2 className="h-6 w-6 text-orange-600" />
                        </div>
                        <p className="text-xs text-gray-500">Property Type</p>
                        <p className="text-xl font-bold text-gray-900 capitalize">{property.category || "Apartment"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs Section */}
                <Card>
                  <CardContent className="p-0">
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 rounded-t-xl rounded-b-none">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="p-6 space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          {property.description || 
                            `This beautiful ${property.bedrooms} bedroom ${property.category || "property"} is located in the heart of ${property.address}. 
                            The property offers spacious rooms with modern amenities and is perfect for 
                            ${property.type === "rent" ? "renting" : "buying"}. Features include large windows for natural light, 
                            premium flooring, and modern fixtures throughout.`}
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">Prime Location Benefits</p>
                              <p className="text-sm text-gray-600 mt-1">
                                ✓ Close to schools & hospitals<br />
                                ✓ Easy access to public transport<br />
                                ✓ Near shopping centers & markets
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 mb-3">Property Specifications</h4>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Property ID</span>
                              <span className="font-medium text-gray-900">#{property.id}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Listed By</span>
                              <span className="font-medium text-gray-900">{property.ownerName || "Property Owner"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Furnishing Status</span>
                              <span className="font-medium text-gray-900">{property.furnishing || "Semi-Furnished"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Car Parking</span>
                              <span className="font-medium text-gray-900">{property.parking || "1 Covered"}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 mb-3">Additional Info</h4>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Floor</span>
                              <span className="font-medium text-gray-900">{property.floorNumber || 3} of {property.totalFloors || 5}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Facing</span>
                              <span className="font-medium text-gray-900">{property.facing || "North-East"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Year Built</span>
                              <span className="font-medium text-gray-900">{property.yearBuilt || 2022}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-gray-500">Age of Property</span>
                              <span className="font-medium text-gray-900">2-3 Years</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="amenities" className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                          {amenitiesList.map((amenity, index) => (
                            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${amenity.available ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
                              <div className={`${amenity.available ? 'text-primary' : 'text-gray-400'}`}>
                                {amenity.icon}
                              </div>
                              <div>
                                <span className={`text-sm ${amenity.available ? 'text-gray-700' : 'text-gray-500'}`}>
                                  {amenity.name}
                                </span>
                                {!amenity.available && (
                                  <p className="text-xs text-gray-400">Coming Soon</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Location Card */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Location & Neighborhood</CardTitle>
                    <CardDescription>What's nearby this property</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Interactive map will be available soon</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">School (0.5 km)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Hospital (1 km)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Metro (2 km)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Market (1.5 km)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </div>

              {/* Right Column - Contact & Enquiry (Sticky) */}
              <div className="space-y-6">
                {/* Contact Card */}
                <Card className="shadow-lg border-t-4 border-t-primary sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Interested in this property?</CardTitle>
                    <CardDescription>Get in touch with us today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href={`/enquiry/property/${property.id}`}>
                      <Button className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-md">
                        <MessageCircle className="h-4 w-4" />
                        Send Enquiry
                      </Button>
                    </Link>
                    
                   
<Button 
  variant="outline" 
  className="w-full gap-2"
  onClick={() => {
    const message = `Hi, I'm interested in ${property.title} at ${property.address}. Price: ${property.price.toLocaleString()}. Please share more details.`;
    window.open(`https://wa.me/919494942894?text=${encodeURIComponent(message)}`, '_blank');
  }}
>
  <MessageCircle className="h-4 w-4" />
  WhatsApp
</Button>
                    
                    <Separator />
                    
                    {/* Owner Info */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Property Listed By</p>
                        <p className="font-semibold text-gray-900">{property.ownerName || "Verified Owner"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <p className="text-xs text-green-600">Verified Member</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Posted on:
                        </span>
                        <span className="font-medium text-gray-900">
                          {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "Dec 15, 2024"}
                        </span>
                      </div>
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Eye className="h-3 w-3" /> Total Views:
                        </span>
                        <span className="font-medium text-gray-900">{property.views || 245}</span>
                      </div> */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Last Updated:
                        </span>
                        <span className="font-medium text-gray-900">2 days ago</span>
                      </div>
                    </div>

                    <Separator />
                    
                    {/* Call to Action */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">Need more information?</p>
                       <Link href={`/enquiry/property/${property.id}`}>
                      <Button variant="link" className="text-primary gap-1 text-sm">
                        Schedule a Site Visit
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Similar Properties Preview */}
                {/* <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Similar Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">2 BHK Apartment</p>
                        <p className="text-xs text-gray-500">Downtown Area</p>
                        <p className="text-xs font-semibold text-primary mt-1">₹85 Lakh</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">3 BHK Villa</p>
                        <p className="text-xs text-gray-500">Suburban Area</p>
                        <p className="text-xs font-semibold text-primary mt-1">₹1.2 Cr</p>
                      </div>
                    </div>
                    <Button variant="link" className="w-full text-primary gap-1 text-sm mt-2">
                      View All Similar Properties
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
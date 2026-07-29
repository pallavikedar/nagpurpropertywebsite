// "use client";
// import React from "react";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Bath,
//   Bed,
//   ChevronRight,
//   Home,
//   MapPin,
//   Move,
//   Phone,
//   Share2,
//   Tag,
//   Ruler,
//   Building2,
//   User,
//   Shield,
//   Wifi,
//   ParkingCircle,
//   Wind,
//   Thermometer,
//   Sparkles,
//   ArrowRight,
//   CheckCircle,
//   Heart,
//   Printer,
//   Mail,
//   MessageCircle,
//   X,
//   ChevronLeft,
//   ChevronRight as ChevronRightIcon,
//   Calendar,
//   Clock,
//   Eye,
//   Award,
//   Car,
//   Coffee,
//   Dumbbell,
//   Utensils,
//   Trees,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
//   description?: string;
//   yearBuilt?: number;
//   floorNumber?: number;
//   totalFloors?: number;
//   facing?: string;
//   furnishing?: string;
//   parking?: string;
//   amenities?: string[];
//   createdAt?: string;
//   views?: number;
// }

// export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = React.use(params);
//   const { translations } = useLanguage();
//   const t = translations;

//   const [property, setProperty] = useState<Property | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
//   const [lightboxIndex, setLightboxIndex] = useState(0);

//   // Fetch single property by ID
//   useEffect(() => {
//     const fetchPropertyById = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("usertoken");
//         const response = await fetch(`${BASE_URL}/property/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch property details.");
//         }

//         const data = await response.json();
//         setProperty(data);
        
//         const firstImage = data.images && data.images.length > 0 
//           ? data.images[0] 
//           : (data.image || "/api/placeholder/1200/800");
//         setSelectedImage(firstImage);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPropertyById();
//   }, [id]);

//   const formatPrice = (price: number, type: string) => {
//     if (price >= 10000000) {
//       return `₹${(price / 10000000).toFixed(2)} Cr`;
//     } else if (price >= 100000) {
//       return `₹${(price / 100000).toFixed(2)} L`;
//     }
//     return `₹${price.toLocaleString()}`;
//   };

//   const getAllImages = () => {
//     const images = [];
//     if (property?.images && property.images.length > 0) {
//       images.push(...property.images);
//     } else if (property?.image) {
//       images.push(property.image);
//     } else {
//       images.push("/api/placeholder/1200/800");
//     }
//     return images;
//   };

//   const allImages = getAllImages();
//   const hasMultipleImages = allImages.length > 1;
//   const remainingImages = allImages.slice(1, 5);
//   const hasMoreImages = allImages.length > 5;

//   const nextImage = () => {
//     if (hasMultipleImages) {
//       setLightboxIndex((prev) => (prev + 1) % allImages.length);
//     }
//   };

//   const prevImage = () => {
//     if (hasMultipleImages) {
//       setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
//     }
//   };

//   const amenitiesList = [
//     { name: "Swimming Pool", icon: <Wifi className="h-4 w-4" />, available: true },
//     { name: "Gymnasium", icon: <Dumbbell className="h-4 w-4" />, available: true },
//     { name: "Parking", icon: <Car className="h-4 w-4" />, available: true },
//     { name: "24/7 Security", icon: <Shield className="h-4 w-4" />, available: true },
//     { name: "Central AC", icon: <Wind className="h-4 w-4" />, available: false },
//     { name: "Power Backup", icon: <Sparkles className="h-4 w-4" />, available: true },
//     { name: "Club House", icon: <Coffee className="h-4 w-4" />, available: true },
//     { name: "Children's Play Area", icon: <Trees className="h-4 w-4" />, available: true },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Navbar />
//         <main className="flex-1">
//           <div className="container px-4 md:px-6 py-8">
//             <div className="animate-pulse space-y-6">
//               <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//               <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-6">
//                   <div className="h-40 bg-gray-200 rounded-xl"></div>
//                   <div className="h-96 bg-gray-200 rounded-xl"></div>
//                 </div>
//                 <div className="h-96 bg-gray-200 rounded-xl"></div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Navbar />
//         <main className="flex-1 flex items-center justify-center">
//           <Card className="max-w-md text-center p-8">
//             <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Property</div>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <Button onClick={() => window.location.reload()}>Try Again</Button>
//           </Card>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Navbar />
//         <main className="flex-1 flex items-center justify-center">
//           <Card className="max-w-md text-center p-8">
//             <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Property Not Found</h3>
//             <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
//             <Link href="/properties">
//               <Button>Browse Properties</Button>
//             </Link>
//           </Card>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar />
      
//       <main className="flex-1">
//         {/* Breadcrumb */}
//         <div className="bg-white border-b sticky top-0 z-10">
//           <div className="container px-4 md:px-6 py-3">
//             <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
//               <Link href="/" className="hover:text-primary transition-colors">Home</Link>
//               <ChevronRight className="h-3 w-3" />
//               <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
//               <ChevronRight className="h-3 w-3" />
//               <span className="text-foreground font-medium truncate max-w-[300px]">{property.title}</span>
//             </div>
//           </div>
//         </div>

//         {/* Property Header */}
//         <section className="pt-6 pb-4 bg-white border-b">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-3 flex-wrap">
//                   <Badge className={property.type === "rent" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}>
//                     {property.type === "rent" ? "For Rent" : "For Sale"}
//                   </Badge>
//                   {property.category && (
//                     <Badge variant="secondary">{property.category}</Badge>
//                   )}
//                   {/* <div className="flex items-center gap-1 text-xs text-gray-500">
//                     <Eye className="h-3 w-3" />
//                     <span>{property.views || 245} views</span>
//                   </div> */}
//                 </div>
//                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
//                   {property.title}
//                 </h1>
//                 <div className="flex items-center text-gray-500">
//                   <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
//                   <span className="text-sm">{property.address}</span>
//                 </div>
//               </div>
              
//               <div className="text-left lg:text-right">
//                 <div className="mb-1">
//                   <span className="text-3xl md:text-4xl font-bold text-primary">
//                     {formatPrice(property.price, property.type)}
//                   </span>
//                   {property.type === "rent" && (
//                     <span className="text-sm text-gray-500 ml-1">/month</span>
//                   )}
//                 </div>
//                 {/* <div className="flex items-center gap-2 mt-3 justify-start lg:justify-end">
//                   <Button variant="outline" size="sm" className="gap-2">
//                     <Share2 className="h-4 w-4" />
//                     Share
//                   </Button>
//                   <Button variant="outline" size="sm" className="gap-2">
//                     <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
//                     Save
//                   </Button>
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Gallery Section - Professional Layout */}
//         <section className="py-8">
//           <div className="container px-4 md:px-6">
//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//               {/* Main Image - Takes 3/4 on desktop */}
//               <div className="lg:col-span-3">
//                 <div 
//                   className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-pointer group"
//                   onClick={() => setIsLightboxOpen(true)}
//                 >
//                   <Image
//                     src={selectedImage}
//                     alt={property.title}
//                     fill
//                     className="object-cover"
//                     priority
//                     sizes="(max-width: 1024px) 100vw, 75vw"
//                   />
                  
//                   {/* Overlay gradient for better text visibility */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
//                   {/* Favorite Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsFavorite(!isFavorite);
//                     }}
//                     className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10 backdrop-blur-sm"
//                   >
//                     <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
//                   </button>
                  
//                   {/* Navigation Arrows on Main Image */}
//                   {hasMultipleImages && (
//                     <>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           const currentIndex = allImages.indexOf(selectedImage);
//                           const newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
//                           setSelectedImage(allImages[newIndex]);
//                         }}
//                         className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
//                       >
//                         <ChevronLeft className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           const currentIndex = allImages.indexOf(selectedImage);
//                           const newIndex = (currentIndex + 1) % allImages.length;
//                           setSelectedImage(allImages[newIndex]);
//                         }}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
//                       >
//                         <ChevronRightIcon className="h-5 w-5" />
//                       </button>
//                     </>
//                   )}
                  
//                   {/* Expand Icon */}
//                   <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all">
//                     🔍 Click to enlarge
//                   </div>

//                   {/* Image Counter */}
//                   {hasMultipleImages && (
//                     <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
//                       {allImages.indexOf(selectedImage) + 1} / {allImages.length}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Thumbnail Grid - Takes 1/4 on desktop */}
//               <div className="lg:col-span-1">
//                 <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
//                   {remainingImages.map((img, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setSelectedImage(img)}
//                       className={`relative aspect-video lg:aspect-square rounded-xl overflow-hidden bg-gray-100 transition-all ${
//                         selectedImage === img 
//                           ? 'ring-2 ring-primary ring-offset-2' 
//                           : 'hover:ring-2 hover:ring-gray-300'
//                       }`}
//                     >
//                       <Image
//                         src={img}
//                         alt={`${property.title} thumbnail ${i + 2}`}
//                         fill
//                         className="object-cover hover:scale-110 transition-transform duration-300"
//                       />
//                       {i === 3 && hasMoreImages && (
//                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                           <span className="text-white font-semibold">+{allImages.length - 4} more</span>
//                         </div>
//                       )}
//                     </button>
//                   ))}
//                   {remainingImages.length === 0 && (
//                     <div className="aspect-video lg:aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
//                       <p className="text-gray-400 text-sm text-center px-4">No additional images</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Lightbox Modal */}
//         {isLightboxOpen && (
//           <div 
//             className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
//             onClick={() => setIsLightboxOpen(false)}
//           >
//             <button
//               onClick={() => setIsLightboxOpen(false)}
//               className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
//             >
//               <X className="h-6 w-6 text-white" />
//             </button>
            
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 prevImage();
//               }}
//               className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
//             >
//               <ChevronLeft className="h-6 w-6 text-white" />
//             </button>
            
//             <div 
//               className="relative w-[90vw] h-[85vh]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Image
//                 src={allImages[lightboxIndex]}
//                 alt={`${property.title} - Image ${lightboxIndex + 1}`}
//                 fill
//                 className="object-contain"
//                 sizes="90vw"
//               />
//             </div>
            
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 nextImage();
//               }}
//               className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
//             >
//               <ChevronRightIcon className="h-6 w-6 text-white" />
//             </button>
            
//             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
//               {lightboxIndex + 1} of {allImages.length}
//             </div>
//           </div>
//         )}

//         {/* Main Content Area */}
//         <section className="py-8">
//           <div className="container px-4 md:px-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left Column - Details */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Quick Stats Card */}
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2">
//                           <Bed className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <p className="text-xs text-gray-500">Bedrooms</p>
//                         <p className="text-xl font-bold text-gray-900">{property.bedrooms}</p>
//                       </div>
//                       <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2">
//                           <Bath className="h-6 w-6 text-purple-600" />
//                         </div>
//                         <p className="text-xs text-gray-500">Bathrooms</p>
//                         <p className="text-xl font-bold text-gray-900">{property.bathrooms}</p>
//                       </div>
//                       <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2">
//                           <Ruler className="h-6 w-6 text-green-600" />
//                         </div>
//                         <p className="text-xs text-gray-500">Area</p>
//                         <p className="text-xl font-bold text-gray-900">{property.area} sq.ft</p>
//                       </div>
//                       <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-2">
//                           <Building2 className="h-6 w-6 text-orange-600" />
//                         </div>
//                         <p className="text-xs text-gray-500">Property Type</p>
//                         <p className="text-xl font-bold text-gray-900 capitalize">{property.category || "Apartment"}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Tabs Section */}
//                 <Card>
//                   <CardContent className="p-0">
//                     <Tabs defaultValue="description" className="w-full">
//                       <TabsList className="grid w-full grid-cols-3 rounded-t-xl rounded-b-none">
//                         <TabsTrigger value="description">Description</TabsTrigger>
//                         <TabsTrigger value="details">Details</TabsTrigger>
//                         <TabsTrigger value="amenities">Amenities</TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="description" className="p-6 space-y-4">
//                         <p className="text-gray-700 leading-relaxed">
//                           {property.description || 
//                             `This beautiful ${property.bedrooms} bedroom ${property.category || "property"} is located in the heart of ${property.address}. 
//                             The property offers spacious rooms with modern amenities and is perfect for 
//                             ${property.type === "rent" ? "renting" : "buying"}. Features include large windows for natural light, 
//                             premium flooring, and modern fixtures throughout.`}
//                         </p>
//                         <div className="bg-blue-50 p-4 rounded-lg">
//                           <div className="flex items-start gap-3">
//                             <Award className="h-5 w-5 text-blue-600 mt-0.5" />
//                             <div>
//                               <p className="font-semibold text-gray-900">Prime Location Benefits</p>
//                               <p className="text-sm text-gray-600 mt-1">
//                                 ✓ Close to schools & hospitals<br />
//                                 ✓ Easy access to public transport<br />
//                                 ✓ Near shopping centers & markets
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="details" className="p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div className="space-y-3">
//                             <h4 className="font-semibold text-gray-900 mb-3">Property Specifications</h4>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Property ID</span>
//                               <span className="font-medium text-gray-900">#{property.id}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Listed By</span>
//                               <span className="font-medium text-gray-900">{property.ownerName || "Property Owner"}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Furnishing Status</span>
//                               <span className="font-medium text-gray-900">{property.furnishing || "Semi-Furnished"}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Car Parking</span>
//                               <span className="font-medium text-gray-900">{property.parking || "1 Covered"}</span>
//                             </div>
//                           </div>
//                           <div className="space-y-3">
//                             <h4 className="font-semibold text-gray-900 mb-3">Additional Info</h4>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Floor</span>
//                               <span className="font-medium text-gray-900">{property.floorNumber || 3} of {property.totalFloors || 5}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Facing</span>
//                               <span className="font-medium text-gray-900">{property.facing || "North-East"}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Year Built</span>
//                               <span className="font-medium text-gray-900">{property.yearBuilt || 2022}</span>
//                             </div>
//                             <div className="flex justify-between py-2 border-b">
//                               <span className="text-gray-500">Age of Property</span>
//                               <span className="font-medium text-gray-900">2-3 Years</span>
//                             </div>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="amenities" className="p-6">
//                         <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
//                           {amenitiesList.map((amenity, index) => (
//                             <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${amenity.available ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
//                               <div className={`${amenity.available ? 'text-primary' : 'text-gray-400'}`}>
//                                 {amenity.icon}
//                               </div>
//                               <div>
//                                 <span className={`text-sm ${amenity.available ? 'text-gray-700' : 'text-gray-500'}`}>
//                                   {amenity.name}
//                                 </span>
//                                 {!amenity.available && (
//                                   <p className="text-xs text-gray-400">Coming Soon</p>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </TabsContent>
//                     </Tabs>
//                   </CardContent>
//                 </Card>

//                 {/* Location Card */}
//                 {/* <Card>
//                   <CardHeader>
//                     <CardTitle className="text-xl">Location & Neighborhood</CardTitle>
//                     <CardDescription>What's nearby this property</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-48 flex items-center justify-center">
//                       <div className="text-center">
//                         <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                         <p className="text-gray-500 text-sm">Interactive map will be available soon</p>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
//                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                         <span className="text-xs text-gray-600">School (0.5 km)</span>
//                       </div>
//                       <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                         <span className="text-xs text-gray-600">Hospital (1 km)</span>
//                       </div>
//                       <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
//                         <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                         <span className="text-xs text-gray-600">Metro (2 km)</span>
//                       </div>
//                       <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
//                         <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                         <span className="text-xs text-gray-600">Market (1.5 km)</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card> */}
//               </div>

//               {/* Right Column - Contact & Enquiry (Sticky) */}
//               <div className="space-y-6">
//                 {/* Contact Card */}
//                 <Card className="shadow-lg border-t-4 border-t-primary sticky top-24">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-xl">Interested in this property?</CardTitle>
//                     <CardDescription>Get in touch with us today</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <Link href={`/enquiry/property/${property.id}`}>
//                       <Button className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-md">
//                         <MessageCircle className="h-4 w-4" />
//                         Send Enquiry
//                       </Button>
//                     </Link>
                    
                   
// <Button 
//   variant="outline" 
//   className="w-full gap-2"
//   onClick={() => {
//     const message = `Hi, I'm interested in ${property.title} at ${property.address}. Price: ${property.price.toLocaleString()}. Please share more details.`;
//     window.open(`https://wa.me/919494942894?text=${encodeURIComponent(message)}`, '_blank');
//   }}
// >
//   <MessageCircle className="h-4 w-4" />
//   WhatsApp
// </Button>
                    
//                     <Separator />
                    
//                     {/* Owner Info */}
//                     <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
//                       <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
//                         <User className="h-6 w-6 text-primary" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs text-gray-500">Property Listed By</p>
//                         <p className="font-semibold text-gray-900">{property.ownerName || "Verified Owner"}</p>
//                         <div className="flex items-center gap-1 mt-1">
//                           <CheckCircle className="h-3 w-3 text-green-500" />
//                           <p className="text-xs text-green-600">Verified Member</p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Quick Stats */}
//                     <div className="space-y-2 pt-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500 flex items-center gap-1">
//                           <Calendar className="h-3 w-3" /> Posted on:
//                         </span>
//                         <span className="font-medium text-gray-900">
//                           {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "Dec 15, 2024"}
//                         </span>
//                       </div>
//                       {/* <div className="flex justify-between text-sm">
//                         <span className="text-gray-500 flex items-center gap-1">
//                           <Eye className="h-3 w-3" /> Total Views:
//                         </span>
//                         <span className="font-medium text-gray-900">{property.views || 245}</span>
//                       </div> */}
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500 flex items-center gap-1">
//                           <Clock className="h-3 w-3" /> Last Updated:
//                         </span>
//                         <span className="font-medium text-gray-900">2 days ago</span>
//                       </div>
//                     </div>

//                     <Separator />
                    
//                     {/* Call to Action */}
//                     <div className="text-center">
//                       <p className="text-xs text-gray-500 mb-2">Need more information?</p>
//                        <Link href={`/enquiry/property/${property.id}`}>
//                       <Button variant="link" className="text-primary gap-1 text-sm">
//                         Schedule a Site Visit
//                         <ArrowRight className="h-3 w-3" />
//                       </Button>
//                       </Link>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Similar Properties Preview */}
//                 {/* <Card className="shadow-sm">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-lg">Similar Properties</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer">
//                       <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm truncate">2 BHK Apartment</p>
//                         <p className="text-xs text-gray-500">Downtown Area</p>
//                         <p className="text-xs font-semibold text-primary mt-1">₹85 Lakh</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer">
//                       <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm truncate">3 BHK Villa</p>
//                         <p className="text-xs text-gray-500">Suburban Area</p>
//                         <p className="text-xs font-semibold text-primary mt-1">₹1.2 Cr</p>
//                       </div>
//                     </div>
//                     <Button variant="link" className="w-full text-primary gap-1 text-sm mt-2">
//                       View All Similar Properties
//                       <ArrowRight className="h-3 w-3" />
//                     </Button>
//                   </CardContent>
//                 </Card> */}
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
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  ChevronRight,
  Home,
  MapPin,
  Ruler,
  Building2,
  User,
  Shield,
  Wifi,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Calendar,
  Award,
  Car,
  Coffee,
  Dumbbell,
  Wind,
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

/**
 * NOTE ON FIELD MAPPING
 * ---------------------
 * Your API returns raw fields like `propertyFor`, `propertyType`, `ownerPhone`,
 * `ownerEmail`, `buildUpArea`, etc. (see the sample payload you shared).
 * The old component expected a different shape (`type`, `category`, ...) and
 * never mapped between the two, so several fields silently fell back to
 * hardcoded defaults ("North-East", "2022", etc.) even when real data existed.
 * `normalizeProperty()` below does that mapping once, in one place.
 */

interface RawProperty {
  id: number | string;
  title: string;
  description?: string;
  propertyFor?: string; // "Sale" | "Rent"
  propertyType?: string; // "Apartment", "Villa", "Plot", "Farmland" ...
  price: number;
  area?: number; // acres, for Farmland
  buildUpArea?: number | null;
  carpetArea?: number | null;
  plotArea?: number | null;
  plotType?: string | null; // "RL" | "Registry"
  ratePerSqft?: number | null;
  brokerage?: number | null;
  bedrooms: number;
  bathrooms: number;
  furnishing?: string;
  amenities?: string[];
  address: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  images?: string[];
  image?: string;
  createdAt?: string;
  views?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  yearBuilt?: number;
  parking?: string;
}

interface Property {
  id: string;
  title: string;
  address: string;
  images: string[];
  type: "rent" | "sale";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  category: string;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail?: string;
  description?: string;
  yearBuilt?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  furnishing?: string;
  parking?: string;
  plotType?: string;
  ratePerSqft?: number;
  brokerage?: number;
  amenities: string[];
  createdAt?: string;
  views?: number;
}

/* Categories where the property IS the land itself — bedrooms, bathrooms,
   furnishing, car parking, and floor number don't apply and shouldn't be
   asked about or displayed. Everything else (Apartment, Villa, Duplex, Row
   House, Independent House) is a built residential unit and keeps them. */
const LAND_CATEGORIES = ["Plot", "Farmland"];

function normalizeProperty(raw: RawProperty): Property {
  const images =
    raw.images && raw.images.length > 0
      ? raw.images
      : raw.image
      ? [raw.image]
      : [];

  return {
    id: String(raw.id),
    title: raw.title?.trim() || "Untitled Property",
    address: raw.address?.trim() || [raw.locality, raw.city, raw.state].filter(Boolean).join(", "),
    images,
    type: raw.propertyFor?.toLowerCase() === "rent" ? "rent" : "sale",
    price: raw.price ?? 0,
    bedrooms: raw.bedrooms ?? 0,
    bathrooms: raw.bathrooms ?? 0,
    area: raw.buildUpArea || raw.carpetArea || raw.plotArea || raw.area || 0,
    category: raw.propertyType || "Apartment",
    ownerName: raw.ownerName?.trim() || "Verified Owner",
    ownerPhone: raw.ownerPhone,
    ownerEmail: raw.ownerEmail,
    description: raw.description,
    yearBuilt: raw.yearBuilt,
    floorNumber: raw.floorNumber,
    totalFloors: raw.totalFloors,
    facing: raw.facing,
    furnishing: raw.furnishing,
    parking: raw.parking,
    plotType: raw.plotType ?? undefined,
    ratePerSqft: raw.ratePerSqft ?? undefined,
    brokerage: raw.brokerage ?? undefined,
    amenities: raw.amenities ?? [],
    createdAt: raw.createdAt,
    views: raw.views,
  };
}

const AMENITY_ICON_MAP: Record<string, React.ReactNode> = {
  parking: <Car className="h-4 w-4" />,
  lift: <Building2 className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  pool: <Wifi className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  gymnasium: <Dumbbell className="h-4 w-4" />,
  clubhouse: <Coffee className="h-4 w-4" />,
  "power backup": <Sparkles className="h-4 w-4" />,
  ac: <Wind className="h-4 w-4" />,
  garden: <Trees className="h-4 w-4" />,
  playarea: <Trees className="h-4 w-4" />,
};

function amenityIcon(name: string) {
  const key = name.trim().toLowerCase();
  return AMENITY_ICON_MAP[key] || <CheckCircle className="h-4 w-4" />;
}

function formatPrice(price: number, type: string) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
}

/* -------------------------------------------------------------------------- */
/* Image with its own skeleton — shows a shimmer placeholder until the        */
/* actual image has decoded, then cross-fades in. This is what makes the     */
/* "data loads, then images pop in progressively" behavior feel smooth       */
/* instead of jarring, without blocking the rest of the page on image load.  */
/*                                                                            */
/* NOTE: next/image validates the src's hostname against next.config.js's    */
/* images.remotePatterns BEFORE issuing any network request. If a hostname   */
/* isn't allow-listed, it throws a console error and never mounts the real   */
/* <img> tag — so neither onLoad NOR onError ever fires, and the skeleton    */
/* spins forever with zero feedback. The timeout below is a safety net that  */
/* forces a visible "Image unavailable" state instead of a silent dead box.  */
/* -------------------------------------------------------------------------- */
function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Reset loading state whenever the src changes (e.g. user picks a new thumbnail)
  useEffect(() => {
    setLoaded(false);
    setErrored(false);

    const timeout = setTimeout(() => {
      setLoaded((prevLoaded) => {
        if (!prevLoaded) setErrored(true);
        return prevLoaded;
      });
    }, 8000);

    return () => clearTimeout(timeout);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className || ""}`} onClick={onClick}>
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_400%]" />
      )}
      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
          Image unavailable
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName || ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

/* Skeleton for the whole page shown only while the property JSON itself is loading */
function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-2/3" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 aspect-[16/9] bg-gray-200 rounded-2xl" />
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="aspect-video lg:aspect-square bg-gray-200 rounded-xl" />
                <div className="aspect-video lg:aspect-square bg-gray-200 rounded-xl" />
                <div className="aspect-video lg:aspect-square bg-gray-200 rounded-xl hidden lg:block" />
                <div className="aspect-video lg:aspect-square bg-gray-200 rounded-xl hidden lg:block" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-24 bg-gray-200 rounded-xl" />
                <div className="h-64 bg-gray-200 rounded-xl" />
              </div>
              <div className="h-80 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { translations } = useLanguage();
  const t = translations;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Abort in-flight request on unmount / id change, and never touch state
  // after the component has gone away (avoids the classic "set state on
  // unmounted component" warning + wasted re-render).
  useEffect(() => {
    const controller = new AbortController();

    const fetchPropertyById = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("usertoken");
        const response = await fetch(`${BASE_URL}/property/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch property details.");

        const data: RawProperty = await response.json();
        setProperty(normalizeProperty(data));
        setSelectedIndex(0);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPropertyById();
    return () => controller.abort();
  }, [id]);

  // allImages no longer falls back to a fake "/api/placeholder/1200/800" path —
  // that route doesn't exist and always 404'd. If there are no real images,
  // hasImages guards the render and shows a clean empty state instead.
  const allImages = useMemo(() => property?.images ?? [], [property]);
  const hasImages = allImages.length > 0;
  const hasMultipleImages = allImages.length > 1;
  const remainingImages = allImages.slice(1, 5);
  const hasMoreImages = allImages.length > 5;
  const selectedImage = hasImages ? allImages[selectedIndex] ?? allImages[0] : undefined;

  const goToImage = useCallback((idx: number) => setSelectedIndex(idx), []);
  const nextThumb = useCallback(
    () => setSelectedIndex((i) => (i + 1) % allImages.length),
    [allImages.length]
  );
  const prevThumb = useCallback(
    () => setSelectedIndex((i) => (i - 1 + allImages.length) % allImages.length),
    [allImages.length]
  );

  const nextLightbox = useCallback(
    () => setLightboxIndex((i) => (i + 1) % allImages.length),
    [allImages.length]
  );
  const prevLightbox = useCallback(
    () => setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length),
    [allImages.length]
  );

  const openLightbox = useCallback(
    (idx?: number) => {
      setLightboxIndex(idx ?? selectedIndex);
      setIsLightboxOpen(true);
    },
    [selectedIndex]
  );

  // Keyboard navigation for the lightbox (esc / arrows) — small UX win, cheap to add.
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, nextLightbox, prevLightbox]);

  if (loading) return <PageSkeleton />;

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

  const isLand = LAND_CATEGORIES.includes(property.category);
  const isFarmland = property.category === "Farmland";

  // Which quick-stat tiles make sense depends on the category: a Plot or
  // Farmland listing has no bedrooms/bathrooms, so those tiles are swapped
  // for land-relevant info instead of showing "0".
  const statCards = isLand
    ? [
        {
          icon: Ruler, bg: "bg-green-100", color: "text-green-600",
          label: isFarmland ? "Area" : "Plot Area",
          value: isFarmland ? `${property.area} acre` : `${property.area} sq.ft`,
        },
        ...(property.plotType
          ? [{ icon: Shield, bg: "bg-purple-100", color: "text-purple-600", label: "Document Basis", value: property.plotType }]
          : []),
        ...(property.facing
          ? [{ icon: Award, bg: "bg-blue-100", color: "text-blue-600", label: "Facing", value: property.facing }]
          : []),
        { icon: Building2, bg: "bg-orange-100", color: "text-orange-600", label: "Property Type", value: property.category },
      ]
    : [
        { icon: Bed, bg: "bg-blue-100", color: "text-blue-600", label: "Bedrooms", value: property.bedrooms },
        { icon: Bath, bg: "bg-purple-100", color: "text-purple-600", label: "Bathrooms", value: property.bathrooms },
        { icon: Ruler, bg: "bg-green-100", color: "text-green-600", label: "Area", value: `${property.area} sq.ft` },
        { icon: Building2, bg: "bg-orange-100", color: "text-orange-600", label: "Property Type", value: property.category },
      ];

  // Use the deployed site origin if configured, otherwise fall back to the
  // current origin. Keeps shared links correct even behind a proxy/CDN, and
  // avoids leaking a "localhost" link in production.
  const getPropertyUrl = () => {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    return `${origin}/properties/${property.id}`;
  };

  const configLine = isLand
    ? `${property.area} ${isFarmland ? "acre" : "sq.ft"}`
    : `${property.bedrooms} BHK, ${property.area} sq.ft`;

  const handleWhatsAppEnquiry = () => {
    const propertyUrl = getPropertyUrl();
    // No emoji/special characters directly touching the URL line — WhatsApp's
    // link auto-detector is strict about the URL sitting on its own clean line.
    const message = [
      `Hello, I would like to enquire about the following property:`,
      ``,
      `*${property.title}*`,
      `Location: ${property.address}`,
      `Price: ${formatPrice(property.price, property.type)}${property.type === "rent" ? "/month" : ""}`,
      `Configuration: ${configLine}`,
      ``,
      `View property details here:`,
      propertyUrl,
      ``,
      `Could you please share more details and let me know the best time for a site visit? Thank you.`,
    ].join("\n");
    window.open(`https://wa.me/919494942894?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleShare = async () => {
    const propertyUrl = getPropertyUrl();
    const message = [
      `Check out this property:`,
      ``,
      `*${property.title}*`,
      `Location: ${property.address}`,
      `Price: ${formatPrice(property.price, property.type)}${property.type === "rent" ? "/month" : ""}`,
      `Configuration: ${configLine}`,
      ``,
      `View full details here:`,
      propertyUrl,
    ].join("\n");

    // Prefer the device's native share sheet (lets the person pick WhatsApp,
    // SMS, email, etc.) — fall back to WhatsApp's own share intent (opens
    // WhatsApp's contact picker, unlike the enquiry button which messages a
    // fixed number) when the Web Share API isn't available, e.g. on desktop.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: property.title, text: message, url: propertyUrl });
        return;
      } catch {
        // User cancelled the share sheet, or the browser rejected it — fall
        // through to the WhatsApp link below rather than failing silently.
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

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
                    {property.type === "rent" ? "For Rent" : "For Sell"}
                  </Badge>
                  {property.category && <Badge variant="secondary">{property.category}</Badge>}
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
                  {property.type === "rent" && <span className="text-sm text-gray-500 ml-1">/month</span>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Image */}
              <div className="lg:col-span-3">
                <div className="relative aspect-[16/9] rounded-2xl shadow-lg group cursor-pointer">
                  {hasImages ? (
                    <>
                      <SmartImage
                        src={selectedImage as string}
                        alt={property.title}
                        className="absolute inset-0 rounded-2xl"
                        priority
                        sizes="(max-width: 1024px) 100vw, 75vw"
                        onClick={() => openLightbox(selectedIndex)}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevThumb();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextThumb();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all z-10">
                        🔍 Click to enlarge
                      </div>

                      {hasMultipleImages && (
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10">
                          {selectedIndex + 1} / {allImages.length}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-2xl text-gray-400">
                      <Home className="h-10 w-10 mb-2" />
                      <p className="text-sm">No photos available</p>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavorite((f) => !f);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10 backdrop-blur-sm"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="absolute top-4 right-16 p-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10 backdrop-blur-sm"
                    aria-label="Share this property"
                  >
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {remainingImages.map((img, i) => (
                    <button
                      key={img + i}
                      onClick={() => {
                        setSelectedIndex(i + 1);
                        openLightbox(i + 1);
                      }}
                      className={`relative rounded-xl transition-all ${
                        selectedIndex === i + 1 ? "ring-2 ring-primary ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
                      }`}
                    >
                      <SmartImage
                        src={img}
                        alt={`${property.title} thumbnail ${i + 2}`}
                        className="aspect-video lg:aspect-square rounded-xl"
                        sizes="200px"
                      />
                      {i === 3 && hasMoreImages && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
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

        {/* Lightbox */}
        {isLightboxOpen && hasImages && (
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

            {hasMultipleImages && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}

            <div className="relative w-[90vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <SmartImage
                src={allImages[lightboxIndex]}
                alt={`${property.title} - Image ${lightboxIndex + 1}`}
                className="absolute inset-0"
                imgClassName="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {hasMultipleImages && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </button>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {lightboxIndex + 1} of {allImages.length}
            </div>
          </div>
        )}

        {/* Main content */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {statCards.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <div key={i} className="text-center">
                            <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bg} rounded-xl mb-2`}>
                              <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900 capitalize">{stat.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 rounded-t-xl rounded-b-none">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="p-6 space-y-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {property.description ||
                            (isLand
                              ? `This ${property.category.toLowerCase()} is located at ${property.address}.`
                              : `This ${property.bedrooms} bedroom ${property.category} is located at ${property.address}.`)}
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
                              <span className="font-medium text-gray-900">{property.ownerName}</span>
                            </div>
                            {!isLand && property.furnishing && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Furnishing Status</span>
                                <span className="font-medium text-gray-900">{property.furnishing}</span>
                              </div>
                            )}
                            {!isLand && property.parking && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Car Parking</span>
                                <span className="font-medium text-gray-900">{property.parking}</span>
                              </div>
                            )}
                            {isLand && property.plotType && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Document Basis</span>
                                <span className="font-medium text-gray-900">{property.plotType}</span>
                              </div>
                            )}
                            {property.brokerage != null && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Brokerage</span>
                                <span className="font-medium text-gray-900">₹{property.brokerage.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 mb-3">Additional Info</h4>
                            {!isLand && property.floorNumber != null && property.totalFloors != null && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Floor</span>
                                <span className="font-medium text-gray-900">{property.floorNumber} of {property.totalFloors}</span>
                              </div>
                            )}
                            {!isLand && property.yearBuilt && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Year Built</span>
                                <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                              </div>
                            )}
                            {property.facing && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Facing</span>
                                <span className="font-medium text-gray-900">{property.facing}</span>
                              </div>
                            )}
                            {property.ratePerSqft != null && (
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Rate ({isFarmland ? "₹/acre" : "₹/sqft"})</span>
                                <span className="font-medium text-gray-900">₹{property.ratePerSqft.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="amenities" className="p-6">
                        {property.amenities.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                            {property.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <div className="text-primary">{amenityIcon(amenity)}</div>
                                <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No amenities listed for this property.</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-6">
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
                      onClick={handleWhatsAppEnquiry}
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>

                    <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                      Share Property
                    </Button>

                    <Separator />

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Property Listed By</p>
                        <p className="font-semibold text-gray-900">{property.ownerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <p className="text-xs text-green-600">Verified Member</p>
                        </div>
                      </div>
                    </div>

                    {property.createdAt && (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Posted on:
                          </span>
                          <span className="font-medium text-gray-900">
                            {new Date(property.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <Separator />

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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
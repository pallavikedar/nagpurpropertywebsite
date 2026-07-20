// "use client";

// import React from "react";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Save, 
//   Upload, 
//   X, 
//   AlertCircle, 
//   CheckCircle, 
//   ArrowLeft,
//   Home,
//   Building,
//   MapPin,
//   User,
//   Image as ImageIcon,
//   DollarSign,
//   Bed,
//   Bath,
//   Square,
//   Heart,
//   Shield,
//   Clock
// } from "lucide-react";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import { useLanguage } from "@/context/language-context";
// import { BASE_URL } from "../../../baseurl";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import AdminSidebar from "@/components/admin-sidebar";

// // 🔥 IMPORTANT: Add this line to fix Vercel deployment
// export const dynamic = 'force-dynamic';

// export default function UpdatePropertyPage() {
//   const { translations } = useLanguage();
//   const t = translations;
//   const amenitiesList = translations.amenities || [];
//   const params = useParams();
//   const id = params?.id;
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     propertyFor: "",
//     propertyType: "",
//     price: "",
//     area: "",
//     bedrooms: "",
//     bathrooms: "",
//     furnishing: "",
//     amenities: [],
//     address: "",
//     locality: "",
//     city: "",
//     state: "",
//     pincode: "",
//     ownerName: "",
//     ownerPhone: "",
//     ownerEmail: "",
//     status: "ACCEPTED",
//   });

//   const [images, setImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("basic");

//   // Fetch existing property data
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const token = localStorage.getItem("admintoken");
//         if (!token) {
//           alert("Admin token missing. Please log in.");
//           router.push("/Login");
//           return;
//         }

//         const res = await fetch(`${BASE_URL}/property/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch property data.");

//         const data = await res.json();

//         setFormData({
//           title: data.title || "",
//           description: data.description || "",
//           propertyFor: data.propertyFor || "",
//           propertyType: data.propertyType || "",
//           price: data.price?.toString() || "",
//           area: data.area?.toString() || "",
//           bedrooms: data.bedrooms?.toString() || "",
//           bathrooms: data.bathrooms?.toString() || "",
//           furnishing: data.furnishing || "",
//           amenities: data.amenities || [],
//           address: data.address || "",
//           locality: data.locality || "",
//           city: data.city || "",
//           state: data.state || "",
//           pincode: data.pincode || "",
//           ownerName: data.ownerName || "",
//           ownerPhone: data.ownerPhone || "",
//           ownerEmail: data.ownerEmail || "",
//           status: data.status || "PENDING",
//         });

//         setExistingImages(data.images || []);
//       } catch (err) {
//         setError(err.message || "Failed to load property.");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) fetchProperty();
//   }, [id, router]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSelectChange = (id, value) => {
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => {
//       const amenities = checked
//         ? [...prev.amenities, name]
//         : prev.amenities.filter((item) => item !== name);
//       return { ...prev, amenities };
//     });
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setImages(files);
      
//       // Create preview URLs for new images
//       const previews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews(previews);
//     }
//   };

//   const removeNewImage = (index) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//     URL.revokeObjectURL(imagePreviews[index]);
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeExistingImage = async (imageUrl) => {
//     if (!confirm("Remove this image?")) return;
    
//     try {
//       const token = localStorage.getItem("admintoken");
//       const response = await fetch(`${BASE_URL}/property/${id}/remove-image`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ imageUrl }),
//       });
      
//       if (response.ok) {
//         setExistingImages(prev => prev.filter(img => img !== imageUrl));
//       }
//     } catch (err) {
//       console.error("Failed to remove image", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         alert("Admin token missing. Please log in.");
//         router.push("/Login");
//         return;
//       }

//       const formDataToSend = new FormData();

//       const propertyData = JSON.stringify({
//         ...formData,
//         price: parseFloat(formData.price),
//         area: parseFloat(formData.area),
//         bedrooms: parseInt(formData.bedrooms, 10),
//         bathrooms: parseInt(formData.bathrooms, 10),
//       });

//       formDataToSend.append("property", new Blob([propertyData], { type: "application/json" }));

//       images.forEach((img) => formDataToSend.append("images", img));

//       const res = await fetch(`${BASE_URL}/editProperty/${id}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to update property.");
//       }

//       setSuccess("Property updated successfully!");
//       setTimeout(() => {
//         router.push("/admin/Properties");
//       }, 2000);
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sections = [
//     { id: "basic", label: "Basic Info", icon: Home },
//     { id: "details", label: "Property Details", icon: Building },
//     { id: "location", label: "Location", icon: MapPin },
//     { id: "contact", label: "Contact", icon: User },
//   ];

//   if (fetchLoading) {
//     return (
//       <AdminSidebar>
//         <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
//             <p className="text-gray-500">Loading property data...</p>
//           </div>
//         </div>
//       </AdminSidebar>
//     );
//   }

//   return (
//     <AdminSidebar>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="p-4 md:p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                   Edit Property
//                 </h1>
//                 <p className="text-gray-500 mt-1">
//                   Update property information and manage images
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={() => router.push("/admin/Properties")}
//                 className="gap-2"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Properties
//               </Button>
//             </div>
//           </div>

//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between max-w-2xl">
//               {sections.map((section, index) => {
//                 const Icon = section.icon;
//                 const isActive = activeTab === section.id;
//                 return (
//                   <div key={section.id} className="flex items-center">
//                     <button
//                       onClick={() => setActiveTab(section.id)}
//                       className={`flex flex-col items-center group transition-all ${
//                         isActive ? "scale-105" : ""
//                       }`}
//                     >
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                           isActive
//                             ? "bg-primary text-white shadow-lg"
//                             : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
//                         }`}
//                       >
//                         <Icon className="h-5 w-5" />
//                       </div>
//                       <span
//                         className={`text-xs mt-2 ${
//                           isActive ? "text-primary font-semibold" : "text-gray-500"
//                         }`}
//                       >
//                         {section.label}
//                       </span>
//                     </button>
//                     {index < sections.length - 1 && (
//                       <div className="w-12 h-px bg-gray-300 mx-2" />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             {/* Basic Information */}
//             {activeTab === "basic" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <Home className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">
//                       Property Title <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="title"
//                       value={formData.title}
//                       onChange={handleChange}
//                       placeholder="Enter property title"
//                       className="focus:ring-2 focus:ring-primary/20"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">
//                       Description <span className="text-red-500">*</span>
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       rows={5}
//                       placeholder="Describe the property in detail"
//                       className="focus:ring-2 focus:ring-primary/20 resize-none"
//                       required
//                     />
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Property For</Label>
//                       <Select value={formData.propertyFor} onValueChange={(v) => handleSelectChange("propertyFor", v)}>
//                         <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                           <SelectValue placeholder="Select option" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Sale">For Sale</SelectItem>
//                           <SelectItem value="Rent">For Rent</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Property Type</Label>
//                       <Select value={formData.propertyType} onValueChange={(v) => handleSelectChange("propertyType", v)}>
//                         <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Villa">Villa</SelectItem>
//                           <SelectItem value="Apartment">Apartment</SelectItem>
//                           <SelectItem value="House">House</SelectItem>
//                           <SelectItem value="Plot">Plot</SelectItem>
//                           <SelectItem value="Commercial">Commercial</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">Status</Label>
//                     <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
//                       <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="PENDING">Pending</SelectItem>
//                         <SelectItem value="ACCEPTED">Accepted</SelectItem>
//                         <SelectItem value="REJECT">Rejected</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex justify-end pt-4">
//                     <Button type="button" onClick={() => setActiveTab("details")}>
//                       Next: Property Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Property Details */}
//             {activeTab === "details" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <Building className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Price (₹)</Label>
//                       <Input
//                         type="number"
//                         id="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         placeholder="Enter price"
//                         className="focus:ring-2 focus:ring-primary/20"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Area (sq.ft)</Label>
//                       <Input
//                         type="number"
//                         id="area"
//                         value={formData.area}
//                         onChange={handleChange}
//                         placeholder="Enter area"
//                         className="focus:ring-2 focus:ring-primary/20"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Bedrooms</Label>
//                       <Input
//                         type="number"
//                         id="bedrooms"
//                         value={formData.bedrooms}
//                         onChange={handleChange}
//                         placeholder="Number of bedrooms"
//                         className="focus:ring-2 focus:ring-primary/20"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Bathrooms</Label>
//                       <Input
//                         type="number"
//                         id="bathrooms"
//                         value={formData.bathrooms}
//                         onChange={handleChange}
//                         placeholder="Number of bathrooms"
//                         className="focus:ring-2 focus:ring-primary/20"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Furnishing</Label>
//                       <Select value={formData.furnishing} onValueChange={(v) => handleSelectChange("furnishing", v)}>
//                         <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                           <SelectValue placeholder="Select furnishing" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
//                           <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
//                           <SelectItem value="Unfurnished">Unfurnished</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   {/* Amenities */}
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-3 block">Amenities</Label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                       {amenitiesList.map((amenity) => (
//                         <label key={amenity.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
//                           <input
//                             type="checkbox"
//                             name={amenity.key}
//                             checked={formData.amenities.includes(amenity.key)}
//                             onChange={handleCheckboxChange}
//                             className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                           />
//                           <span className="text-gray-700">{amenity.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Existing Images Display */}
//                   {existingImages.length > 0 && (
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-3 block">Current Images</Label>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {existingImages.map((img, i) => (
//                           <div key={i} className="relative group">
//                             <img
//                               src={img}
//                               alt={`Property ${i + 1}`}
//                               className="w-full h-32 object-cover rounded-lg"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeExistingImage(img)}
//                               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* New Images Upload */}
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-3 block">Upload New Images</Label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                         id="image-upload"
//                       />
//                       <label htmlFor="image-upload" className="cursor-pointer block">
//                         <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                         <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
//                         <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
//                         <Button type="button" variant="outline" className="mt-4">
//                           Select Images
//                         </Button>
//                       </label>
//                     </div>
                    
//                     {imagePreviews.length > 0 && (
//                       <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {imagePreviews.map((preview, index) => (
//                           <div key={index} className="relative group">
//                             <img
//                               src={preview}
//                               alt={`Preview ${index + 1}`}
//                               className="w-full h-32 object-cover rounded-lg"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeNewImage(index)}
//                               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-between pt-4">
//                     <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
//                       Previous
//                     </Button>
//                     <Button type="button" onClick={() => setActiveTab("location")}>
//                       Next: Location Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Location Information */}
//             {activeTab === "location" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">Full Address</Label>
//                     <Textarea
//                       id="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       rows={2}
//                       placeholder="Enter complete address"
//                       className="focus:ring-2 focus:ring-primary/20"
//                       required
//                     />
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Locality/Area</Label>
//                       <Input
//                         id="locality"
//                         value={formData.locality}
//                         onChange={handleChange}
//                         placeholder="Enter locality"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">City</Label>
//                       <Input
//                         id="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         placeholder="Enter city"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">State</Label>
//                       <Input
//                         id="state"
//                         value={formData.state}
//                         onChange={handleChange}
//                         placeholder="Enter state"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Pincode</Label>
//                       <Input
//                         id="pincode"
//                         value={formData.pincode}
//                         onChange={handleChange}
//                         placeholder="Enter 6-digit pincode"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-between pt-4">
//                     <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
//                       Previous
//                     </Button>
//                     <Button type="button" onClick={() => setActiveTab("contact")}>
//                       Next: Contact Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Contact Information */}
//             {activeTab === "contact" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <User className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Owner/Agent Name</Label>
//                       <Input
//                         id="ownerName"
//                         value={formData.ownerName}
//                         onChange={handleChange}
//                         placeholder="Enter owner/agent name"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Phone Number</Label>
//                       <Input
//                         id="ownerPhone"
//                         value={formData.ownerPhone}
//                         onChange={handleChange}
//                         placeholder="10-digit phone number"
//                         required
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <Label className="text-gray-700 font-medium mb-2 block">Email Address</Label>
//                       <Input
//                         id="ownerEmail"
//                         type="email"
//                         value={formData.ownerEmail}
//                         onChange={handleChange}
//                         placeholder="Enter email address"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-between pt-4">
//                     <Button type="button" variant="outline" onClick={() => setActiveTab("location")}>
//                       Previous
//                     </Button>
//                     <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/70">
//                       {loading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                           Updating...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Update Property
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </form>

//           {/* Error/Success Messages */}
//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
//               >
//                 <AlertCircle className="h-5 w-5" />
//                 {error}
//               </motion.div>
//             )}
            
//             {success && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
//               >
//                 <CheckCircle className="h-5 w-5" />
//                 {success}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </AdminSidebar>
//   );
// }









// "use client";

// import React from "react";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Save, 
//   Upload, 
//   X, 
//   AlertCircle, 
//   CheckCircle, 
//   ArrowLeft,
//   Home,
//   Building,
//   MapPin,
//   User,
//   Image as ImageIcon,
//   DollarSign,
//   Bed,
//   Bath,
//   Square,
//   Heart,
//   Shield,
//   Clock
// } from "lucide-react";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import { useLanguage } from "@/context/language-context";
// import { BASE_URL } from "../../../baseurl";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import AdminSidebar from "@/components/admin-sidebar";

// // 🔥 IMPORTANT: Add this line to fix Vercel deployment
// export const dynamic = 'force-dynamic';

// export default function UpdatePropertyPage() {
//   const { translations } = useLanguage();
//   const t = translations;
//   const amenitiesList = translations.amenities || [];
//   const params = useParams();
//   const id = params?.id;
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     propertyFor: "",
//     propertyType: "",
//     price: "",
//     area: "",
//     bedrooms: "",
//     bathrooms: "",
//     furnishing: "",
//     amenities: [],
//     address: "",
//     locality: "",
//     city: "",
//     state: "",
//     pincode: "",
//     ownerName: "",
//     ownerPhone: "",
//     ownerEmail: "",
//     status: "ACCEPTED",
//   });

//   const [images, setImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("basic");

//   // ✅ Property type helpers
//   const RESIDENTIAL_TYPES = ["Villa", "Apartment", "House"];
//   const isResidential = RESIDENTIAL_TYPES.includes(formData.propertyType);

//   // Fetch existing property data
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const token = localStorage.getItem("admintoken");
//         if (!token) {
//           alert("Admin token missing. Please log in.");
//           router.push("/Login");
//           return;
//         }

//         const res = await fetch(`${BASE_URL}/property/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch property data.");

//         const data = await res.json();

//         setFormData({
//           title: data.title || "",
//           description: data.description || "",
//           propertyFor: data.propertyFor || "",
//           propertyType: data.propertyType || "",
//           price: data.price?.toString() || "",
//           area: data.area?.toString() || "",
//           bedrooms: data.bedrooms?.toString() || "",
//           bathrooms: data.bathrooms?.toString() || "",
//           furnishing: data.furnishing || "",
//           amenities: data.amenities || [],
//           address: data.address || "",
//           locality: data.locality || "",
//           city: data.city || "",
//           state: data.state || "",
//           pincode: data.pincode || "",
//           ownerName: data.ownerName || "",
//           ownerPhone: data.ownerPhone || "",
//           ownerEmail: data.ownerEmail || "",
//           status: data.status || "PENDING",
//         });

//         setExistingImages(data.images || []);
//       } catch (err) {
//         setError(err.message || "Failed to load property.");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) fetchProperty();
//   }, [id, router]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   // ✅ Clear residential fields when switching to non-residential type
//   const handleSelectChange = (id, value) => {
//     if (id === "propertyType" && !RESIDENTIAL_TYPES.includes(value)) {
//       setFormData((prev) => ({
//         ...prev,
//         [id]: value,
//         bedrooms: "",
//         bathrooms: "",
//         furnishing: "",
//       }));
//       return;
//     }
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => {
//       const amenities = checked
//         ? [...prev.amenities, name]
//         : prev.amenities.filter((item) => item !== name);
//       return { ...prev, amenities };
//     });
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setImages(files);
//       const previews = files.map(file => URL.createObjectURL(file));
//       setImagePreviews(previews);
//     }
//   };

//   const removeNewImage = (index) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//     URL.revokeObjectURL(imagePreviews[index]);
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const removeExistingImage = async (imageUrl) => {
//     if (!confirm("Remove this image?")) return;
//     try {
//       const token = localStorage.getItem("admintoken");
//       const response = await fetch(`${BASE_URL}/property/${id}/remove-image`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ imageUrl }),
//       });
//       if (response.ok) {
//         setExistingImages(prev => prev.filter(img => img !== imageUrl));
//       }
//     } catch (err) {
//       console.error("Failed to remove image", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("admintoken");
//       if (!token) {
//         alert("Admin token missing. Please log in.");
//         router.push("/Login");
//         return;
//       }

//       const formDataToSend = new FormData();

//       // ✅ Only send residential fields when applicable
//       const propertyData = JSON.stringify({
//         ...formData,
//         price: parseFloat(formData.price),
//         area: parseFloat(formData.area),
//         bedrooms: isResidential ? parseInt(formData.bedrooms, 10) : null,
//         bathrooms: isResidential ? parseInt(formData.bathrooms, 10) : null,
//         furnishing: isResidential ? formData.furnishing : null,
//       });

//       formDataToSend.append("property", new Blob([propertyData], { type: "application/json" }));
//       images.forEach((img) => formDataToSend.append("images", img));

//       const res = await fetch(`${BASE_URL}/editProperty/${id}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to update property.");
//       }

//       setSuccess("Property updated successfully!");
//       setTimeout(() => {
//         router.push("/admin/Properties");
//       }, 2000);
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sections = [
//     { id: "basic", label: "Basic Info", icon: Home },
//     { id: "details", label: "Property Details", icon: Building },
//     { id: "location", label: "Location", icon: MapPin },
//     { id: "contact", label: "Contact", icon: User },
//   ];

//   if (fetchLoading) {
//     return (
//       <AdminSidebar>
//         <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
//             <p className="text-gray-500">Loading property data...</p>
//           </div>
//         </div>
//       </AdminSidebar>
//     );
//   }

//   return (
//     <AdminSidebar>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="p-4 md:p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                   Edit Property
//                 </h1>
//                 <p className="text-gray-500 mt-1">
//                   Update property information and manage images
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={() => router.push("/admin/Properties")}
//                 className="gap-2"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Properties
//               </Button>
//             </div>
//           </div>

//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between max-w-2xl">
//               {sections.map((section, index) => {
//                 const Icon = section.icon;
//                 const isActive = activeTab === section.id;
//                 return (
//                   <div key={section.id} className="flex items-center">
//                     <button
//                       onClick={() => setActiveTab(section.id)}
//                       className={`flex flex-col items-center group transition-all ${
//                         isActive ? "scale-105" : ""
//                       }`}
//                     >
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                           isActive
//                             ? "bg-primary text-white shadow-lg"
//                             : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
//                         }`}
//                       >
//                         <Icon className="h-5 w-5" />
//                       </div>
//                       <span
//                         className={`text-xs mt-2 ${
//                           isActive ? "text-primary font-semibold" : "text-gray-500"
//                         }`}
//                       >
//                         {section.label}
//                       </span>
//                     </button>
//                     {index < sections.length - 1 && (
//                       <div className="w-12 h-px bg-gray-300 mx-2" />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             {/* ─── Basic Information ─── */}
//             {activeTab === "basic" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <Home className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">
//                       Property Title <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="title"
//                       value={formData.title}
//                       onChange={handleChange}
//                       placeholder="Enter property title"
//                       className="focus:ring-2 focus:ring-primary/20"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">
//                       Description <span className="text-red-500">*</span>
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       rows={5}
//                       placeholder="Describe the property in detail"
//                       className="focus:ring-2 focus:ring-primary/20 resize-none"
//                       required
//                     />
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Property For</Label>
//                       <Select
//                         value={formData.propertyFor}
//                         onValueChange={(v) => handleSelectChange("propertyFor", v)}
//                       >
//                         <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                           <SelectValue placeholder="Select option" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Sale">For Sell</SelectItem>
//                           <SelectItem value="Rent">For Rent</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Property Type</Label>
//                       <Select
//                         value={formData.propertyType}
//                         onValueChange={(v) => handleSelectChange("propertyType", v)}
//                       >
//                         <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Villa">Villa</SelectItem>
//                           <SelectItem value="Apartment">Apartment</SelectItem>
//                           <SelectItem value="House">House</SelectItem>
//                           <SelectItem value="Plot">Plot</SelectItem>
//                           <SelectItem value="Commercial">Commercial</SelectItem>
//                         </SelectContent>
//                       </Select>

//                       {/* ✅ Show badge hint for non-residential types */}
//                       {formData.propertyType && !isResidential && (
//                         <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
//                           <AlertCircle className="h-3 w-3" />
//                           Bedroom, bathroom & furnishing fields are not applicable for{" "}
//                           {formData.propertyType}.
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">Status</Label>
//                     <Select
//                       value={formData.status}
//                       onValueChange={(v) => handleSelectChange("status", v)}
//                     >
//                       <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="PENDING">Pending</SelectItem>
//                         <SelectItem value="ACCEPTED">Accepted</SelectItem>
//                         <SelectItem value="REJECT">Rejected</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex justify-end pt-4">
//                     <Button type="button" onClick={() => setActiveTab("details")}>
//                       Next: Property Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* ─── Property Details ─── */}
//             {activeTab === "details" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <Building className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     {/* Price — always shown */}
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Price (₹)</Label>
//                       <Input
//                         type="number"
//                         id="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         placeholder="Enter price"
//                         className="focus:ring-2 focus:ring-primary/20"
//                         required
//                       />
//                     </div>

//                     {/* Area — always shown */}
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Area (sq.ft)</Label>
//                       <Input
//                         type="number"
//                         id="area"
//                         value={formData.area}
//                         onChange={handleChange}
//                         placeholder="Enter area"
//                         className="focus:ring-2 focus:ring-primary/20"
//                         required
//                       />
//                     </div>

//                     {/* ✅ Bedrooms — only for Villa / Apartment / House */}
//                     {isResidential && (
//                       <div>
//                         <Label className="text-gray-700 font-medium mb-2 block">Bedrooms</Label>
//                         <Input
//                           type="number"
//                           id="bedrooms"
//                           value={formData.bedrooms}
//                           onChange={handleChange}
//                           placeholder="Number of bedrooms"
//                           className="focus:ring-2 focus:ring-primary/20"
//                           required={isResidential}
//                         />
//                       </div>
//                     )}

//                     {/* ✅ Bathrooms — only for Villa / Apartment / House */}
//                     {isResidential && (
//                       <div>
//                         <Label className="text-gray-700 font-medium mb-2 block">Bathrooms</Label>
//                         <Input
//                           type="number"
//                           id="bathrooms"
//                           value={formData.bathrooms}
//                           onChange={handleChange}
//                           placeholder="Number of bathrooms"
//                           className="focus:ring-2 focus:ring-primary/20"
//                           required={isResidential}
//                         />
//                       </div>
//                     )}

//                     {/* ✅ Furnishing — only for Villa / Apartment / House */}
//                     {isResidential && (
//                       <div>
//                         <Label className="text-gray-700 font-medium mb-2 block">Furnishing</Label>
//                         <Select
//                           value={formData.furnishing}
//                           onValueChange={(v) => handleSelectChange("furnishing", v)}
//                         >
//                           <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
//                             <SelectValue placeholder="Select furnishing" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
//                             <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
//                             <SelectItem value="Unfurnished">Unfurnished</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     )}
//                   </div>

//                   {/* ✅ Info banner for non-residential types */}
//                   {formData.propertyType && !isResidential && (
//                     <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
//                       <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                       <span>
//                         Bedrooms, bathrooms, and furnishing are not applicable for{" "}
//                         <strong>{formData.propertyType}</strong> properties.
//                       </span>
//                     </div>
//                   )}

//                   {/* Amenities */}
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-3 block">Amenities</Label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                       {amenitiesList.map((amenity) => (
//                         <label
//                           key={amenity.key}
//                           className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
//                         >
//                           <input
//                             type="checkbox"
//                             name={amenity.key}
//                             checked={formData.amenities.includes(amenity.key)}
//                             onChange={handleCheckboxChange}
//                             className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                           />
//                           <span className="text-gray-700">{amenity.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Existing Images */}
//                   {existingImages.length > 0 && (
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-3 block">Current Images</Label>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {existingImages.map((img, i) => (
//                           <div key={i} className="relative group">
//                             <img
//                               src={img}
//                               alt={`Property ${i + 1}`}
//                               className="w-full h-32 object-cover rounded-lg"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeExistingImage(img)}
//                               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* New Images Upload */}
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-3 block">Upload New Images</Label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                         id="image-upload"
//                       />
//                       <label htmlFor="image-upload" className="cursor-pointer block">
//                         <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                         <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
//                         <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
//                         <Button type="button" variant="outline" className="mt-4">
//                           Select Images
//                         </Button>
//                       </label>
//                     </div>

//                     {imagePreviews.length > 0 && (
//                       <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {imagePreviews.map((preview, index) => (
//                           <div key={index} className="relative group">
//                             <img
//                               src={preview}
//                               alt={`Preview ${index + 1}`}
//                               className="w-full h-32 object-cover rounded-lg"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeNewImage(index)}
//                               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X className="h-4 w-4" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-between pt-4">
//                     <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
//                       Previous
//                     </Button>
//                     <Button type="button" onClick={() => setActiveTab("location")}>
//                       Next: Location Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* ─── Location Information ─── */}
//             {activeTab === "location" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div>
//                     <Label className="text-gray-700 font-medium mb-2 block">Full Address</Label>
//                     <Textarea
//                       id="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       rows={2}
//                       placeholder="Enter complete address"
//                       className="focus:ring-2 focus:ring-primary/20"
//                       required
//                     />
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Locality/Area</Label>
//                       <Input
//                         id="locality"
//                         value={formData.locality}
//                         onChange={handleChange}
//                         placeholder="Enter locality"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">City</Label>
//                       <Input
//                         id="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         placeholder="Enter city"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">State</Label>
//                       <Input
//                         id="state"
//                         value={formData.state}
//                         onChange={handleChange}
//                         placeholder="Enter state"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Pincode</Label>
//                       <Input
//                         id="pincode"
//                         value={formData.pincode}
//                         onChange={handleChange}
//                         placeholder="Enter 6-digit pincode"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-between pt-4">
//                     <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
//                       Previous
//                     </Button>
//                     <Button type="button" onClick={() => setActiveTab("contact")}>
//                       Next: Contact Details
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* ─── Contact Information ─── */}
//             {activeTab === "contact" && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="bg-white rounded-xl shadow-sm border overflow-hidden"
//               >
//                 <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex items-center gap-2">
//                     <User className="h-5 w-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
//                   </div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Owner/Agent Name</Label>
//                       <Input
//                         id="ownerName"
//                         value={formData.ownerName}
//                         onChange={handleChange}
//                         placeholder="Enter owner/agent name"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 font-medium mb-2 block">Phone Number</Label>
//                       <Input
//                         id="ownerPhone"
//                         value={formData.ownerPhone}
//                         onChange={handleChange}
//                         placeholder="10-digit phone number"
//                         required
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <Label className="text-gray-700 font-medium mb-2 block">Email Address</Label>
//                       <Input
//                         id="ownerEmail"
//                         type="email"
//                         value={formData.ownerEmail}
//                         onChange={handleChange}
//                         placeholder="Enter email address"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-between pt-4">
//                     <Button type="button" variant="outline" onClick={() => setActiveTab("location")}>
//                       Previous
//                     </Button>
//                     <Button
//                       type="submit"
//                       disabled={loading}
//                       className="bg-gradient-to-r from-primary to-primary/70"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                           Updating...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Update Property
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </form>

//           {/* Error/Success Toasts */}
//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
//               >
//                 <AlertCircle className="h-5 w-5" />
//                 {error}
//               </motion.div>
//             )}

//             {success && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
//               >
//                 <CheckCircle className="h-5 w-5" />
//                 {success}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </AdminSidebar>
//   );
// }












"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Save, Upload, X, AlertCircle, CheckCircle, ArrowLeft,
  Home, Building, MapPin, User, Camera, FileText,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../../baseurl";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";

export const dynamic = "force-dynamic";

/* ════════════════════════════════════════════════════════════════════════
   Shared property-type config (identical to the public Add form).
   ════════════════════════════════════════════════════════════════════════ */
type PropertyType =
  | "Flat / Apartment" | "Duplex" | "Row House" | "Villa" | "Independent House"
  | "Plot" | "Farmland";

interface FieldFlags {
  buildUpArea: boolean; carpetArea: boolean; plotArea: boolean; acre: boolean;
  plotType: boolean; facing: boolean; dimension: boolean;
  bedrooms: boolean; bathrooms: boolean; furnishing: boolean; amenities: boolean;
  brokerage: boolean; ratePerSqft: boolean; layoutMap: boolean; landMap: boolean;
  document: boolean; video: boolean;
}

const RESIDENTIAL_FLAGS: FieldFlags = {
  buildUpArea: true, carpetArea: true, plotArea: true, acre: false,
  plotType: false, facing: true, dimension: true,
  bedrooms: true, bathrooms: true, furnishing: true, amenities: true,
  brokerage: true, ratePerSqft: true, layoutMap: true, landMap: false,
  document: true, video: true,
};

const PROPERTY_TYPE_CONFIG: Record<PropertyType, { rateBase?: string; rateUnit?: string; fields: FieldFlags }> = {
  "Flat / Apartment":  { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
  "Duplex":            { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
  "Row House":         { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
  "Villa":             { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
  "Independent House": { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
  "Plot": {
    rateBase: "plotArea", rateUnit: "sqft",
    fields: { ...RESIDENTIAL_FLAGS, buildUpArea: false, carpetArea: false, plotArea: true,
      plotType: true, bedrooms: false, bathrooms: false, furnishing: false, amenities: false },
  },
  "Farmland": {
    rateBase: "acre", rateUnit: "acre",
    fields: { ...RESIDENTIAL_FLAGS, buildUpArea: false, carpetArea: false, plotArea: false, acre: true,
      facing: false, bedrooms: false, bathrooms: false, furnishing: false,
      amenities: false, brokerage: false, layoutMap: false, landMap: true },
  },
};

/* Old data may carry legacy type names — map them to the new keys. */
const LEGACY_TYPE_MAP: Record<string, PropertyType> = {
  Apartment: "Flat / Apartment",
  House: "Independent House",
  Flat: "Flat / Apartment",
};

const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const DOC_ACCEPT = "image/*,application/pdf";
const IMG_EXT = /\.(png|jpe?g|webp|gif)$/i;

const SECTION_FIELDS: Record<string, string[]> = {
  basic: ["title", "description", "propertyFor", "category"],
  details: ["buildUpArea", "carpetArea", "plotArea", "acre", "plotType", "facing",
    "dimension", "bedrooms", "bathrooms", "furnishing", "price", "brokerage"],
  location: ["address", "locality", "city", "state", "pincode"],
  contact: ["ownerName", "ownerPhone", "ownerEmail"],
  media: ["document", "images"],
};

const INITIAL_FORM = {
  title: "", description: "", propertyFor: "", category: "" as "" | PropertyType,
  price: "", buildUpArea: "", carpetArea: "", plotArea: "", acre: "",
  plotType: "", facing: "", dimension: "",
  bedrooms: "", bathrooms: "", furnishing: "", amenities: [] as string[],
  hasOtherAmenity: false, otherAmenity: "",
  brokerage: "", address: "", locality: "", city: "", state: "", pincode: "",
  ownerName: "", ownerPhone: "", ownerEmail: "", status: "ACCEPTED",
};

export default function UpdatePropertyPage() {
  const { translations: t } = useLanguage();
  const amenitiesList = t.amenities || [];
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // New uploads
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [layoutMapFile, setLayoutMapFile] = useState<File | null>(null);
  const [landMapFile, setLandMapFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Existing media from server
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState({ doc: "", layoutMap: "", landMap: "", video: "" });

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  const cfg = formData.category ? PROPERTY_TYPE_CONFIG[formData.category] : null;
  const f = cfg?.fields;

  const computedRate = useMemo(() => {
    if (!cfg?.rateBase) return "";
    const price = parseFloat(formData.price);
    const base = parseFloat((formData as any)[cfg.rateBase]);
    if (!price || !base || base <= 0) return "";
    return (price / base).toFixed(2);
  }, [cfg, formData]);

  const rateUnitLabel = cfg?.rateUnit === "acre" ? "₹ / acre" : "₹ / sqft";
  const dimensionPlaceholder = formData.category === "Farmland" ? "e.g., 300/400/500 ft (front/depth/length)" : "e.g., 30 x 40 ft";

  const sections = useMemo(() => [
    { id: "basic", label: "Basic Info", icon: Home },
    { id: "details", label: "Details", icon: Building },
    { id: "location", label: "Location", icon: MapPin },
    { id: "contact", label: "Contact", icon: User },
    { id: "media", label: "Media", icon: Camera },
  ], []);

  /* ─── Fetch + pre-fill ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = localStorage.getItem("admintoken");
        if (!token) { router.push("/Login"); return; }
        const res = await fetch(`${BASE_URL}/property/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch property data.");
        const data = await res.json();

        // Normalise property type
        const rawType: string = data.propertyType || "";
        const category = (LEGACY_TYPE_MAP[rawType] || rawType) as PropertyType;

        // Separate known amenities from custom ("Other") ones
        const knownKeys = new Set(amenitiesList.map((a: any) => a.key));
        const incoming: string[] = data.amenities || [];
        const known = incoming.filter((a) => knownKeys.has(a));
        const custom = incoming.filter((a) => !knownKeys.has(a));

        setFormData({
          title: data.title || "",
          description: data.description || "",
          propertyFor: data.propertyFor || "",
          category: (PROPERTY_TYPE_CONFIG[category] ? category : "") as "" | PropertyType,
          price: data.price?.toString() || "",
          buildUpArea: data.buildUpArea?.toString() || "",
          carpetArea: data.carpetArea?.toString() || "",
          plotArea: data.plotArea?.toString() || "",
          acre: data.area?.toString() || "",
          plotType: data.plotType || "",
          facing: data.facing || "",
          // The backend still stores this under the "dimension" column —
          // only the frontend field is singular now, since it's one input.
          dimension: data.dimension || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          furnishing: data.furnishing || "",
          amenities: known,
          hasOtherAmenity: custom.length > 0,
          otherAmenity: custom.join(", "),
          brokerage: data.brokerage?.toString() || "",
          address: data.address || "",
          locality: data.locality || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          ownerName: data.ownerName || "",
          ownerPhone: data.ownerPhone || "",
          ownerEmail: data.ownerEmail || "",
          status: data.status || "PENDING",
        });

        setExistingImages(data.images || []);
        setExistingMedia({
          doc: data.sevenTwelyDoucmnetImg || "",
          layoutMap: data.layoutMapImg || "",
          landMap: data.landMapImg || "",
          video: data.videoUrl || "",
        });
      } catch (err: any) {
        setServerError(err.message || "Failed to load property.");
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [id, router, amenitiesList]);

  useEffect(() => () => imagePreviews.forEach((p) => URL.revokeObjectURL(p)), []);

  /* ════════════════════════════ VALIDATION ═══════════════════════════════ */
  const validateField = useCallback((name: string, val: string, fd = formData): string => {
    const flags = fd.category ? PROPERTY_TYPE_CONFIG[fd.category].fields : null;
    const req = (m: string) => (!val || !val.trim() ? m : "");
    const posNum = (m: string) => (!val || isNaN(+val) || +val <= 0 ? m : "");

    switch (name) {
      case "title":       return req("Please enter property title");
      case "description": return req("Please enter property description");
      case "propertyFor": return req("Please select purpose (Sale / Rent)");
      case "category":    return req("Please select property type");
      case "price":       return posNum("Please enter a valid price");

      case "buildUpArea": return flags?.buildUpArea ? posNum("Enter valid built-up area (sqft)") : "";
      case "carpetArea":
        if (!flags?.carpetArea) return "";
        if (!val || isNaN(+val) || +val <= 0) return "Enter valid carpet area (sqft)";
        if (fd.buildUpArea && +val > +fd.buildUpArea) return "Carpet area can't exceed built-up area";
        return "";
      case "plotArea":  return flags?.plotArea ? posNum("Enter valid plot area (sqft)") : "";
      case "acre":      return flags?.acre ? posNum("Enter valid area in acres") : "";
      case "plotType":  return flags?.plotType ? req("Select document type (RL / Registry)") : "";
      case "facing":    return flags?.facing ? req("Please select facing") : "";
      case "dimension": return flags?.dimension ? req("Please enter dimension") : "";
      case "bedrooms":  return flags?.bedrooms ? req("Enter number of bedrooms") : "";
      case "bathrooms": return flags?.bathrooms ? req("Enter number of bathrooms") : "";
      case "furnishing":return flags?.furnishing && !val ? "Select furnishing status" : "";
      case "brokerage": return flags?.brokerage && val && (isNaN(+val) || +val < 0) ? "Enter a valid brokerage" : "";

      case "address":  return req("Please enter address");
      case "locality": return req("Please enter locality");
      case "city":     return req("Please enter city");
      case "state":    return req("Please enter state");
      case "pincode":  return !val.trim() ? "Please enter pincode" : !/^\d{6}$/.test(val) ? "Pincode must be 6 digits" : "";

      case "ownerName":  return req("Please enter owner / agent name");
      case "ownerPhone": return !val.trim() ? "Please enter phone number" : !/^\d{10}$/.test(val) ? "Phone must be 10 digits" : "";
      case "ownerEmail": return !val.trim() ? "Please enter email" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email" : "";
      default: return "";
    }
  }, [formData]);

  const validateFileField = useCallback((name: string): string => {
    if (name === "document" && f?.document && !docFile && !existingMedia.doc) return "Please upload the required document";
    if (name === "images" && images.length === 0 && existingImages.length === 0) return "At least one property image is required";
    return "";
  }, [f, docFile, existingMedia.doc, images, existingImages]);

  const validateStep = useCallback((stepId: string): boolean => {
    const errs: Record<string, string> = {};
    for (const name of SECTION_FIELDS[stepId] || []) {
      const msg = name === "document" || name === "images"
        ? validateFileField(name)
        : validateField(name, (formData as any)[name] ?? "");
      if (msg) errs[name] = msg;
    }
    setFieldErrors((prev) => ({ ...prev, ...errs }));
    return Object.keys(errs).length === 0;
  }, [formData, validateField, validateFileField]);

  /* ════════════════════════════ HANDLERS ═════════════════════════════════ */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFieldErrors((prev) => (prev[id] ? { ...prev, [id]: "" } : prev));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  }, [validateField]);

  const handleSelect = useCallback((id: string, value: string) => {
    setFormData((prev) => {
      if (id === "category") {
        // Reset type-specific fields but keep shared/common values
        return {
          ...prev, category: value as PropertyType,
          buildUpArea: "", carpetArea: "", plotArea: "", acre: "", plotType: "",
          facing: "", dimension: "",
          bedrooms: "", bathrooms: "", furnishing: "", brokerage: "",
        };
      }
      return { ...prev, [id]: value };
    });
    setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  }, [validateField]);

  const handleCheckbox = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, name] : prev.amenities.filter((a) => a !== name),
    }));
  }, []);

  const toggleOther = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, hasOtherAmenity: checked, otherAmenity: checked ? prev.otherAmenity : "" }));
  }, []);

  /* ─── Images ─────────────────────────────────────────────────────────────── */
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    setFieldErrors((p) => ({ ...p, images: "" }));
    e.target.value = "";
  }, []);

  const removeNewImage = useCallback((i: number) => {
    URL.revokeObjectURL(imagePreviews[i]);
    setImages((p) => p.filter((_, idx) => idx !== i));
    setImagePreviews((p) => p.filter((_, idx) => idx !== i));
  }, [imagePreviews]);

  const removeExistingImage = useCallback(async (imageUrl: string) => {
    if (!confirm("Remove this image?")) return;
    try {
      const token = localStorage.getItem("admintoken");
      const res = await fetch(`${BASE_URL}/property/${id}/remove-image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl }),
      });
      if (res.ok) setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    } catch (err) {
      console.error("Failed to remove image", err);
    }
  }, [id]);

  const handleSingleFile = useCallback(
    (setter: (f: File | null) => void, key: string, accept: "doc" | "video") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
          const ok = accept === "video" ? file.type.startsWith("video/") : /image\/|application\/pdf/.test(file.type);
          if (!ok) { setFieldErrors((p) => ({ ...p, [key]: "Invalid file type" })); e.target.value = ""; return; }
        }
        setter(file);
        setFieldErrors((p) => ({ ...p, [key]: "" }));
        e.target.value = "";
      },
    []
  );

  /* ════════════════════════════ SUBMIT ═══════════════════════════════════ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const s of sections) {
      if (!validateStep(s.id)) { setActiveTab(s.id); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    }

    setServerError(""); setSuccess(""); setLoading(true);
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) { router.push("/Login"); return; }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        propertyFor: formData.propertyFor,
        propertyType: formData.category,
        price: parseFloat(formData.price),
        area: f?.acre ? parseFloat(formData.acre) : undefined,
        buildUpArea: f?.buildUpArea ? parseFloat(formData.buildUpArea) : null,
        carpetArea: f?.carpetArea ? parseFloat(formData.carpetArea) : null,
        plotArea: f?.plotArea ? parseFloat(formData.plotArea) : null,
        plotType: f?.plotType ? formData.plotType : null,
        ratePerSqft: computedRate ? parseFloat(computedRate) : null,
        facing: f?.facing ? formData.facing : null,                    // ⚠ backend column
        dimension: f?.dimension ? formData.dimension : null,          // ⚠ backend column is "dimension"; frontend field is singular "dimension"
        bedrooms: f?.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: f?.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        furnishing: f?.furnishing ? formData.furnishing : null,
        amenities: f?.amenities
          ? [
              ...formData.amenities,
              ...(formData.hasOtherAmenity && formData.otherAmenity.trim()
                ? formData.otherAmenity.split(",").map((s) => s.trim()).filter(Boolean)
                : []),
            ]
          : [],
        brokerage: f?.brokerage && formData.brokerage ? parseFloat(formData.brokerage) : null,
        address: formData.address, locality: formData.locality, city: formData.city,
        state: formData.state, pincode: formData.pincode,
        ownerName: formData.ownerName, ownerPhone: formData.ownerPhone, ownerEmail: formData.ownerEmail,
        status: formData.status,
      };

      const body = new FormData();
      body.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
      images.forEach((img) => body.append("images", img));
      if (videoFile) body.append("video", videoFile);
      if (docFile) body.append("documentImage", docFile);
      if (f?.layoutMap && layoutMapFile) body.append("layoutMap", layoutMapFile);
      if (f?.landMap && landMapFile) body.append("landMap", landMapFile);

      const res = await fetch(`${BASE_URL}/editProperty/${id}`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` }, body,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update property.");
      }

      setSuccess("Property updated successfully!");
      setTimeout(() => router.push("/admin/Properties"), 2000);
    } catch (err: any) {
      setServerError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Render helpers ─────────────────────────────────────────────────────── */
  const errCls = (name: string) => (fieldErrors[name] ? "border-red-400 focus:ring-red-200" : "focus:ring-2 focus:ring-primary/20");
  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="w-3 h-3" />{fieldErrors[name]}</p>
    ) : null;

  const goTo = (next: string) => { if (validateStep(activeTab)) setActiveTab(next); };

  if (fetchLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading property data...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Edit Property</h1>
              <p className="text-gray-500 mt-1">Update property information and manage media</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/admin/Properties")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Properties
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex items-center justify-between max-w-3xl">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;
              return (
                <div key={section.id} className="flex items-center">
                  <button type="button" onClick={() => setActiveTab(section.id)}
                    className={`flex flex-col items-center group transition-all ${isActive ? "scale-105" : ""}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? "bg-primary text-white shadow-lg" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? "text-primary font-semibold" : "text-gray-500"}`}>{section.label}</span>
                  </button>
                  {index < sections.length - 1 && <div className="w-10 h-px bg-gray-300 mx-2" />}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden">

                {/* ═════════ BASIC ═════════ */}
                {activeTab === "basic" && (
                  <>
                    <SectionHead icon={Home} title="Basic Information" />
                    <div className="p-6 space-y-4">
                      <div>
                        <Label className="font-medium mb-2 block">Property Title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} placeholder="Enter property title" className={errCls("title")} />
                        <FieldError name="title" />
                      </div>
                      <div>
                        <Label className="font-medium mb-2 block">Description <span className="text-red-500">*</span></Label>
                        <Textarea id="description" rows={5} value={formData.description} onChange={handleChange} onBlur={handleBlur} placeholder="Describe the property" className={`resize-none ${errCls("description")}`} />
                        <FieldError name="description" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium mb-2 block">Property For <span className="text-red-500">*</span></Label>
                          <Select value={formData.propertyFor} onValueChange={(v) => handleSelect("propertyFor", v)}>
                            <SelectTrigger className={errCls("propertyFor")}><SelectValue placeholder="Select option" /></SelectTrigger>
                            <SelectContent><SelectItem value="Sale">For Sell</SelectItem><SelectItem value="Rent">For Rent</SelectItem></SelectContent>
                          </Select>
                          <FieldError name="propertyFor" />
                        </div>
                        <div>
                          <Label className="font-medium mb-2 block">Property Type <span className="text-red-500">*</span></Label>
                          <Select value={formData.category} onValueChange={(v) => handleSelect("category", v)}>
                            <SelectTrigger className={errCls("category")}><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              {(Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FieldError name="category" />
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium mb-2 block">Status</Label>
                        <Select value={formData.status} onValueChange={(v) => handleSelect("status", v)}>
                          <SelectTrigger className="focus:ring-2 focus:ring-primary/20"><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECT">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.category && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-gray-600">
                          📋 Showing fields relevant to <strong>{formData.category}</strong> only.
                        </div>
                      )}
                      <div className="flex justify-end pt-4">
                        <Button type="button" onClick={() => goTo("details")}>Next: Details</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ DETAILS ═════════ */}
                {activeTab === "details" && (
                  <>
                    <SectionHead icon={Building} title="Property Details" />
                    <div className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {f?.buildUpArea && (
                          <div><Label className="font-medium mb-2 block">Built-up Area (sqft) <span className="text-red-500">*</span></Label>
                            <Input id="buildUpArea" type="number" value={formData.buildUpArea} onChange={handleChange} onBlur={handleBlur} className={errCls("buildUpArea")} /><FieldError name="buildUpArea" /></div>
                        )}
                        {f?.carpetArea && (
                          <div><Label className="font-medium mb-2 block">Carpet Area (sqft) <span className="text-red-500">*</span></Label>
                            <Input id="carpetArea" type="number" value={formData.carpetArea} onChange={handleChange} onBlur={handleBlur} className={errCls("carpetArea")} /><FieldError name="carpetArea" /></div>
                        )}
                        {f?.plotArea && (
                          <div><Label className="font-medium mb-2 block">Plot Area (sqft) <span className="text-red-500">*</span></Label>
                            <Input id="plotArea" type="number" value={formData.plotArea} onChange={handleChange} onBlur={handleBlur} className={errCls("plotArea")} /><FieldError name="plotArea" /></div>
                        )}
                        {f?.acre && (
                          <div><Label className="font-medium mb-2 block">Area (acres) <span className="text-red-500">*</span></Label>
                            <Input id="acre" type="number" step="0.01" value={formData.acre} onChange={handleChange} onBlur={handleBlur} className={errCls("acre")} /><FieldError name="acre" /></div>
                        )}
                        {f?.plotType && (
                          <div><Label className="font-medium mb-2 block">Document Basis <span className="text-red-500">*</span></Label>
                            <Select value={formData.plotType} onValueChange={(v) => handleSelect("plotType", v)}>
                              <SelectTrigger className={errCls("plotType")}><SelectValue placeholder="RL / Registry" /></SelectTrigger>
                              <SelectContent><SelectItem value="RL">RL (Ready Layout)</SelectItem><SelectItem value="Registry">Registry</SelectItem></SelectContent>
                            </Select><FieldError name="plotType" /></div>
                        )}
                        {f?.facing && (
                          <div><Label className="font-medium mb-2 block">Facing <span className="text-red-500">*</span></Label>
                            <Select value={formData.facing} onValueChange={(v) => handleSelect("facing", v)}>
                              <SelectTrigger className={errCls("facing")}><SelectValue placeholder="Select facing" /></SelectTrigger>
                              <SelectContent>{FACING_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                            </Select><FieldError name="facing" /></div>
                        )}
                        {/* Single free-text dimension field — replaces the old Front/Depth/Length
                            trio. One input covers both "30x40" residential-style dimension and
                            farmland's front/depth/length, without a rigid multi-box layout. */}
                        {f?.dimension && (
                          <div className="md:col-span-2">
                            <Label htmlFor="dimension" className="font-medium mb-2 block">dimension <span className="text-red-500">*</span></Label>
                            <Input
                              id="dimension"
                              placeholder={dimensionPlaceholder}
                              value={formData.dimension}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={errCls("dimension")}
                            />
                            <FieldError name="dimension" />
                          </div>
                        )}
                        {f?.bedrooms && (
                          <div><Label className="font-medium mb-2 block">Bedrooms (BHK) <span className="text-red-500">*</span></Label>
                            <Input id="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} onBlur={handleBlur} className={errCls("bedrooms")} /><FieldError name="bedrooms" /></div>
                        )}
                        {f?.bathrooms && (
                          <div><Label className="font-medium mb-2 block">Bathrooms <span className="text-red-500">*</span></Label>
                            <Input id="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} onBlur={handleBlur} className={errCls("bathrooms")} /><FieldError name="bathrooms" /></div>
                        )}
                        {f?.furnishing && (
                          <div><Label className="font-medium mb-2 block">Furnishing</Label>
                            <Select value={formData.furnishing} onValueChange={(v) => handleSelect("furnishing", v)}>
                              <SelectTrigger className={errCls("furnishing")}><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                              <SelectContent><SelectItem value="Fully Furnished">Fully Furnished</SelectItem><SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem><SelectItem value="Unfurnished">Unfurnished</SelectItem></SelectContent>
                            </Select><FieldError name="furnishing" /></div>
                        )}
                        <div><Label className="font-medium mb-2 block">Price (₹) <span className="text-red-500">*</span></Label>
                          <Input id="price" type="number" value={formData.price} onChange={handleChange} onBlur={handleBlur} className={errCls("price")} /><FieldError name="price" /></div>
                        {f?.ratePerSqft && (
                          <div><Label className="font-medium mb-2 block">Rate ({rateUnitLabel}) — auto</Label>
                            <Input value={computedRate ? `₹ ${computedRate}` : "—"} readOnly disabled className="bg-gray-50" /></div>
                        )}
                        {f?.brokerage && (
                          <div><Label className="font-medium mb-2 block">Brokerage (₹ or %)</Label>
                            <Input id="brokerage" type="number" value={formData.brokerage} onChange={handleChange} onBlur={handleBlur} className={errCls("brokerage")} /><FieldError name="brokerage" /></div>
                        )}
                      </div>

                      {/* Amenities (residential only) */}
                      {f?.amenities && (
                        <div>
                          <Label className="font-medium mb-3 block">Amenities</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {amenitiesList.map((a: any) => (
                              <label key={a.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" name={a.key} checked={formData.amenities.includes(a.key)} onChange={handleCheckbox}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-gray-700">{a.label}</span>
                              </label>
                            ))}
                            <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input type="checkbox" checked={formData.hasOtherAmenity} onChange={(e) => toggleOther(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                              <span className="text-gray-700">{t.Other || "Other"}</span>
                            </label>
                          </div>
                          {formData.hasOtherAmenity && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                              <Input id="otherAmenity" placeholder="Custom amenities, comma-separated" value={formData.otherAmenity} onChange={handleChange} className="focus:ring-2 focus:ring-primary/20" />
                            </motion.div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>Previous</Button>
                        <Button type="button" onClick={() => goTo("location")}>Next: Location</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ LOCATION ═════════ */}
                {activeTab === "location" && (
                  <>
                    <SectionHead icon={MapPin} title="Location Information" />
                    <div className="p-6 space-y-4">
                      <div><Label className="font-medium mb-2 block">Full Address <span className="text-red-500">*</span></Label>
                        <Textarea id="address" rows={2} value={formData.address} onChange={handleChange} onBlur={handleBlur} className={errCls("address")} /><FieldError name="address" /></div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><Label className="font-medium mb-2 block">Locality / Area <span className="text-red-500">*</span></Label>
                          <Input id="locality" value={formData.locality} onChange={handleChange} onBlur={handleBlur} className={errCls("locality")} /><FieldError name="locality" /></div>
                        <div><Label className="font-medium mb-2 block">City <span className="text-red-500">*</span></Label>
                          <Input id="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} className={errCls("city")} /><FieldError name="city" /></div>
                        <div><Label className="font-medium mb-2 block">State <span className="text-red-500">*</span></Label>
                          <Input id="state" value={formData.state} onChange={handleChange} onBlur={handleBlur} className={errCls("state")} /><FieldError name="state" /></div>
                        <div><Label className="font-medium mb-2 block">Pincode <span className="text-red-500">*</span></Label>
                          <Input id="pincode" value={formData.pincode} onChange={handleChange} onBlur={handleBlur} maxLength={6} className={errCls("pincode")} /><FieldError name="pincode" /></div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>Previous</Button>
                        <Button type="button" onClick={() => goTo("contact")}>Next: Contact</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ CONTACT ═════════ */}
                {activeTab === "contact" && (
                  <>
                    <SectionHead icon={User} title="Contact Information" />
                    <div className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><Label className="font-medium mb-2 block">Owner / Agent Name <span className="text-red-500">*</span></Label>
                          <Input id="ownerName" value={formData.ownerName} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerName")} /><FieldError name="ownerName" /></div>
                        <div><Label className="font-medium mb-2 block">Phone <span className="text-red-500">*</span></Label>
                          <Input id="ownerPhone" value={formData.ownerPhone} onChange={handleChange} onBlur={handleBlur} maxLength={10} className={errCls("ownerPhone")} /><FieldError name="ownerPhone" /></div>
                        <div className="md:col-span-2"><Label className="font-medium mb-2 block">Email <span className="text-red-500">*</span></Label>
                          <Input id="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerEmail")} /><FieldError name="ownerEmail" /></div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("location")}>Previous</Button>
                        <Button type="button" onClick={() => goTo("media")}>Next: Media</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ MEDIA ═════════ */}
                {activeTab === "media" && (
                  <>
                    <SectionHead icon={Camera} title="Media & Documents" />
                    <div className="p-6 space-y-6">
                      {/* Existing images */}
                      {existingImages.length > 0 && (
                        <div>
                          <Label className="font-medium mb-3 block">Current Images</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {existingImages.map((img, i) => (
                              <div key={i} className="relative group">
                                <img src={img} alt={`Property ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeExistingImage(img)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New images */}
                      <div>
                        <Label className="font-medium mb-2 block">
                          Add / Replace Images {existingImages.length === 0 && <span className="text-red-500">*</span>}
                        </Label>
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${fieldErrors.images ? "border-red-400" : "border-gray-300 hover:border-primary"}`}>
                          <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                          <label htmlFor="image-upload" className="cursor-pointer block">
                            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">Click to upload new images</p>
                          </label>
                        </div>
                        <FieldError name="images" />
                        {imagePreviews.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, i) => (
                              <div key={i} className="relative group">
                                <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeNewImage(i)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Document */}
                      <MediaUpload label={`Document ${formData.category === "Farmland" ? "(7/12)" : ""}`} required
                        file={docFile} existingUrl={existingMedia.doc} error={fieldErrors.document} accept={DOC_ACCEPT}
                        onChange={handleSingleFile(setDocFile, "document", "doc")} onClear={() => setDocFile(null)} />

                      {f?.layoutMap && (
                        <MediaUpload label="Layout Map" file={layoutMapFile} existingUrl={existingMedia.layoutMap} error={fieldErrors.layoutMap} accept={DOC_ACCEPT}
                          onChange={handleSingleFile(setLayoutMapFile, "layoutMap", "doc")} onClear={() => setLayoutMapFile(null)} />
                      )}
                      {f?.landMap && (
                        <MediaUpload label="Land Map" file={landMapFile} existingUrl={existingMedia.landMap} error={fieldErrors.landMap} accept={DOC_ACCEPT}
                          onChange={handleSingleFile(setLandMapFile, "landMap", "doc")} onClear={() => setLandMapFile(null)} />
                      )}
                      {f?.video && (
                        <MediaUpload label="Walkthrough Video (optional)" file={videoFile} existingUrl={existingMedia.video} error={fieldErrors.video} accept="video/*"
                          onChange={handleSingleFile(setVideoFile, "video", "video")} onClear={() => setVideoFile(null)} />
                      )}

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab("contact")}>Previous</Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/70">
                          {loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Updating…</>)
                            : (<><Save className="h-4 w-4 mr-2" />Update Property</>)}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Toasts */}
          <AnimatePresence>
            {serverError && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <AlertCircle className="h-5 w-5" />{serverError}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <CheckCircle className="h-5 w-5" />{success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminSidebar>
  );
}

/* ─── Small presentational helpers ─────────────────────────────────────────── */
function SectionHead({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-gray-900">{title}</h2></div>
    </div>
  );
}

function MediaUpload({ label, required, file, existingUrl, error, accept, onChange, onClear }: {
  label: string; required?: boolean; file: File | null; existingUrl?: string; error?: string; accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void;
}) {
  const domId = `mu-${label.replace(/\W+/g, "")}`;
  return (
    <div>
      <Label className="font-medium mb-2 block">{label}{required && <span className="text-red-500"> *</span>}</Label>

      {file ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
          <span className="flex items-center gap-2 text-sm text-gray-700 truncate">
            <FileText className="w-4 h-4 text-primary shrink-0" />{file.name}
            <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
          </span>
          <button type="button" onClick={onClear} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <>
          {existingUrl && (
            <div className="mb-2 flex items-center gap-3">
              {IMG_EXT.test(existingUrl)
                ? <img src={existingUrl} alt={label} className="h-16 w-16 object-cover rounded border" />
                : <FileText className="h-8 w-8 text-primary" />}
              <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">View current file</a>
              <span className="text-xs text-gray-400">Upload below to replace</span>
            </div>
          )}
          <div className={`border-2 border-dashed rounded-lg p-4 text-center ${error ? "border-red-400" : "border-gray-300 hover:border-primary"}`}>
            <input id={domId} type="file" accept={accept} onChange={onChange} className="hidden" />
            <label htmlFor={domId} className="cursor-pointer flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Upload className="w-4 h-4" /> {existingUrl ? "Replace file" : "Click to upload"}
            </label>
          </div>
        </>
      )}
      {error && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}
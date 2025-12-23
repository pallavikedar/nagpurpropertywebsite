// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Separator } from "@/components/ui/separator"
// // import Navbar from "@/components/navbar"
// // import Footer from "@/components/footer"

// // export default function AddPropertyPage() {
// //   return (
// //     <div className="min-h-screen flex flex-col">
// //       <Navbar />
// //       <main className="flex-1">
// //         <section className="bg-muted py-12">
// //           <div className="container px-4 md:px-6">
// //             <div className="max-w-3xl mx-auto text-center">
// //               <h1 className="text-3xl font-bold tracking-tight mb-2">Add Your Property</h1>
// //               <p className="text-muted-foreground">List your property for sale or rent on Nagpur Properties</p>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="py-12">
// //           <div className="container px-4 md:px-6">
// //             <div className="max-w-3xl mx-auto">
// //               <form className="space-y-8">
// //                 <div className="bg-white p-6 rounded-lg shadow-sm border">
// //                   <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
// //                   <div className="space-y-4">
// //                     <div className="grid gap-2">
// //                       <Label htmlFor="title">Property Title</Label>
// //                       <Input id="title" placeholder="Enter a descriptive title for your property" />
// //                     </div>

// //                     <div className="grid gap-2">
// //                       <Label htmlFor="description">Property Description</Label>
// //                       <Textarea id="description" placeholder="Describe your property in detail" rows={5} />
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div className="grid gap-2">
// //                         <Label htmlFor="type">Property For</Label>
// //                         <Select>
// //                           <SelectTrigger id="type">
// //                             <SelectValue placeholder="Select option" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectItem value="sale">Sale</SelectItem>
// //                             <SelectItem value="rent">Rent</SelectItem>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="category">Property Type</Label>
// //                         <Select>
// //                           <SelectTrigger id="category">
// //                             <SelectValue placeholder="Select type" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectItem value="apartment">Apartment</SelectItem>
// //                             <SelectItem value="house">House</SelectItem>
// //                             <SelectItem value="villa">Villa</SelectItem>
// //                             <SelectItem value="plot">Plot</SelectItem>
// //                             <SelectItem value="commercial">Commercial</SelectItem>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div className="grid gap-2">
// //                         <Label htmlFor="price">Price (₹)</Label>
// //                         <Input id="price" type="number" placeholder="Enter price" />
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="area">Area (sq.ft)</Label>
// //                         <Input id="area" type="number" placeholder="Enter area" />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="bg-white p-6 rounded-lg shadow-sm border">
// //                   <h2 className="text-xl font-semibold mb-4">Property Details</h2>
// //                   <div className="space-y-4">
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                       <div className="grid gap-2">
// //                         <Label htmlFor="bedrooms">Bedrooms</Label>
// //                         <Select>
// //                           <SelectTrigger id="bedrooms">
// //                             <SelectValue placeholder="Select" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             {[1, 2, 3, 4, 5, "5+"].map((num) => (
// //                               <SelectItem key={num} value={String(num)}>
// //                                 {num}
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="bathrooms">Bathrooms</Label>
// //                         <Select>
// //                           <SelectTrigger id="bathrooms">
// //                             <SelectValue placeholder="Select" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             {[1, 2, 3, 4, 5, "5+"].map((num) => (
// //                               <SelectItem key={num} value={String(num)}>
// //                                 {num}
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="furnishing">Furnishing</Label>
// //                         <Select>
// //                           <SelectTrigger id="furnishing">
// //                             <SelectValue placeholder="Select" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectItem value="unfurnished">Unfurnished</SelectItem>
// //                             <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
// //                             <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                     </div>

// //                     <div className="grid gap-2">
// //                       <Label>Amenities</Label>
// //                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
// //                         {[
// //                           "Parking",
// //                           "Lift",
// //                           "Power Backup",
// //                           "Security",
// //                           "Garden",
// //                           "Swimming Pool",
// //                           "Gym",
// //                           "Club House",
// //                           "Children's Play Area",
// //                         ].map((amenity) => (
// //                           <label key={amenity} className="flex items-center space-x-2">
// //                             <input
// //                               type="checkbox"
// //                               className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
// //                             />
// //                             <span>{amenity}</span>
// //                           </label>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="bg-white p-6 rounded-lg shadow-sm border">
// //                   <h2 className="text-xl font-semibold mb-4">Location Information</h2>
// //                   <div className="space-y-4">
// //                     <div className="grid gap-2">
// //                       <Label htmlFor="address">Address</Label>
// //                       <Textarea id="address" placeholder="Enter complete property address" rows={2} />
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div className="grid gap-2">
// //                         <Label htmlFor="locality">Locality/Area</Label>
// //                         <Input id="locality" placeholder="Enter locality" />
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="city">City</Label>
// //                         <Input id="city" placeholder="Enter city" defaultValue="Nagpur" />
// //                       </div>
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div className="grid gap-2">
// //                         <Label htmlFor="state">State</Label>
// //                         <Input id="state" placeholder="Enter state" defaultValue="Maharashtra" />
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="pincode">Pincode</Label>
// //                         <Input id="pincode" placeholder="Enter pincode" />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="bg-white p-6 rounded-lg shadow-sm border">
// //                   <h2 className="text-xl font-semibold mb-4">Property Images</h2>
// //                   <div className="space-y-4">
// //                     <div className="grid gap-2">
// //                       <Label htmlFor="images">Upload Images</Label>
// //                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
// //                         <div className="space-y-2">
// //                           <div className="text-muted-foreground">Drag and drop images here or click to browse</div>
// //                           <Button variant="outline" size="sm">
// //                             Browse Files
// //                           </Button>
// //                           <input id="images" type="file" multiple className="hidden" />
// //                           <div className="text-xs text-muted-foreground">
// //                             Upload up to 10 images (JPEG, PNG, max 5MB each)
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="bg-white p-6 rounded-lg shadow-sm border">
// //                   <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
// //                   <div className="space-y-4">
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div className="grid gap-2">
// //                         <Label htmlFor="owner-name">Owner/Agent Name</Label>
// //                         <Input id="owner-name" placeholder="Enter name" />
// //                       </div>

// //                       <div className="grid gap-2">
// //                         <Label htmlFor="owner-phone">Phone Number</Label>
// //                         <Input id="owner-phone" placeholder="Enter phone number" />
// //                       </div>
// //                     </div>

// //                     <div className="grid gap-2">
// //                       <Label htmlFor="owner-email">Email Address</Label>
// //                       <Input id="owner-email" type="email" placeholder="Enter email address" />
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <Separator />

// //                 <div className="flex flex-col gap-2">
// //                   <label className="flex items-center space-x-2">
// //                     <input
// //                       type="checkbox"
// //                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
// //                     />
// //                     <span>
// //                       I confirm that the information provided is accurate and I have the authority to list this property
// //                     </span>
// //                   </label>

// //                   <Button type="submit" size="lg" className="mt-4">
// //                     Submit Property
// //                   </Button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         </section>
// //       </main>
// //       <Footer />
// //     </div>
// //   )
// // }

// "use client"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"


// export default function AddPropertyPage() {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     type: '',
//     category: '',
//     price: '',
//     area: '',
//     bedrooms: '',
//     bathrooms: '',
//     furnishing: '',
//     amenities: [] as string[],
//     address: '',
//     locality: '',
//     city: 'Nagpur',
//     state: 'Maharashtra',
//     pincode: '',
//     ownerName: '',
//     ownerPhone: '',
//     ownerEmail: '',
//     termsAgreed: false
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleSelectChange = (id: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     if (name === 'termsAgreed') {
//       setFormData(prev => ({
//         ...prev,
//         termsAgreed: checked
//       }));
//     } else {
//       setFormData(prev => {
//         const amenities = checked
//           ? [...prev.amenities, name]
//           : prev.amenities.filter(item => item !== name);
//         return {
//           ...prev,
//           amenities
//         };
//       });
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
  
//     // Check if the user is logged in
//     const isLoggedIn = localStorage.getItem('token'); // Example: Check for a token in localStorage
//     if (!isLoggedIn) {
//       alert('You need to log in to submit a property.');
//       window.location.href = '/user/Login'; // Redirect to the login page
//       return;
//     }
  
//     if (!formData.termsAgreed) {
//       alert('Please agree to the terms before submitting');
//       return;
//     }
  
//     // Get existing properties from localStorage or initialize empty array
//     const existingProperties = JSON.parse(localStorage.getItem('properties') || '[]');
  
//     // Create new property object with current date
//     const newProperty = {
//       ...formData,
//       id: Date.now().toString(), // Generate unique ID
//       date: new Date().toISOString(),
//     };
  
//     // Add new property to the array
//     const updatedProperties = [...existingProperties, newProperty];
  
//     // Save back to localStorage
//     localStorage.setItem('properties', JSON.stringify(updatedProperties));
  
//     // Reset form
//     setFormData({
//       title: '',
//       description: '',
//       type: '',
//       category: '',
//       price: '',
//       area: '',
//       bedrooms: '',
//       bathrooms: '',
//       furnishing: '',
//       amenities: [],
//       address: '',
//       locality: '',
//       city: 'Nagpur',
//       state: 'Maharashtra',
//       pincode: '',
//       ownerName: '',
//       ownerPhone: '',
//       ownerEmail: '',
//       termsAgreed: false,
//     });
  
//     alert('Property submitted successfully!');
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <section className="bg-muted py-12">
//           <div className="container px-4 md:px-6">
//             <div className="max-w-3xl mx-auto text-center">
//               <h1 className="text-3xl font-bold tracking-tight mb-2">Add Your Property</h1>
//               <p className="text-muted-foreground">List your property for sale or rent on Nagpur Properties</p>
//             </div>
//           </div>
//         </section>

//         <section className="py-12">
//           <div className="container px-4 md:px-6">
//             <div className="max-w-3xl mx-auto">
//               <form className="space-y-8" onSubmit={handleSubmit}>
//                 <div className="bg-white p-6 rounded-lg shadow-sm border">
//                   <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="title">Property Title</Label>
//                       <Input 
//                         id="title" 
//                         placeholder="Enter a descriptive title for your property" 
//                         value={formData.title}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="description">Property Description</Label>
//                       <Textarea 
//                         id="description" 
//                         placeholder="Describe your property in detail" 
//                         rows={5} 
//                         value={formData.description}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="type">Property For</Label>
//                         <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
//                           <SelectTrigger id="type">
//                             <SelectValue placeholder="Select option" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="sale">Sale</SelectItem>
//                             <SelectItem value="rent">Rent</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="category">Property Type</Label>
//                         <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
//                           <SelectTrigger id="category">
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="apartment">Apartment</SelectItem>
//                             <SelectItem value="house">House</SelectItem>
//                             <SelectItem value="villa">Villa</SelectItem>
//                             <SelectItem value="plot">Plot</SelectItem>
//                             <SelectItem value="commercial">Commercial</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="price">Price (₹)</Label>
//                         <Input 
//                           id="price" 
//                           type="number" 
//                           placeholder="Enter price" 
//                           value={formData.price}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="area">Area (sq.ft)</Label>
//                         <Input 
//                           id="area" 
//                           type="number" 
//                           placeholder="Enter area" 
//                           value={formData.area}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-sm border">
//                   <h2 className="text-xl font-semibold mb-4">Property Details</h2>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="bedrooms">Bedrooms</Label>
//                         <Select onValueChange={(value) => handleSelectChange('bedrooms', value)} value={formData.bedrooms}>
//                           <SelectTrigger id="bedrooms">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {[1, 2, 3, 4, 5, "5+"].map((num) => (
//                               <SelectItem key={num} value={String(num)}>
//                                 {num}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="bathrooms">Bathrooms</Label>
//                         <Select onValueChange={(value) => handleSelectChange('bathrooms', value)} value={formData.bathrooms}>
//                           <SelectTrigger id="bathrooms">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {[1, 2, 3, 4, 5, "5+"].map((num) => (
//                               <SelectItem key={num} value={String(num)}>
//                                 {num}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="furnishing">Furnishing</Label>
//                         <Select onValueChange={(value) => handleSelectChange('furnishing', value)} value={formData.furnishing}>
//                           <SelectTrigger id="furnishing">
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="unfurnished">Unfurnished</SelectItem>
//                             <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
//                             <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label>Amenities</Label>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                         {[
//                           "Parking",
//                           "Lift",
//                           "Power Backup",
//                           "Security",
//                           "Garden",
//                           "Swimming Pool",
//                           "Gym",
//                           "Club House",
//                           "Children's Play Area",
//                         ].map((amenity) => (
//                           <label key={amenity} className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               name={amenity}
//                               checked={formData.amenities.includes(amenity)}
//                               onChange={handleCheckboxChange}
//                               className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                             />
//                             <span>{amenity}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-sm border">
//                   <h2 className="text-xl font-semibold mb-4">Location Information</h2>
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="address">Address</Label>
//                       <Textarea 
//                         id="address" 
//                         placeholder="Enter complete property address" 
//                         rows={2} 
//                         value={formData.address}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="locality">Locality/Area</Label>
//                         <Input 
//                           id="locality" 
//                           placeholder="Enter locality" 
//                           value={formData.locality}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="city">City</Label>
//                         <Input 
//                           id="city" 
//                           placeholder="Enter city" 
//                           value={formData.city}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="state">State</Label>
//                         <Input 
//                           id="state" 
//                           placeholder="Enter state" 
//                           value={formData.state}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="pincode">Pincode</Label>
//                         <Input 
//                           id="pincode" 
//                           placeholder="Enter pincode" 
//                           value={formData.pincode}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-sm border">
//                   <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="ownerName">Owner/Agent Name</Label>
//                         <Input 
//                           id="ownerName" 
//                           placeholder="Enter name" 
//                           value={formData.ownerName}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>

//                       <div className="grid gap-2">
//                         <Label htmlFor="ownerPhone">Phone Number</Label>
//                         <Input 
//                           id="ownerPhone" 
//                           placeholder="Enter phone number" 
//                           value={formData.ownerPhone}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="ownerEmail">Email Address</Label>
//                       <Input 
//                         id="ownerEmail" 
//                         type="email" 
//                         placeholder="Enter email address" 
//                         value={formData.ownerEmail}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="flex flex-col gap-2">
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       name="termsAgreed"
//                       checked={formData.termsAgreed}
//                       onChange={handleCheckboxChange}
//                       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                       required
//                     />
//                     <span>
//                       I confirm that the information provided is accurate and I have the authority to list this property
//                     </span>
//                   </label>

//                   <Button type="submit" size="lg" className="mt-4">
//                     Submit Property
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   )
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building,
  Users,
  Handshake,
  Settings,
  LogOut,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../baseurl";
import { useRouter } from "next/navigation";

/* ------------------ Reusable Section Card ------------------ */
const SectionCard = ({ title, children }: any) => (
  <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    {children}
  </div>
);

export default function AddPropertyPage() {
    const router =useRouter()
  const { translations: t } = useLanguage();
  const amenities = t.amenities || [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    propertyFor: "",
    propertyType: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "",
    amenities: [],
    address: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    status: "ACCEPTED",
  });

  /* ------------------ Handlers ------------------ */
  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSelect = (key: string, value: string) =>
    setFormData({ ...formData, [key]: value });

  const toggleAmenity = (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter((a: string) => a !== key)
        : [...prev.amenities, key],
    }));
  };

  const handleImageChange = (e: any) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token =
        localStorage.getItem("usertoken") ||
        localStorage.getItem("admintoken");

      if (!token) {
        window.location.href = "/Login";
        return;
      }

      const fd = new FormData();

      fd.append(
        "property",
        new Blob(
          [
            JSON.stringify({
              ...formData,
              price: Number(formData.price),
              area: Number(formData.area),
              bedrooms: Number(formData.bedrooms),
              bathrooms: Number(formData.bathrooms),
            }),
          ],
          { type: "application/json" }
        )
      );

      images.forEach((img) => fd.append("images", img));

      const res = await fetch(`${BASE_URL}/addProperty`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to submit property");

      setSuccess("Property added successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }

  /* ------------------ Layout ------------------ */
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r z-10">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Nagpur Properties
              </span>
            </Link>
          </div>
          <div className="flex-1 py-6 px-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted text-primary font-medium"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/Properties"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Building className="h-5 w-5" />
              <span>Properties</span>
            </Link>
            <Link
              href="/admin/propertyEnquiry"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Enquiries</span>
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Handshake  className="h-5 w-5" />
              <span>Legal Consultancy Enquiry</span>
            </Link>
            <Link
              href="/admin/getusers"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </div>
          <div className="p-4 border-t">
            <button
              className="flex items-center space-x-2 px-3 py-2 w-full rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={handleclick}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      {/* Main */}
      <main className="ml-64 flex-1 bg-gray-50 p-8">
        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold">Add Property</h1>
            <p className="text-muted-foreground text-sm">
              Fill all details carefully before submitting
            </p>
          </div>

          {/* Basic Info */}
          <SectionCard title="Basic Information">
            <InputBlock label="Title" id="title" onChange={handleChange} />
            <TextareaBlock
              label="Description"
              id="description"
              onChange={handleChange}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <SelectBlock
                label="Property For"
                options={["Sell", "Rent"]}
                onChange={(v) => handleSelect("propertyFor", v)}
              />
              <SelectBlock
                label="Property Type"
                options={[
                  "Apartment",
                  "Villa",
                  "House",
                  "Plot",
                  "Commercial",
                ]}
                onChange={(v) => handleSelect("propertyType", v)}
              />
            </div>
          </SectionCard>

          {/* Details */}
          <SectionCard title="Property Details">
            <div className="grid md:grid-cols-3 gap-4">
              <InputBlock label="Price" id="price" type="number" />
              <InputBlock label="Area (sqft)" id="area" type="number" />
              <InputBlock label="Bedrooms" id="bedrooms" type="number" />
              <InputBlock label="Bathrooms" id="bathrooms" type="number" />
            </div>
          </SectionCard>

          {/* Amenities */}
          <SectionCard title="Amenities">
            <div className="flex flex-wrap gap-2">
              {amenities.map((a: any) => (
                <button
                  type="button"
                  key={a.key}
                  onClick={() => toggleAmenity(a.key)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    formData.amenities.includes(a.key)
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Images */}
          <SectionCard title="Property Images">
            <label className="border-dashed border-2 rounded-lg p-6 text-center block cursor-pointer">
              <Upload className="mx-auto mb-2" />
              Upload Images
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </SectionCard>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>

        {/* Sticky Submit */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t p-4 flex justify-end">
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Property"}
          </Button>
        </div>
      </main>

    
    </div>
  );
}

/* ------------------ Small UI Helpers ------------------ */
const InputBlock = ({ label, id, type = "text", onChange }: any) => (
  <div>
    <Label>{label}</Label>
    <Input id={id} type={type} onChange={onChange} />
  </div>
);

const TextareaBlock = ({ label, id, onChange }: any) => (
  <div>
    <Label>{label}</Label>
    <Textarea id={id} rows={4} onChange={onChange} />
  </div>
);

const SelectBlock = ({ label, options, onChange }: any) => (
  <div>
    <Label>{label}</Label>
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o: string) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

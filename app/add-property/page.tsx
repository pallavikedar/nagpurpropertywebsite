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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {LanguageProvider, useLanguage } from "@/context/language-context"
import { BASE_URL } from "../baseurl";

export default function AddPropertyPage() {
   const { translations } = useLanguage()
    const t = translations
      const amenities = translations.amenities || []
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyFor: "",
    propertyType: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "",
    amenities: [] as string[],
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

  const [images, setImages] = useState<File[]>([]); // State to store selected images
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const amenities = checked
        ? [...prev.amenities, name]
        : prev.amenities.filter((item) => item !== name);
      return {
        ...prev,
        amenities,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files)); // Convert FileList to an array
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userToken = localStorage.getItem("usertoken");
      const adminToken = localStorage.getItem("admintoken");
      const token = userToken || adminToken;

      if (!token) {
        alert("You need to log in to submit a property.");
        window.location.href = "/Login";
        return;
      }

      console.log("User Token:", userToken);
      console.log("Admin Token:", adminToken);
      console.log("Token being used:", token); // Debugging: Log the token

      // Create FormData object
      const formDataToSend = new FormData();

      // Append JSON data as a string
      const propertyData = JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
      });

      formDataToSend.append("property", new Blob([propertyData], { type: "application/json" }));

      // Append images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Debugging: Log FormData keys and values
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Send POST request
      const response = await fetch(`${BASE_URL}/addProperty`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add token for authentication
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to submit property.";
        console.error("Server error:", response.status, response.statusText);
        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            console.error("Server JSON error:", errorData);
            errorMessage = errorData.message || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("Server text error:", errorText);
            if (errorText.includes("Access denied")) {
              errorMessage = "Access denied. You are not authorized.";
            }
          }
        } catch (err) {
          console.error("Error reading response body:", err);
        }

        throw new Error(errorMessage);
      }

      // Success
      setSuccess("Property submitted successfully!");
      setFormData({
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
      setImages([]);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-2">{t.AddYourProperty}</h1>
              <p className="text-muted-foreground">{t.ListyourpropertyforsaleorrentonNagpurProperties}</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">{t.BasicInformation}</h2>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">{t.PropertyTitle}</Label>
                      <Input
                        id="title"
                        placeholder={t.Enteradescriptivetitleforyourproperty}
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">{t.PropertyDescription}</Label>
                      <Textarea
                        id="description"
                        placeholder={t.Describeyourpropertyindetail}
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="propertyFor">{t.PropertyFor}</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("propertyFor", value)}
                          value={formData.propertyFor}
                        >
                          <SelectTrigger id="propertyFor">
                            <SelectValue placeholder={t.Selectoption}/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sale">{t.Sell}</SelectItem>
                            <SelectItem value="Rent">{t.Rent}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="propertyType">{t.PropertyType}</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("propertyType", value)}
                          value={formData.propertyType}
                        >
                          <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Villa">{t.Villa}</SelectItem>
                            <SelectItem value="Apartment">{t.Apartment}</SelectItem>
                            <SelectItem value="House">{t.House}</SelectItem>
                            <SelectItem value="Plot">{t.Plot}</SelectItem>
                            <SelectItem value="Commercial">{t.Commercial}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">{t.PropertyDetails}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">{t.Price}</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder={t.Enterprice}
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="area">{t.Area} {t.sqft}</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder={t.Enterarea}
                        value={formData.area}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bedrooms">{t.Bedrooms}</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder={t.Enternumberofbedrooms}
                        value={formData.bedrooms}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bathrooms">{t.Bathrooms}</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder={t.Enternumberofbathrooms}
                        value={formData.bathrooms}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="furnishing">{t.Furnishing}</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("furnishing", value)}
                        value={formData.furnishing}
                      >
                        <SelectTrigger id="furnishing">
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fully Furnished">{t.FullyFurnished}</SelectItem>
                          <SelectItem value="Semi-Furnished">{t.SemiFurnished}</SelectItem>
                          <SelectItem value="Unfurnished">{t.Unfurnished}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">{t.Amenities}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
                      <label key={amenity.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={amenity.key}
                          checked={formData.amenities.includes(amenity.key)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">{t.LocationInformation}</h2>
                  <div className="grid gap-2">
                    <Label htmlFor="address">{t.Address}</Label>
                    <Textarea
                      id="address"
                      placeholder={t.Entercompletepropertyaddress}
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="locality">{t.LocalityArea}</Label>
                      <Input
                        id="locality"
                        placeholder={t.Enterlocality}
                        value={formData.locality}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city">{t.City}</Label>
                      <Input
                        id="city"
                        placeholder={t.Entercity}
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="state">{t.State}</Label>
                      <Input
                        id="state"
                        placeholder={t.Enterstate}
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="pincode">{t.Pincode}</Label>
                      <Input
                        id="pincode"
                        placeholder={t.Enterpincode}
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">{t.ContactInformation}</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ownerName">{t.OwnerAgentName}</Label>
                        <Input 
                          id="ownerName" 
                          placeholder={t.Entername} 
                          value={formData.ownerName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="ownerPhone">{t.PhoneNumber}</Label>
                        <Input 
                          id="ownerPhone" 
                          placeholder={t.Enterphonenumber} 
                          value={formData.ownerPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ownerEmail">{t.EmailAddress}</Label>
                      <Input 
                        id="ownerEmail" 
                        type="email" 
                        placeholder={t.Enteremailaddress}
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

          

                {/* Property Images */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">{t.propertyImages}</h2>
                  <div className="grid gap-2">
                    <Label htmlFor="images">{t.UploadImages}</Label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <Button type="submit" size="lg" className="mt-4">
                 {t.SubmitProperty}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

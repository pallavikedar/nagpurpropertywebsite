"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  Home,
  Building,
  MapPin,
  User,
  Image as ImageIcon,
  DollarSign,
  Bed,
  Bath,
  Square,
  Heart,
  Shield,
  Clock
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../../baseurl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin-sidebar";

// 🔥 IMPORTANT: Add this line to fix Vercel deployment
export const dynamic = 'force-dynamic';

export default function UpdatePropertyPage() {
  const { translations } = useLanguage();
  const t = translations;
  const amenitiesList = translations.amenities || [];
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

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

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("admintoken");
        if (!token) {
          alert("Admin token missing. Please log in.");
          router.push("/Login");
          return;
        }

        const res = await fetch(`${BASE_URL}/property/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch property data.");

        const data = await res.json();

        setFormData({
          title: data.title || "",
          description: data.description || "",
          propertyFor: data.propertyFor || "",
          propertyType: data.propertyType || "",
          price: data.price?.toString() || "",
          area: data.area?.toString() || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          furnishing: data.furnishing || "",
          amenities: data.amenities || [],
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
      } catch (err) {
        setError(err.message || "Failed to load property.");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const amenities = checked
        ? [...prev.amenities, name]
        : prev.amenities.filter((item) => item !== name);
      return { ...prev, amenities };
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create preview URLs for new images
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl) => {
    if (!confirm("Remove this image?")) return;
    
    try {
      const token = localStorage.getItem("admintoken");
      const response = await fetch(`${BASE_URL}/property/${id}/remove-image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (response.ok) {
        setExistingImages(prev => prev.filter(img => img !== imageUrl));
      }
    } catch (err) {
      console.error("Failed to remove image", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        alert("Admin token missing. Please log in.");
        router.push("/Login");
        return;
      }

      const formDataToSend = new FormData();

      const propertyData = JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
      });

      formDataToSend.append("property", new Blob([propertyData], { type: "application/json" }));

      images.forEach((img) => formDataToSend.append("images", img));

      const res = await fetch(`${BASE_URL}/editProperty/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update property.");
      }

      setSuccess("Property updated successfully!");
      setTimeout(() => {
        router.push("/admin/Properties");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: Home },
    { id: "details", label: "Property Details", icon: Building },
    { id: "location", label: "Location", icon: MapPin },
    { id: "contact", label: "Contact", icon: User },
  ];

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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Edit Property
                </h1>
                <p className="text-gray-500 mt-1">
                  Update property information and manage images
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/Properties")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Properties
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeTab === section.id;
                return (
                  <div key={section.id} className="flex items-center">
                    <button
                      onClick={() => setActiveTab(section.id)}
                      className={`flex flex-col items-center group transition-all ${
                        isActive ? "scale-105" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-lg"
                            : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 ${
                          isActive ? "text-primary font-semibold" : "text-gray-500"
                        }`}
                      >
                        {section.label}
                      </span>
                    </button>
                    {index < sections.length - 1 && (
                      <div className="w-12 h-px bg-gray-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            {activeTab === "basic" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">
                      Property Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter property title"
                      className="focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe the property in detail"
                      className="focus:ring-2 focus:ring-primary/20 resize-none"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Property For</Label>
                      <Select value={formData.propertyFor} onValueChange={(v) => handleSelectChange("propertyFor", v)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sale">For Sale</SelectItem>
                          <SelectItem value="Rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Property Type</Label>
                      <Select value={formData.propertyType} onValueChange={(v) => handleSelectChange("propertyType", v)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">Status</Label>
                    <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                      <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="REJECT">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => setActiveTab("details")}>
                      Next: Property Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Property Details */}
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Price (₹)</Label>
                      <Input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Area (sq.ft)</Label>
                      <Input
                        type="number"
                        id="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Enter area"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Bedrooms</Label>
                      <Input
                        type="number"
                        id="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        placeholder="Number of bedrooms"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Bathrooms</Label>
                      <Input
                        type="number"
                        id="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        placeholder="Number of bathrooms"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Furnishing</Label>
                      <Select value={formData.furnishing} onValueChange={(v) => handleSelectChange("furnishing", v)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                          <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                          <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="text-gray-700 font-medium mb-3 block">Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name={amenity.key}
                            checked={formData.amenities.includes(amenity.key)}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-gray-700">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Existing Images Display */}
                  {existingImages.length > 0 && (
                    <div>
                      <Label className="text-gray-700 font-medium mb-3 block">Current Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={img}
                              alt={`Property ${i + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(img)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Upload */}
                  <div>
                    <Label className="text-gray-700 font-medium mb-3 block">Upload New Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer block">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                        <Button type="button" variant="outline" className="mt-4">
                          Select Images
                        </Button>
                      </label>
                    </div>
                    
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                      Previous
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("location")}>
                      Next: Location Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Location Information */}
            {activeTab === "location" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">Full Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Enter complete address"
                      className="focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Locality/Area</Label>
                      <Input
                        id="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        placeholder="Enter locality"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Enter 6-digit pincode"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                      Previous
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("contact")}>
                      Next: Contact Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Information */}
            {activeTab === "contact" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Owner/Agent Name</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Enter owner/agent name"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Phone Number</Label>
                      <Input
                        id="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-700 font-medium mb-2 block">Email Address</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("location")}>
                      Previous
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/70">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Property
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </form>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
              >
                <AlertCircle className="h-5 w-5" />
                {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
              >
                <CheckCircle className="h-5 w-5" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminSidebar>
  );
}
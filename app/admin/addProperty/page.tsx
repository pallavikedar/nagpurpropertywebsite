"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building,
  Users,
  Handshake,
  Settings,
  LogOut,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  Eye,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  User,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../baseurl";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";

/* ------------------ Reusable Section Card ------------------ */
const SectionCard = ({ title, icon: Icon, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl border shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </motion.div>
);

/* ------------------ Input Components ------------------ */
const InputBlock = ({ label, id, type = "text", required = false, value, onChange, placeholder }: any) => (
  <div>
    <Label className="text-gray-700 font-medium mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="focus:ring-2 focus:ring-primary/20 transition-all"
      required={required}
    />
  </div>
);

const TextareaBlock = ({ label, id, required = false, value, onChange, placeholder }: any) => (
  <div>
    <Label className="text-gray-700 font-medium mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Textarea
      id={id}
      rows={4}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="focus:ring-2 focus:ring-primary/20 transition-all resize-none"
      required={required}
    />
  </div>
);

const SelectBlock = ({ label, options, value, onChange, required = false, placeholder }: any) => (
  <div>
    <Label className="text-gray-700 font-medium mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
        <SelectValue placeholder={placeholder || "Select an option"} />
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

export default function AddPropertyPage() {
  const router = useRouter();
  const { translations: t } = useLanguage();
  const amenities = t.amenities || [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [imagePreviews, setImagePreviews] = useState([]);

  const [images, setImages] = useState([]);
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

  /* ------------------ Handlers ------------------ */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSelect = (key, value) =>
    setFormData({ ...formData, [key]: value });

  const toggleAmenity = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key],
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title) {
      setError("Please enter property title");
      setLoading(false);
      return;
    }
    if (!formData.propertyFor) {
      setError("Please select property purpose");
      setLoading(false);
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one property image");
      setLoading(false);
      return;
    }

    try {
      const token =
        localStorage.getItem("usertoken") ||
        localStorage.getItem("admintoken");

      if (!token) {
        router.push("/Login");
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
      
      // Reset form after 2 seconds
      setTimeout(() => {
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
        setImagePreviews([]);
      }, 2000);
      
    } catch (err) {
      setError(err.message);
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

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Add New Property
                </h1>
                <p className="text-gray-500 mt-1">
                  Fill in the details below to list a new property
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
              <SectionCard title="Basic Information" icon={Home} delay={0.1}>
                <InputBlock
                  label="Property Title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Luxurious 3BHK Apartment with Garden"
                  required
                />
                
                <TextareaBlock
                  label="Property Description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property in detail including features, nearby amenities, etc."
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <SelectBlock
                    label="Property For"
                    options={["Sale", "Rent"]}
                    value={formData.propertyFor}
                    onChange={(v) => handleSelect("propertyFor", v)}
                    required
                    placeholder="Select purpose"
                  />
                  
                  <SelectBlock
                    label="Property Type"
                    options={["Apartment", "Villa", "House", "Plot", "Commercial"]}
                    value={formData.propertyType}
                    onChange={(v) => handleSelect("propertyType", v)}
                    required
                    placeholder="Select type"
                  />
                </div>
                
                <SelectBlock
                  label="Furnishing Status"
                  options={["Fully Furnished", "Semi-Furnished", "Unfurnished"]}
                  value={formData.furnishing}
                  onChange={(v) => handleSelect("furnishing", v)}
                  required
                  placeholder="Select furnishing"
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setActiveTab("details")}>
                    Next: Property Details
                  </Button>
                </div>
              </SectionCard>
            )}

            {/* Property Details */}
            {activeTab === "details" && (
              <SectionCard title="Property Details" icon={Building} delay={0.2}>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputBlock
                    label="Price (₹)"
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                  />
                  
                  <InputBlock
                    label="Area (sq.ft)"
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter area"
                    required
                  />
                  
                  <InputBlock
                    label="Bedrooms"
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="Number of bedrooms"
                    required
                  />
                  
                  <InputBlock
                    label="Bathrooms"
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="Number of bathrooms"
                    required
                  />
                </div>

                {/* Amenities */}
                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <button
                        type="button"
                        key={a.key}
                        onClick={() => toggleAmenity(a.key)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          formData.amenities.includes(a.key)
                            ? "bg-gradient-to-r from-primary to-primary/70 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Images */}
                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">Property Images</Label>
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
                            onClick={() => removeImage(index)}
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
              </SectionCard>
            )}

            {/* Location Information */}
            {activeTab === "location" && (
              <SectionCard title="Location Information" icon={MapPin} delay={0.3}>
                <TextareaBlock
                  label="Full Address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete property address"
                  required
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <InputBlock
                    label="Locality/Area"
                    id="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    placeholder="Enter locality"
                    required
                  />
                  
                  <InputBlock
                    label="City"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                  
                  <InputBlock
                    label="State"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                  
                  <InputBlock
                    label="Pincode"
                    id="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    required
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                    Previous
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("contact")}>
                    Next: Contact Details
                  </Button>
                </div>
              </SectionCard>
            )}

            {/* Contact Information */}
            {activeTab === "contact" && (
              <SectionCard title="Contact Information" icon={User} delay={0.4}>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputBlock
                    label="Owner/Agent Name"
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner/agent name"
                    required
                  />
                  
                  <InputBlock
                    label="Phone Number"
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    required
                  />
                  
                  <InputBlock
                    label="Email Address"
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("location")}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/70">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Submit Property
                      </>
                    )}
                  </Button>
                </div>
              </SectionCard>
            )}
          </form>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
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
                className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
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
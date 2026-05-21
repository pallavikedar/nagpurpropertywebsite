
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../baseurl";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Home,
  MapPin,
  Camera,
  User,
  DollarSign,
} from "lucide-react";

// ─── Field Visibility Rules by Property Type ───────────────────────────────
const PROPERTY_TYPE_CONFIG: Record<
  string,
  { showBedrooms: boolean; showBathrooms: boolean; showFurnishing: boolean }
> = {
  Villa:      { showBedrooms: true,  showBathrooms: true,  showFurnishing: true  },
  Apartment:  { showBedrooms: true,  showBathrooms: true,  showFurnishing: true  },
  House:      { showBedrooms: true,  showBathrooms: true,  showFurnishing: true  },
  Plot:       { showBedrooms: false, showBathrooms: false, showFurnishing: false },
  Commercial: { showBedrooms: false, showBathrooms: true,  showFurnishing: true  },
};

const DEFAULT_CONFIG = { showBedrooms: true, showBathrooms: true, showFurnishing: true };

const IMAGE_COMPRESSION_THRESHOLD = 5 * 1024 * 1024; // 5 MB

// ─── Image Compression Helper ─────────────────────────────────────────────
async function compressImage(file: File, quality = 0.7): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Scale down if very large (max 2400px on longest side)
        const MAX_DIM = 2400;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          "image/jpeg",
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Session-aware fetch wrapper ──────────────────────────────────────────
async function authorizedFetch(url: string, options: RequestInit): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    // Session expired — clear tokens and redirect to login
    localStorage.removeItem("usertoken");
    localStorage.removeItem("admintoken");
    window.location.href = "/Login";
    // Return a dummy rejected promise so the caller doesn't continue
    throw new Error("Session expired. Redirecting to login...");
  }

  return response;
}

export default function AddPropertyPage() {
  const { translations } = useLanguage();
  const t = translations;
  const amenities = translations.amenities || [];

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

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [compressingImages, setCompressingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const typeConfig =
    formData.propertyType
      ? PROPERTY_TYPE_CONFIG[formData.propertyType] ?? DEFAULT_CONFIG
      : DEFAULT_CONFIG;

  const sections = [
    { title: t.BasicInformation,    icon: Home         },
    { title: t.PropertyDetails,     icon: DollarSign   },
    { title: t.Amenities,           icon: CheckCircle  },
    { title: t.LocationInformation, icon: MapPin       },
    { title: t.ContactInformation,  icon: User         },
    { title: t.propertyImages,      icon: Camera       },
  ];

  // ─── Check token on mount (catch already-expired sessions) ───────────────
  useEffect(() => {
    const userToken  = localStorage.getItem("usertoken");
    const adminToken = localStorage.getItem("admintoken");
    if (!userToken && !adminToken) {
      window.location.href = "/Login";
    }
  }, []);

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [id]: value };
      if (id === "propertyType") {
        const config = PROPERTY_TYPE_CONFIG[value] ?? DEFAULT_CONFIG;
        if (!config.showBedrooms)   updated.bedrooms   = "";
        if (!config.showBathrooms)  updated.bathrooms  = "";
        if (!config.showFurnishing) updated.furnishing = "";
      }
      return updated;
    });
    if (error) setError("");
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const amenities = checked
        ? [...prev.amenities, name]
        : prev.amenities.filter((item) => item !== name);
      return { ...prev, amenities };
    });
  };

  // ─── Image selection with auto-compression ───────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > 10) {
      setError("You can upload a maximum of 10 images");
      return;
    }

    setError("");
    setCompressingImages(true);

    try {
      const processedFiles = await Promise.all(
        newFiles.map(async (file) => {
          if (file.size > IMAGE_COMPRESSION_THRESHOLD) {
            return await compressImage(file, 0.7);
          }
          return file;
        })
      );

      const newPreviews = processedFiles.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...processedFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch {
      setError("Failed to process one or more images. Please try again.");
    } finally {
      setCompressingImages(false);
      // Reset file input so the same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validateForm = () => {
    if (!formData.title.trim())       return "Please enter property title";
    if (!formData.description.trim()) return "Please enter property description";
    if (!formData.propertyFor)        return "Please select property purpose";
    if (!formData.propertyType)       return "Please select property type";

    if (!formData.price || parseFloat(formData.price) <= 0) return "Please enter valid price";
    if (!formData.area  || parseFloat(formData.area)  <= 0) return "Please enter valid area";

    if (typeConfig.showBedrooms  && (!formData.bedrooms  || parseInt(formData.bedrooms)  < 0))
      return "Please enter valid number of bedrooms";
    if (typeConfig.showBathrooms && (!formData.bathrooms || parseInt(formData.bathrooms) < 0))
      return "Please enter valid number of bathrooms";
    if (typeConfig.showFurnishing && !formData.furnishing)
      return "Please select furnishing status";

    if (!formData.address.trim())  return "Please enter address";
    if (!formData.locality.trim()) return "Please enter locality";
    if (!formData.city.trim())     return "Please enter city";
    if (!formData.state.trim())    return "Please enter state";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode))
      return "Please enter valid 6-digit pincode";

    if (!formData.ownerName.trim()) return "Please enter owner/agent name";
    if (!formData.ownerPhone.trim() || !/^\d{10}$/.test(formData.ownerPhone))
      return "Please enter valid 10-digit phone number";
    if (!formData.ownerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail))
      return "Please enter valid email address";

    if (images.length === 0) return "Please upload at least one property image";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userToken  = localStorage.getItem("usertoken");
      const adminToken = localStorage.getItem("admintoken");
      const token      = userToken || adminToken;

      if (!token) {
        setError("Your session has expired. Redirecting to login...");
        setTimeout(() => { window.location.href = "/Login"; }, 1500);
        return;
      }

      const formDataToSend = new FormData();

      const propertyData = {
        ...formData,
        price:     parseFloat(formData.price),
        area:      parseFloat(formData.area),
        bedrooms:  typeConfig.showBedrooms   ? parseInt(formData.bedrooms,  10) : undefined,
        bathrooms: typeConfig.showBathrooms  ? parseInt(formData.bathrooms, 10) : undefined,
        furnishing: typeConfig.showFurnishing ? formData.furnishing : undefined,
      };

      formDataToSend.append(
        "property",
        new Blob([JSON.stringify(propertyData)], { type: "application/json" })
      );
      images.forEach((image) => formDataToSend.append("images", image));

      // Uses session-aware fetch — auto-redirects on 401/403
      const response = await authorizedFetch(`${BASE_URL}/addProperty`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit property");
      }

      // ── Success: detailed confirmation message ────────────────────────────
      setSuccess(
        "🎉 Property submitted successfully! Admin will review your property. Check your property status in My Property page."
      );

      // Reset form
      setFormData({
        title: "", description: "", propertyFor: "", propertyType: "",
        price: "", area: "", bedrooms: "", bathrooms: "", furnishing: "",
        amenities: [], address: "", locality: "", city: "", state: "",
        pincode: "", ownerName: "", ownerPhone: "", ownerEmail: "",
        status: "ACCEPTED",
      });

      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setImages([]);
      setImagePreviews([]);
      setCurrentSection(0);

      setTimeout(() => { window.location.href = "/myproperty"; }, 3000);
    } catch (err: any) {
      // Don't overwrite the session-expiry redirect with a generic error
      if (err.message !== "Session expired. Redirecting to login...") {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 text-center px-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t.AddYourProperty}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              {t.ListyourpropertyforsaleorrentonNagpurProperties}
            </p>
          </motion.div>
        </section>

        {/* Progress Indicator */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="container px-4 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive    = index === currentSection;
                const isCompleted = index < currentSection;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-white scale-110"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted
                        ? <CheckCircle className="w-4 h-4" />
                        : <Icon className="w-4 h-4" />
                      }
                    </div>
                    <span className="hidden md:inline text-xs mt-1 text-gray-600">
                      {section.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">

              {/* Alerts */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Property Submitted Successfully!</p>
                      <p className="text-sm mt-1">
                        Admin will review your property. You can check the status on the{" "}
                        <a href="/myproperty" className="underline font-medium hover:text-green-800">
                          My Property
                        </a>{" "}
                        page. Redirecting in a moment…
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">

                  {/* ── Section 0: Basic Information ── */}
                  {currentSection === 0 && (
                    <motion.div
                      key="basic"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 md:p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.BasicInformation}</h2>
                      <div className="space-y-5">

                        <div>
                          <Label htmlFor="title" className="text-gray-700 font-medium mb-2 block">
                            {t.PropertyTitle} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="e.g., Luxurious 3BHK Villa with Garden"
                            value={formData.title}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-gray-700 font-medium mb-2 block">
                            {t.PropertyDescription} <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your property in detail including features, nearby amenities, etc."
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="propertyFor" className="text-gray-700 font-medium mb-2 block">
                              {t.PropertyFor} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("propertyFor", value)}
                              value={formData.propertyFor}
                            >
                              <SelectTrigger id="propertyFor" className="focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sale">{t.Sell}</SelectItem>
                                <SelectItem value="Rent">{t.Rent}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="propertyType" className="text-gray-700 font-medium mb-2 block">
                              {t.PropertyType} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("propertyType", value)}
                              value={formData.propertyType}
                            >
                              <SelectTrigger id="propertyType" className="focus:ring-2 focus:ring-primary/20">
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

                        {formData.propertyType === "Plot" && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm"
                          >
                            ℹ️ For <strong>Plot</strong> type, bedroom, bathroom, and furnishing details are not applicable and will be skipped.
                          </motion.div>
                        )}

                        {formData.propertyType === "Commercial" && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm"
                          >
                            ℹ️ For <strong>Commercial</strong> type, bedroom count is not applicable and will be skipped.
                          </motion.div>
                        )}

                      </div>
                    </motion.div>
                  )}

                  {/* ── Section 1: Property Details ── */}
                  {currentSection === 1 && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 md:p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.PropertyDetails}</h2>

                      {formData.propertyType && (
                        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          <span>📋</span>
                          <span>{formData.propertyType} — showing relevant fields only</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                          <Label htmlFor="price" className="text-gray-700 font-medium mb-2 block">
                            {t.Price} (₹) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="area" className="text-gray-700 font-medium mb-2 block">
                            {t.Area} ({t.sqft}) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="area"
                            type="number"
                            placeholder="Enter area"
                            value={formData.area}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                        {typeConfig.showBedrooms && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                          >
                            <Label htmlFor="bedrooms" className="text-gray-700 font-medium mb-2 block">
                              {t.Bedrooms} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("bedrooms", value)}
                              value={formData.bedrooms}
                            >
                              <SelectTrigger id="bedrooms" className="focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder="Select bedrooms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Bedroom</SelectItem>
                                <SelectItem value="2">2 Bedrooms</SelectItem>
                                <SelectItem value="3">3 Bedrooms</SelectItem>
                                <SelectItem value="4">4 Bedrooms</SelectItem>
                                <SelectItem value="5">5 Bedrooms</SelectItem>
                                <SelectItem value="6">6+ Bedrooms</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        {typeConfig.showBathrooms && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                          >
                            <Label htmlFor="bathrooms" className="text-gray-700 font-medium mb-2 block">
                              {t.Bathrooms} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("bathrooms", value)}
                              value={formData.bathrooms}
                            >
                              <SelectTrigger id="bathrooms" className="focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder="Select bathrooms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Bathroom</SelectItem>
                                <SelectItem value="2">2 Bathrooms</SelectItem>
                                <SelectItem value="3">3 Bathrooms</SelectItem>
                                <SelectItem value="4">4 Bathrooms</SelectItem>
                                <SelectItem value="5">5+ Bathrooms</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        {typeConfig.showFurnishing && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className={!typeConfig.showBedrooms ? "md:col-span-2" : ""}
                          >
                            <Label htmlFor="furnishing" className="text-gray-700 font-medium mb-2 block">
                              {t.Furnishing} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("furnishing", value)}
                              value={formData.furnishing}
                            >
                              <SelectTrigger id="furnishing" className="focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder="Select furnishing" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Fully Furnished">{t.FullyFurnished}</SelectItem>
                                <SelectItem value="Semi-Furnished">{t.SemiFurnished}</SelectItem>
                                <SelectItem value="Unfurnished">{t.Unfurnished}</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        {formData.propertyType === "Plot" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="md:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm"
                          >
                            🏞️ <strong>Plot properties</strong> only require price and area — bedroom, bathroom, and furnishing details are not applicable.
                          </motion.div>
                        )}

                      </div>
                    </motion.div>
                  )}

                  {/* ── Section 2: Amenities ── */}
                  {currentSection === 2 && (
                    <motion.div
                      key="amenities"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 md:p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.Amenities}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {amenities.map((amenity) => (
                          <label
                            key={amenity.key}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          >
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
                    </motion.div>
                  )}

                  {/* ── Section 3: Location Information ── */}
                  {currentSection === 3 && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 md:p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.LocationInformation}</h2>
                      <div className="space-y-5">

                        <div>
                          <Label htmlFor="address" className="text-gray-700 font-medium mb-2 block">
                            {t.Address} <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="address"
                            placeholder="Enter complete property address"
                            rows={2}
                            value={formData.address}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="locality" className="text-gray-700 font-medium mb-2 block">
                              {t.LocalityArea} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="locality"
                              placeholder="Enter locality"
                              value={formData.locality}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="city" className="text-gray-700 font-medium mb-2 block">
                              {t.City} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="city"
                              placeholder="Enter city"
                              value={formData.city}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="state" className="text-gray-700 font-medium mb-2 block">
                              {t.State} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="state"
                              placeholder="Enter state"
                              value={formData.state}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="pincode" className="text-gray-700 font-medium mb-2 block">
                              {t.Pincode} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="pincode"
                              placeholder="Enter 6-digit pincode"
                              value={formData.pincode}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* ── Section 4: Contact Information ── */}
                  {currentSection === 4 && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 md:p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.ContactInformation}</h2>
                      <div className="space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="ownerName" className="text-gray-700 font-medium mb-2 block">
                              {t.OwnerAgentName} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="ownerName"
                              placeholder="Enter name"
                              value={formData.ownerName}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="ownerPhone" className="text-gray-700 font-medium mb-2 block">
                              {t.PhoneNumber} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="ownerPhone"
                              placeholder="10-digit phone number"
                              value={formData.ownerPhone}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="ownerEmail" className="text-gray-700 font-medium mb-2 block">
                            {t.EmailAddress} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="ownerEmail"
                            type="email"
                            placeholder="Enter email address"
                            value={formData.ownerEmail}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* ── Section 5: Property Images ── */}
                  {currentSection === 5 && (
                    <motion.div
                      key="images"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg border p-6 md:p-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.propertyImages}</h2>
                      <div className="space-y-4">

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                          <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={compressingImages}
                          />
                          <label htmlFor="images" className="cursor-pointer block">
                            {compressingImages ? (
                              <>
                                <Loader2 className="w-12 h-12 mx-auto text-primary mb-3 animate-spin" />
                                <p className="text-gray-600 mb-2 font-medium">Compressing images…</p>
                                <p className="text-sm text-gray-500">Images over 5 MB are automatically compressed</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500">
                                  PNG, JPG, JPEG up to 10 MB each (Max 10 images)
                                </p>
                                <p className="text-xs text-blue-500 mt-1">
                                  Images over 5 MB will be automatically compressed
                                </p>
                                <Button type="button" variant="outline" className="mt-4" disabled={compressingImages}>
                                  Select Images
                                </Button>
                              </>
                            )}
                          </label>
                        </div>

                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                  <X className="w-4 h-4" />
                                </button>
                                {/* Show file size badge */}
                                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                  {(images[index]?.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 mt-8">
                  {currentSection > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevSection}
                      size="lg"
                      className="px-8"
                    >
                      Previous
                    </Button>
                  )}

                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextSection}
                      size="lg"
                      className="px-8 ml-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className="px-8 ml-auto"
                      disabled={loading || compressingImages}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        t.SubmitProperty
                      )}
                    </Button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
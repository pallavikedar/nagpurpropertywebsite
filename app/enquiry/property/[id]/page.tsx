"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  MapPin, 
  Home, 
  Building2, 
  DollarSign, 
  Bed, 
  Bath, 
  Square,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Heart,
  Share2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";

// ✅ Only keep dynamic = 'force-dynamic', remove generateStaticParams
export const dynamic = 'force-dynamic';

export default function PropertyEnquiryPage({ params }) {
  const router = useRouter();
  const { id: propertyId } = React.use(params);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("usertoken") : null;
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    visitDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!propertyId) return;

    const fetchPropertyById = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/property/${propertyId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch property details.");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyById();
  }, [propertyId, token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      router.push("/Login");
      return;
    }
    
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!property) {
      setError("Property not found.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/Property-enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ ...formData, propertyId: property.id }),
      });

      if (!response.ok) throw new Error("Failed to submit enquiry");

      setSuccess("Enquiry submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
        visitDate: "",
      });
      
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-red-500 mb-4">{error || "Property not found"}</p>
            <Button onClick={() => router.push("/properties")}>Browse Properties</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm flex-wrap gap-2">
              <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link href="/properties" className="text-gray-500 hover:text-primary transition-colors">
                Properties
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[300px]">
                {property.title}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-primary font-semibold">Enquire Now</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Property
            </button>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Property Information Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                  {/* Property Image Placeholder */}
                  <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-primary/40" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                      {property.type === "rent" ? "For Rent" : "For Sale"}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h1>
                    
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                      {property.type === "rent" && (
                        <span className="text-gray-500"> /month</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b">
                      <div className="text-center">
                        <Bed className="h-5 w-5 text-primary mx-auto mb-1" />
                        <p className="text-sm text-gray-600">{property.bedrooms || 2} Beds</p>
                      </div>
                      <div className="text-center">
                        <Bath className="h-5 w-5 text-primary mx-auto mb-1" />
                        <p className="text-sm text-gray-600">{property.bathrooms || 2} Baths</p>
                      </div>
                      <div className="text-center">
                        <Square className="h-5 w-5 text-primary mx-auto mb-1" />
                        <p className="text-sm text-gray-600">{property.area || 1200} sq.ft</p>
                      </div>
                    </div>
                    
                    {property.ownerName && (
                      <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Owner/Agent</p>
                          <p className="text-sm font-medium text-gray-900">{property.ownerName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Enquiry Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/70 px-6 py-4">
                    <h2 className="text-xl font-bold text-white mb-1">
                      Enquire About This Property
                    </h2>
                    <p className="text-white/80 text-sm">
                      Fill out the form and we'll get back to you shortly
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your 10-digit phone number"
                        className="focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visitDate" className="text-gray-700 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Preferred Visit Date (Optional)
                      </Label>
                      <Input
                        id="visitDate"
                        type="date"
                        value={formData.visitDate}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-primary/20"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Your Message
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your requirements..."
                        className="focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                        >
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                      
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{success}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all duration-300 py-6 text-base font-semibold rounded-xl"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Submit Enquiry
                        </>
                      )}
                    </Button>

                    {!token && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account?{" "}
                        <Link href="/Login" className="text-primary hover:underline">
                          Login here
                        </Link>
                      </p>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
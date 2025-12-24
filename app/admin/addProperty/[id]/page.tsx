"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {LanguageProvider, useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../../baseurl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Building, Home, LayoutDashboard, ListFilter, LogOut, Plus, Settings, Users,Handshake  } from "lucide-react"
export default function UpdatePropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { translations } = useLanguage();
  const t = translations;
  const amenitiesList = translations.amenities || [];

 const { id} = React.use(params);
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
  const [existingImages, setExistingImages] = useState<string[]>([]); // existing images
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      } catch (err: any) {
        setError(err.message || "Failed to load property.");
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      const res = await fetch(`${BASE_URL}/property/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update property.");
      }

      setSuccess("Property updated successfully!");
      setLoading(false);
      router.push("/admin/Properties");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };
const handleclick = () => {
    localStorage.removeItem("token")
    router.push("/Login"); 
    
 }
  return (
    <div className="min-h-screen flex flex-col">
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
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t.EditProperty}</h1>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">{t.BasicInformation}</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">{t.PropertyTitle}</Label>
                  <Input id="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="description">{t.PropertyDescription}</Label>
                  <Textarea id="description" value={formData.description} onChange={handleChange} rows={5} required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.PropertyFor}</Label>
                    <Select value={formData.propertyFor} onValueChange={(v) => handleSelectChange("propertyFor", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.Selectoption} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sale">{t.Sell}</SelectItem>
                        <SelectItem value="Rent">{t.Rent}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t.PropertyType}</Label>
                    <Select value={formData.propertyType} onValueChange={(v) => handleSelectChange("propertyType", v)}>
                      <SelectTrigger>
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

            {/* Price, area, rooms */}
            <div className="bg-white p-6 rounded-lg shadow-sm border grid md:grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input type="number" id="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div>
                <Label>Area (sqft)</Label>
                <Input type="number" id="area" value={formData.area} onChange={handleChange} required />
              </div>
              <div>
                <Label>Bedrooms</Label>
                <Input type="number" id="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input type="number" id="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
              </div>
              <div>
                <Label>Furnishing</Label>
                <Select value={formData.furnishing} onValueChange={(v) => handleSelectChange("furnishing", v)}>
                  <SelectTrigger>
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

            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">{t.Amenities}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenitiesList.map((amenity) => (
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

            {/* Location & Contact */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Label>Address</Label>
              <Textarea id="address" value={formData.address} onChange={handleChange} rows={2} required />
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <Input id="locality" value={formData.locality} onChange={handleChange} placeholder="Locality" required />
                <Input id="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                <Input id="state" value={formData.state} onChange={handleChange} placeholder="State" required />
                <Input id="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" required />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Label>Owner Name</Label>
              <Input id="ownerName" value={formData.ownerName} onChange={handleChange} required />
              <Label>Owner Phone</Label>
              <Input id="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required />
              <Label>Owner Email</Label>
              <Input id="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required />
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Label>Property Images (existing)</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {existingImages.map((img, i) => (
                  <img key={i} src={img} alt="property" className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
              <Label>Upload New Images</Label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <Button type="submit" size="lg" className="mt-4 w-full">
              {loading ? "Updating..." : t.UpdateProperty}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

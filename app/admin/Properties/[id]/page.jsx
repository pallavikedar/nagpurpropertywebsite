"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BASE_URL } from "@/app/baseurl";
import {
  ArrowLeft, Edit2, Trash2, Link2, AlertCircle, CheckCircle, XCircle, Clock,
  MapPin, User, Phone, Mail, Bed, Bath, Ruler, Building2, Calendar,
  Shield, FileText, Video, Map as MapIcon, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin-sidebar";

/* Categories where the property IS the land itself — bedrooms, bathrooms,
   furnishing, parking, and floor don't apply. Mirrors the same rule used on
   the public property-detail page and the add-property form. */
const LAND_CATEGORIES = ["Plot", "Farmland"];

function formatPrice(price) {
  if (!price && price !== 0) return null;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
}

/* A labeled value row that renders nothing at all when the value is empty —
   the admin view should only show fields that actually have data, never a
   "Not specified" placeholder for every possible field. */
function Row({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    ACCEPTED: { icon: CheckCircle, cls: "bg-green-100 text-green-700" },
    PENDING: { icon: Clock, cls: "bg-yellow-100 text-yellow-700" },
    REJECT: { icon: XCircle, cls: "bg-red-100 text-red-700" },
    REJECTED: { icon: XCircle, cls: "bg-red-100 text-red-700" },
  }[status] || { icon: Clock, cls: "bg-gray-100 text-gray-700" };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export default function AdminPropertyViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admintoken");
      if (!token) {
        alert("You need to log in as an admin to view this property.");
        router.push("/Login");
        return;
      }
      const res = await fetch(`${BASE_URL}/property/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load property.");
      const data = await res.json();
      setProperty(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("admintoken");
      const res = await fetch(`${BASE_URL}/updateStatus/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      setProperty((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("admintoken");
      const res = await fetch(`${BASE_URL}/deleteProperty/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete property.");
      router.push("/admin/Properties");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  };

  const handleCopyEditLink = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/edit-property/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Edit link copied to clipboard!");
    } catch {
      window.prompt("Copy this edit link:", link);
    }
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="p-4 md:p-8 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-72 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </AdminSidebar>
    );
  }

  if (error || !property) {
    return (
      <AdminSidebar>
        <div className="p-4 md:p-8">
          <div className="bg-white rounded-xl border p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-500 mb-4">{error || "Property not found."}</p>
            <Button onClick={() => router.push("/admin/properties")}>Back to Properties</Button>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  const category = property.propertyType || "Apartment";
  const isLand = LAND_CATEGORIES.includes(category);
  const isFarmland = category === "Farmland";
  const images = property.images?.length ? property.images : [];
  const area = property.buildUpArea || property.carpetArea || property.plotArea || property.area;
  const priceLabel = formatPrice(property.price);
  const rateLabel = formatPrice(property.ratePerSqft);

  return (
    <AdminSidebar>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/Properties")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <StatusBadge status={property.status} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Property #{property.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={property.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECT">Rejected</option>
            </select>
            <Button variant="outline" className="gap-2" onClick={() => router.push(`/admin/addProperty/${id}`)}>
              <Edit2 className="h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleCopyEditLink}>
              <Link2 className="h-4 w-4" /> Copy Edit Link
            </Button>
            <Button variant="destructive" className="gap-2" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group"
              >
                <Image src={src} alt={`${property.title} ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" sizes="300px" />
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-xl p-8 text-center text-gray-400 text-sm">No images uploaded for this property.</div>
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
            <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full z-10">
              <X className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full z-10"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <div className="relative w-[90vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <Image src={images[lightboxIndex]} alt="" fill className="object-contain" sizes="90vw" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % images.length); }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full z-10"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — specs & description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick stats */}
            <div className="bg-white rounded-xl border p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {!isLand && (
                  <>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2"><Bed className="h-6 w-6 text-blue-600" /></div>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                      <p className="text-xl font-bold text-gray-900">{property.bedrooms ?? "—"}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2"><Bath className="h-6 w-6 text-purple-600" /></div>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                      <p className="text-xl font-bold text-gray-900">{property.bathrooms ?? "—"}</p>
                    </div>
                  </>
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2"><Ruler className="h-6 w-6 text-green-600" /></div>
                  <p className="text-xs text-gray-500">{isFarmland ? "Area" : "Area"}</p>
                  <p className="text-xl font-bold text-gray-900">{area ? `${area} ${isFarmland ? "acre" : "sq.ft"}` : "—"}</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-2"><Building2 className="h-6 w-6 text-orange-600" /></div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-xl font-bold text-gray-900">{category}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Specifications — only fields that actually have a value render */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                  <Row label="Listing Purpose" value={property.propertyFor} />
                  <Row label="Price" value={priceLabel} />
                  <Row label="Rate" value={rateLabel ? `${rateLabel} / ${isFarmland ? "acre" : "sqft"}` : null} />
                  <Row label="Brokerage" value={property.brokerage != null ? `₹${property.brokerage}` : null} />
                  <Row label="Built-up Area" value={property.buildUpArea ? `${property.buildUpArea} sq.ft` : null} />
                  <Row label="Carpet Area" value={property.carpetArea ? `${property.carpetArea} sq.ft` : null} />
                  <Row label="Plot Area" value={property.plotArea ? `${property.plotArea} sq.ft` : null} />
                  <Row label="Document Basis" value={property.plotType} />
                </div>
                <div>
                  {!isLand && <Row label="Furnishing" value={property.furnishing} />}
                  {!isLand && <Row label="Car Parking" value={property.parking} />}
                  {!isLand && property.floorNumber != null && property.totalFloors != null && (
                    <Row label="Floor" value={`${property.floorNumber} of ${property.totalFloors}`} />
                  )}
                  {!isLand && <Row label="Year Built" value={property.yearBuilt} />}
                  <Row label="Facing" value={property.facing} />
                  <Row label="Locality" value={property.locality} />
                  <Row label="Pincode" value={property.pincode} />
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a, i) => (
                    <Badge key={i} variant="secondary" className="capitalize">{a}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Documents / maps / video — only shown when present */}
            {(property.sevenTwelyDoucmnetImg || property.layoutMapImg || property.landMapImg || property.videoUrl) && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Documents &amp; Media</h3>
                <div className="flex flex-wrap gap-3">
                  {property.sevenTwelyDoucmnetImg && (
                    <a href={property.sevenTwelyDoucmnetImg} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      <FileText className="h-4 w-4 text-primary" /> Document
                    </a>
                  )}
                  {property.layoutMapImg && (
                    <a href={property.layoutMapImg} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      <MapIcon className="h-4 w-4 text-primary" /> Layout Map
                    </a>
                  )}
                  {property.landMapImg && (
                    <a href={property.landMapImg} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      <MapIcon className="h-4 w-4 text-primary" /> Land Map
                    </a>
                  )}
                  {property.videoUrl && (
                    <a href={property.videoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      <Video className="h-4 w-4 text-primary" /> Walkthrough Video
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column — location & contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Location
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {[property.address, property.locality, property.city, property.state, property.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Owner / Agent
              </h3>
              <div className="space-y-2 text-sm">
                <Row label="Name" value={property.ownerName} />
                <Row label="Phone" value={property.ownerPhone} />
                <Row label="Email" value={property.ownerEmail} />
              </div>
            </div>

            {property.createdAt && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Listed
                </h3>
                <p className="text-sm text-gray-700">{new Date(property.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
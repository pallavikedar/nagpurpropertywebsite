"use client";

/**
 * Public "share link" edit page.
 *
 * Route: /edit-property/[id]  (matches the link built in the admin Properties
 * table's "Copy Link" button — update both places together if you rename it).
 *
 * Unlike the admin edit page, this route has NO auth guard: whoever holds the
 * link can load and submit this form. It talks to /open-editProperty/{id}
 * (GET to fetch, PUT to save) instead of the authenticated /property/{id} and
 * /editProperty/{id} routes. Because there's no login, `status` is not
 * editable here — approval stays an admin-only action.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Save, Upload, X, AlertCircle, CheckCircle,
  Home, Building, MapPin, User, Camera, FileText,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../baseurl";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

/* ════════════════════════════════════════════════════════════════════════
   Shared property-type config (identical to the admin Edit / Add forms).
   ════════════════════════════════════════════════════════════════════════ */
type PropertyType =
  | "Flat / Apartment" | "Duplex" | "Row House" | "Villa" | "Independent House"
  | "Plot" | "Farmland";

interface FieldFlags {
  buildUpArea: boolean; carpetArea: boolean; plotArea: boolean; acre: boolean;
  plotType: boolean; facing: boolean; dimension: boolean; dimLength: boolean;
  bedrooms: boolean; bathrooms: boolean; furnishing: boolean; amenities: boolean;
  brokerage: boolean; ratePerSqft: boolean; layoutMap: boolean; landMap: boolean;
  document: boolean; video: boolean;
}

const RESIDENTIAL_FLAGS: FieldFlags = {
  buildUpArea: true, carpetArea: true, plotArea: true, acre: false,
  plotType: false, facing: true, dimension: true, dimLength: false,
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
      facing: false, dimLength: true, bedrooms: false, bathrooms: false, furnishing: false,
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
  plotType: "", facing: "", dimension:"",
  bedrooms: "", bathrooms: "", furnishing: "", amenities: [] as string[],
  hasOtherAmenity: false, otherAmenity: "",
  brokerage: "", address: "", locality: "", city: "", state: "", pincode: "",
  ownerName: "", ownerPhone: "", ownerEmail: "",
};

export default function OpenEditPropertyPage() {
  const { translations: t } = useLanguage();
  const amenitiesList = t.amenities || [];
  const params = useParams();
  const id = params?.id;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [existingStatus, setExistingStatus] = useState(""); // read-only, kept as-is on save

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
  const [notFound, setNotFound] = useState(false);
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

  const sections = useMemo(() => [
    { id: "basic", label: "Basic Info", icon: Home },
    { id: "details", label: "Details", icon: Building },
    { id: "location", label: "Location", icon: MapPin },
    { id: "contact", label: "Contact", icon: User },
    { id: "media", label: "Media", icon: Camera },
  ], []);

  /* ─── Fetch + pre-fill (no auth — public open-edit route) ───────────────── */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/property/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error("Failed to fetch property data.");
        const data = await res.json();

        // Normalise property type
        const rawType: string = data.propertyType || "";
        const category = (LEGACY_TYPE_MAP[rawType] || rawType) as PropertyType;

        // Split dimensions string ("40x60" or "front/depth/length") back into parts
        const dimStr: string = data.dimension || "";
        const dimParts = dimStr.includes("/") ? dimStr.split("/") : dimStr.split("x");
        const [dimFront = "", dimDepth = "", dimLength = ""] = dimParts.map((p: string) => p.trim());

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
        });

        setExistingStatus(data.status || "PENDING");
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
  }, [id, amenitiesList]);

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
        return {
          ...prev, category: value as PropertyType,
          buildUpArea: "", carpetArea: "", plotArea: "", acre: "", plotType: "",
          facing: "", dimFront: "", dimDepth: "", dimLength: "",
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
      // NOTE: assumes an open (no-token) equivalent of the remove-image route
      // exists on the backend. If your backend only has the admin-guarded
      // /property/{id}/remove-image route, add a public counterpart such as
      // /open-editProperty/{id}/remove-image and point this fetch at it.
      const res = await fetch(`${BASE_URL}/open-editProperty/${id}/remove-image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
        facing: f?.facing ? formData.facing : null,
        dimension: f?.dimension ? formData.dimension : null,
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
        // Status is admin-controlled; keep whatever it currently is.
        status: existingStatus || "PENDING",
      };

      const body = new FormData();
      body.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
      images.forEach((img) => body.append("images", img));
      if (videoFile) body.append("video", videoFile);
      if (docFile) body.append("documentImage", docFile);
      if (f?.layoutMap && layoutMapFile) body.append("layoutMap", layoutMapFile);
      if (f?.landMap && landMapFile) body.append("landMap", landMapFile);

      const res = await fetch(`${BASE_URL}/open-editProperty/${id}`, {
        method: "PUT", body,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update property.");
      }

      setSuccess("Property updated successfully! Changes have been saved.");
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
  const dimensionPlaceholder = formData.category === "Farmland" ? "e.g., 300/400/500 ft (front/depth/length)" : "e.g., 30 x 40 ft";
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">This edit link is invalid or the property no longer exists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Edit Your Property
          </h1>
          <p className="text-gray-500 mt-1">Update your listing information and media below</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center justify-between max-w-3xl overflow-x-auto">
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
                        {loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Saving…</>)
                          : (<><Save className="h-4 w-4 mr-2" />Save Changes</>)}
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
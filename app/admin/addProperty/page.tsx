

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { motion, AnimatePresence } from "framer-motion";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import AdminSidebar from "@/components/admin-sidebar";
// import { useLanguage } from "@/context/language-context";
// import { BASE_URL } from "../../baseurl";
// import {
//   Loader2, CheckCircle, AlertCircle, Upload, X, Home, MapPin,
//   Camera, User, DollarSign, FileText, ArrowLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// /* ════════════════════════════════════════════════════════════════════════
//    CATEGORY CONFIG — single source of truth for which fields each type shows.
//    Add a category or flip a flag here; the whole form + validation follows.
//    ════════════════════════════════════════════════════════════════════════ */
// type PropertyType =
//   | "Flat / Apartment" | "Duplex" | "Row House" | "Villa" | "Independent House"
//   | "Plot" | "Farmland";

// interface FieldFlags {
//   buildUpArea: boolean;
//   carpetArea: boolean;
//   plotArea: boolean;      // sqft
//   acre: boolean;          // stored in `area`
//   plotType: boolean;      // RL / Registry
//   facing: boolean;        // ⚠ needs backend column
//   dimension: boolean;    // single free-text field, e.g. "30x40 ft" or "100/200/150"
//   bedrooms: boolean;
//   bathrooms: boolean;
//   furnishing: boolean;
//   amenities: boolean;
//   brokerage: boolean;
//   ratePerSqft: boolean;   // computed, read-only
//   layoutMap: boolean;
//   landMap: boolean;
//   document: boolean;      // 7/12 or sale deed
//   video: boolean;
// }

// /* All built residential types share the same field set. */
// const RESIDENTIAL_FLAGS: FieldFlags = {
//   buildUpArea: true, carpetArea: true, plotArea: true, acre: false,
//   plotType: false, facing: true, dimension: true,
//   bedrooms: true, bathrooms: true, furnishing: true, amenities: true,
//   brokerage: true, ratePerSqft: true, layoutMap: true, landMap: false,
//   document: true, video: true,
// };

// const PROPERTY_TYPE_CONFIG: Record<PropertyType, { rateBase?: string; rateUnit?: string; fields: FieldFlags }> = {
//   "Flat / Apartment":  { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
//   "Duplex":            { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
//   "Row House":         { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
//   "Villa":             { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
//   "Independent House": { rateBase: "buildUpArea", rateUnit: "sqft", fields: RESIDENTIAL_FLAGS },
//   "Plot": {
//     rateBase: "plotArea", rateUnit: "sqft",
//     fields: {
//       ...RESIDENTIAL_FLAGS, buildUpArea: false, carpetArea: false, plotArea: true,
//       plotType: true, bedrooms: false, bathrooms: false, furnishing: false, amenities: false,
//     },
//   },
//   "Farmland": {
//     rateBase: "acre", rateUnit: "acre",
//     fields: {
//       ...RESIDENTIAL_FLAGS, buildUpArea: false, carpetArea: false, plotArea: false, acre: true,
//       facing: false, bedrooms: false, bathrooms: false, furnishing: false,
//       amenities: false, brokerage: false, layoutMap: false, landMap: true,
//     },
//   },
// };

// const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
// const IMAGE_COMPRESSION_THRESHOLD = 5 * 1024 * 1024; // 5 MB
// const MAX_IMAGES = 10;
// const DOC_ACCEPT = "image/*,application/pdf";

// /* ─── Which fields live in which wizard step (for per-step gating) ─────────── */
// const SECTION_FIELDS: Record<string, string[]> = {
//   basic: ["title", "description", "propertyFor", "category"],
//   details: [
//     "buildUpArea", "carpetArea", "plotArea", "acre", "plotType", "facing",
//     "dimension", "bedrooms", "bathrooms", "furnishing",
//     "price", "brokerage",
//   ],
//   amenities: [],
//   location: ["address", "locality", "city", "state", "pincode"],
//   contact: ["ownerName", "ownerPhone", "ownerEmail"],
//   media: ["document", "images"],
// };

// /* ─── Image compression (skips PDFs / non-images) ─────────────────────────── */
// async function compressImage(file: File, quality = 0.7): Promise<File> {
//   if (!file.type.startsWith("image/")) return file;
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const MAX_DIM = 2400;
//         let { width, height } = img;
//         if (width > MAX_DIM || height > MAX_DIM) {
//           if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
//           else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
//         }
//         canvas.width = width; canvas.height = height;
//         canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
//         canvas.toBlob(
//           (blob) => {
//             if (!blob) { resolve(file); return; }
//             resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg", lastModified: Date.now() }));
//           },
//           "image/jpeg", quality
//         );
//       };
//       img.src = e.target?.result as string;
//     };
//     reader.readAsDataURL(file);
//   });
// }

// /* ─── Session-aware fetch ──────────────────────────────────────────────────── */
// async function authorizedFetch(url: string, options: RequestInit): Promise<Response> {
//   const response = await fetch(url, options);
//   if (response.status === 401 || response.status === 403) {
//     localStorage.removeItem("usertoken");
//     localStorage.removeItem("admintoken");
//     window.location.href = "/Login";
//     throw new Error("Session expired. Redirecting to login...");
//   }
//   return response;
// }

// const INITIAL_FORM = {
//   title: "", description: "", propertyFor: "", category: "" as "" | PropertyType,
//   price: "", buildUpArea: "", carpetArea: "", plotArea: "", acre: "",
//   plotType: "", facing: "", dimension: "",
//   bedrooms: "", bathrooms: "", furnishing: "", amenities: [] as string[],
//   hasOtherAmenity: false, otherAmenity: "",
//   brokerage: "", address: "", locality: "", city: "", state: "", pincode: "",
//   ownerName: "", ownerPhone: "", ownerEmail: "", status: "ACCEPTED",
// };

// export default function AddPropertyPage() {
//   const { translations: t } = useLanguage();
//   const router = useRouter();
//   const amenities = t.amenities || [];

//   const [formData, setFormData] = useState(INITIAL_FORM);
//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [docFile, setDocFile] = useState<File | null>(null);
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [layoutMapFile, setLayoutMapFile] = useState<File | null>(null);
//   const [landMapFile, setLandMapFile] = useState<File | null>(null);

//   const [compressingImages, setCompressingImages] = useState(false);
//   const [serverError, setServerError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);

//   const cfg = formData.category ? PROPERTY_TYPE_CONFIG[formData.category] : null;
//   const f = cfg?.fields;

//   /* ─── Auto-computed rate ─────────────────────────────────────────────────── */
//   const computedRate = useMemo(() => {
//     if (!cfg?.rateBase) return "";
//     const price = parseFloat(formData.price);
//     const base = parseFloat((formData as any)[cfg.rateBase]);
//     if (!price || !base || base <= 0) return "";
//     return (price / base).toFixed(2);
//   }, [cfg, formData]);

//   /* ─── Dynamic wizard steps (skip Amenities unless Residential) ───────────── */
//   const sections = useMemo(() => {
//     const s = [
//       { id: "basic", title: t.BasicInformation || "Basic Info", icon: Home },
//       { id: "details", title: t.PropertyDetails || "Details", icon: DollarSign },
//     ];
//     if (f?.amenities) s.push({ id: "amenities", title: t.Amenities || "Amenities", icon: CheckCircle });
//     s.push(
//       { id: "location", title: t.LocationInformation || "Location", icon: MapPin },
//       { id: "contact", title: t.ContactInformation || "Contact", icon: User },
//       { id: "media", title: t.propertyImages || "Media", icon: Camera },
//     );
//     return s;
//   }, [f, t]);

//   const stepId = sections[currentStep]?.id ?? "basic";

//   useEffect(() => {
//     const userToken = localStorage.getItem("usertoken");
//     const adminToken = localStorage.getItem("admintoken");
//     if (!userToken && !adminToken) window.location.href = "/Login";
//   }, []);

//   useEffect(() => () => imagePreviews.forEach((p) => URL.revokeObjectURL(p)), []);

//   /* ════════════════════════════ VALIDATION ═══════════════════════════════ */
//   const validateField = useCallback((name: string, val: string, fd = formData): string => {
//     const flags = fd.category ? PROPERTY_TYPE_CONFIG[fd.category].fields : null;
//     const req = (m: string) => (!val || !val.trim() ? m : "");
//     const posNum = (m: string) => (!val || isNaN(+val) || +val <= 0 ? m : "");

//     switch (name) {
//       case "title":       return req("Please enter property title");
//       case "description": return req("Please enter property description");
//       case "propertyFor": return req("Please select purpose (Sale / Rent)");
//       case "category":    return req("Please select property type");
//       case "price":       return posNum("Please enter a valid price");

//       case "buildUpArea": return flags?.buildUpArea ? posNum("Enter valid built-up area (sqft)") : "";
//       case "carpetArea":
//         if (!flags?.carpetArea) return "";
//         if (!val || isNaN(+val) || +val <= 0) return "Enter valid carpet area (sqft)";
//         if (fd.buildUpArea && +val > +fd.buildUpArea) return "Carpet area can't exceed built-up area";
//         return "";
//       case "plotArea":    return flags?.plotArea ? posNum("Enter valid plot area (sqft)") : "";
//       case "acre":        return flags?.acre ? posNum("Enter valid area in acres") : "";
//       case "plotType":    return flags?.plotType ? req("Select document type (RL / Registry)") : "";
//       case "facing":      return flags?.facing ? req("Please select facing") : "";
//       case "dimension":  return flags?.dimension ? req("Please enter dimension") : "";
//       case "bedrooms":    return flags?.bedrooms ? req("Select number of bedrooms") : "";
//       case "bathrooms":   return flags?.bathrooms ? req("Select number of bathrooms") : "";
//       case "furnishing":  return flags?.furnishing && !val ? "Select furnishing status" : "";
//       case "brokerage":
//         if (!flags?.brokerage || !val) return ""; // optional
//         return isNaN(+val) || +val < 0 ? "Enter a valid brokerage" : "";

//       case "address":  return req("Please enter address");
//       case "locality": return req("Please enter locality");
//       case "city":     return req("Please enter city");
//       case "state":    return req("Please enter state");
//       case "pincode":  return !val.trim() ? "Please enter pincode" : !/^\d{6}$/.test(val) ? "Pincode must be 6 digits" : "";

//       case "ownerName":  return req("Please enter owner / agent name");
//       case "ownerPhone": return !val.trim() ? "Please enter phone number" : !/^\d{10}$/.test(val) ? "Phone must be 10 digits" : "";
//       case "ownerEmail": return !val.trim() ? "Please enter email" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email" : "";
//       default: return "";
//     }
//   }, [formData]);

//   const validateFileField = useCallback((name: string): string => {
//     // if (name === "document" && f?.document && !docFile) return "Please upload the required document";
//     if (name === "images" && images.length === 0) return "Upload at least one property image";
//     return "";
//   }, [f, docFile, images]);

//   /** Validate every field in a wizard step. Returns true if the step is clean. */
//   const validateStep = useCallback((id: string): boolean => {
//     const errs: Record<string, string> = {};
//     for (const name of SECTION_FIELDS[id] || []) {
//       const msg = name === "document" || name === "images"
//         ? validateFileField(name)
//         : validateField(name, (formData as any)[name] ?? "");
//       if (msg) errs[name] = msg;
//     }
//     setFieldErrors((prev) => ({ ...prev, ...errs }));
//     return Object.keys(errs).length === 0;
//   }, [formData, validateField, validateFileField]);

//   /* ════════════════════════════ HANDLERS ═════════════════════════════════ */
//   const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     setFieldErrors((prev) => (prev[id] ? { ...prev, [id]: "" } : prev)); // live-clear
//   }, []);

//   const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     const msg = validateField(id, value);
//     setFieldErrors((prev) => ({ ...prev, [id]: msg }));
//   }, [validateField]);

//   const handleSelect = useCallback((id: string, value: string) => {
//     setFormData((prev) => {
//       const next = { ...prev, [id]: value };
//       // Reset category-specific fields when the category changes
//       if (id === "category") {
//         return { ...INITIAL_FORM, title: prev.title, description: prev.description,
//           propertyFor: prev.propertyFor, category: value as PropertyType };
//       }
//       return next;
//     });
//     setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
//     if (id === "category") setCurrentStep(0);
//   }, [validateField]);

//   const handleCheckbox = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       amenities: checked ? [...prev.amenities, name] : prev.amenities.filter((a) => a !== name),
//     }));
//   }, []);

//   const toggleOther = useCallback((checked: boolean) => {
//     setFormData((prev) => ({ ...prev, hasOtherAmenity: checked, otherAmenity: checked ? prev.otherAmenity : "" }));
//   }, []);

//   /* ─── Gallery images ─────────────────────────────────────────────────────── */
//   const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const incoming = Array.from(e.target.files);
//     if (images.length + incoming.length > MAX_IMAGES) {
//       setFieldErrors((p) => ({ ...p, images: `Maximum ${MAX_IMAGES} images allowed` }));
//       e.target.value = ""; return;
//     }
//     setFieldErrors((p) => ({ ...p, images: "" }));
//     setCompressingImages(true);
//     try {
//       const processed = await Promise.all(
//         incoming.map((file) => (file.size > IMAGE_COMPRESSION_THRESHOLD ? compressImage(file) : Promise.resolve(file)))
//       );
//       setImages((prev) => [...prev, ...processed]);
//       setImagePreviews((prev) => [...prev, ...processed.map((x) => URL.createObjectURL(x))]);
//     } catch {
//       setFieldErrors((p) => ({ ...p, images: "Failed to process one or more images" }));
//     } finally {
//       setCompressingImages(false);
//       e.target.value = "";
//     }
//   }, [images]);

//   const removeImage = useCallback((i: number) => {
//     URL.revokeObjectURL(imagePreviews[i]);
//     setImages((p) => p.filter((_, idx) => idx !== i));
//     setImagePreviews((p) => p.filter((_, idx) => idx !== i));
//   }, [imagePreviews]);

//   /* ─── Single-file uploads (document / video / maps) ──────────────────────── */
//   const handleSingleFile = useCallback(
//     (setter: (f: File | null) => void, key: string, accept: "doc" | "video") =>
//       (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] ?? null;
//         if (file) {
//           const okType = accept === "video" ? file.type.startsWith("video/") : /image\/|application\/pdf/.test(file.type);
//           if (!okType) { setFieldErrors((p) => ({ ...p, [key]: `Invalid file type` })); e.target.value = ""; return; }
//         }
//         setter(file);
//         setFieldErrors((p) => ({ ...p, [key]: "" }));
//         e.target.value = "";
//       },
//     []
//   );

//   /* ─── Navigation ─────────────────────────────────────────────────────────── */
//   const goNext = () => {
//     if (!validateStep(stepId)) return;                 // block if step invalid
//     if (currentStep < sections.length - 1) { setCurrentStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
//   };
//   const goPrev = () => { if (currentStep > 0) { setCurrentStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

//   /* ════════════════════════════ SUBMIT ═══════════════════════════════════ */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Validate every step; jump to the first that fails.
//     for (let i = 0; i < sections.length; i++) {
//       if (!validateStep(sections[i].id)) {
//         setCurrentStep(i);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }
//     }

//     setServerError(""); setSuccess(""); setLoading(true);
//     try {
//       const token = localStorage.getItem("usertoken") || localStorage.getItem("admintoken");
//       if (!token) { setServerError("Session expired. Redirecting..."); setTimeout(() => (window.location.href = "/Login"), 1500); return; }

//       // Only send fields relevant to the chosen category.
//       const propertyData = {
//         title: formData.title,
//         description: formData.description,
//         propertyFor: formData.propertyFor,
//         propertyType: formData.category, // Flat / Apartment / Duplex / Row House / Villa / Plot / Farmland
//         price: parseFloat(formData.price),
//         area: f?.acre ? parseFloat(formData.acre) : undefined,             // acres (Farmland)
//         buildUpArea: f?.buildUpArea ? parseFloat(formData.buildUpArea) : undefined,
//         carpetArea: f?.carpetArea ? parseFloat(formData.carpetArea) : undefined,
//         plotArea: f?.plotArea ? parseFloat(formData.plotArea) : undefined,
//         plotType: f?.plotType ? formData.plotType : undefined,
//         ratePerSqft: computedRate ? parseFloat(computedRate) : undefined,
//         facing: f?.facing ? formData.facing : undefined,                   // ⚠ backend column required
//         dimension: f?.dimension ? formData.dimension : undefined,       // ⚠ backend column required
//         bedrooms: f?.bedrooms ? parseInt(formData.bedrooms, 10) : undefined,
//         bathrooms: f?.bathrooms ? parseInt(formData.bathrooms, 10) : undefined,
//         furnishing: f?.furnishing ? formData.furnishing : undefined,
//         amenities: f?.amenities
//           ? [
//               ...formData.amenities,
//               ...(formData.hasOtherAmenity && formData.otherAmenity.trim()
//                 ? formData.otherAmenity.split(",").map((s) => s.trim()).filter(Boolean)
//                 : []),
//             ]
//           : [],
//         brokerage: f?.brokerage && formData.brokerage ? parseFloat(formData.brokerage) : undefined,
//         address: formData.address, locality: formData.locality, city: formData.city,
//         state: formData.state, pincode: formData.pincode,
//         ownerName: formData.ownerName, ownerPhone: formData.ownerPhone, ownerEmail: formData.ownerEmail,
//         status: formData.status,
//       };

//       const body = new FormData();
//       body.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
//       images.forEach((img) => body.append("images", img));
//       if (videoFile) body.append("video", videoFile);
//       if (docFile) body.append("documentImage", docFile);              // → sevenTwelyDoucmnetImg
//       if (f?.layoutMap && layoutMapFile) body.append("layoutMap", layoutMapFile);
//       if (f?.landMap && landMapFile) body.append("landMap", landMapFile);

//       const res = await authorizedFetch(`${BASE_URL}/addProperty`, {
//         method: "POST", headers: { Authorization: `Bearer ${token}` }, body,
//       });
//       if (!res.ok) {
//         const errData = await res.json().catch(() => null);
//         throw new Error(errData?.message || "Failed to submit property");
//       }

//       setSuccess("Property submitted successfully! Redirecting to Properties…");
//       // Reset
//       setFormData(INITIAL_FORM);
//       imagePreviews.forEach((p) => URL.revokeObjectURL(p));
//       setImages([]); setImagePreviews([]); setDocFile(null); setVideoFile(null);
//       setLayoutMapFile(null); setLandMapFile(null); setFieldErrors({}); setCurrentStep(0);
//       setTimeout(() => router.push("/admin/Properties"), 2000);
//     } catch (err: any) {
//       if (err.message !== "Session expired. Redirecting to login...")
//         setServerError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ─── Small render helpers ───────────────────────────────────────────────── */
//   const errCls = (name: string) => (fieldErrors[name] ? "border-red-400 focus:ring-red-200" : "focus:ring-2 focus:ring-primary/20");
//   const FieldError = ({ name }: { name: string }) =>
//     fieldErrors[name] ? (
//       <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
//         <AlertCircle className="w-3 h-3" /> {fieldErrors[name]}
//       </p>
//     ) : null;

//   const rateUnitLabel = cfg?.rateUnit === "acre" ? "₹ / acre" : "₹ / sqft";
//   const dimensionPlaceholder = formData.category === "Farmland" ? "e.g., 300/400/500 ft (front/depth/length)" : "e.g., 30 x 40 ft";

//   return (
//     <AdminSidebar>
//       <div className="p-4 md:p-8">
//         {/* Header — matches the Manage Properties page */}
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//               Add New Property
//             </h1>
//             <p className="text-gray-500 mt-1">Create a new property listing</p>
//           </div>
//           <Button variant="outline" onClick={() => router.push("/admin/Properties")} className="gap-2">
//             <ArrowLeft className="h-4 w-4" /> Back to Properties
//           </Button>
//         </div>

//         {/* Step indicator */}
//         <div className="mb-8 flex items-center justify-between max-w-3xl overflow-x-auto">
//           {sections.map((s, i) => {
//             const Icon = s.icon;
//             const active = i === currentStep, done = i < currentStep;
//             return (
//               <div key={s.id} className="flex items-center">
//                 <div className="flex flex-col items-center">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                     active ? "bg-primary text-white shadow-lg scale-105" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
//                     {done ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
//                   </div>
//                   <span className={`text-xs mt-2 ${active ? "text-primary font-semibold" : "text-gray-500"}`}>{s.title}</span>
//                 </div>
//                 {i < sections.length - 1 && <div className="w-10 h-px bg-gray-300 mx-2" />}
//               </div>
//             );
//           })}
//         </div>

//         <div className="max-w-3xl">
//           {/* Server / success banners */}
//           <AnimatePresence>
//             {serverError && (
//               <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
//                 <AlertCircle className="w-5 h-5 flex-shrink-0" /><p>{serverError}</p>
//               </motion.div>
//             )}
//             {success && (
//               <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
//                 className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
//                 <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//                 <p className="font-semibold">{success}</p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <form onSubmit={handleSubmit}>
//             <AnimatePresence mode="wait">
//               <motion.div key={stepId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2 }} className="bg-white rounded-xl shadow-sm border overflow-hidden">

//                 {/* ═════════ BASIC ═════════ */}
//                 {stepId === "basic" && (
//                   <>
//                     <SectionHead icon={Home} title="Basic Information" />
//                     <div className="p-6 space-y-4">
//                       <div>
//                         <Label htmlFor="title" className="font-medium mb-2 block">Property Title <span className="text-red-500">*</span></Label>
//                         <Input id="title" placeholder="e.g., 3BHK Duplex near Wardha Road" value={formData.title}
//                           onChange={handleChange} onBlur={handleBlur} className={errCls("title")} />
//                         <FieldError name="title" />
//                       </div>
//                       <div>
//                         <Label htmlFor="description" className="font-medium mb-2 block">Description <span className="text-red-500">*</span></Label>
//                         <Textarea id="description" rows={5} placeholder="Describe the property, nearby landmarks, etc."
//                           value={formData.description} onChange={handleChange} onBlur={handleBlur} className={`resize-none ${errCls("description")}`} />
//                         <FieldError name="description" />
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <Label className="font-medium mb-2 block">Purpose <span className="text-red-500">*</span></Label>
//                           <Select value={formData.propertyFor} onValueChange={(v) => handleSelect("propertyFor", v)}>
//                             <SelectTrigger className={errCls("propertyFor")}><SelectValue placeholder="Sell / Rent" /></SelectTrigger>
//                             <SelectContent><SelectItem value="Sale">Sell</SelectItem><SelectItem value="Rent">Rent</SelectItem></SelectContent>
//                           </Select>
//                           <FieldError name="propertyFor" />
//                         </div>
//                         <div>
//                           <Label className="font-medium mb-2 block">Property Type <span className="text-red-500">*</span></Label>
//                           <Select value={formData.category} onValueChange={(v) => handleSelect("category", v)}>
//                             <SelectTrigger className={errCls("category")}><SelectValue placeholder="Select type" /></SelectTrigger>
//                             <SelectContent>
//                               {(Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[]).map((c) => (
//                                 <SelectItem key={c} value={c}>{c}</SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FieldError name="category" />
//                         </div>
//                       </div>
//                       {formData.category && (
//                         <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-gray-600">
//                           📋 Showing fields relevant to <strong>{formData.category}</strong> only.
//                         </div>
//                       )}
//                       <div className="flex justify-end pt-4">
//                         <Button type="button" onClick={goNext}>Next: Details</Button>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* ═════════ DETAILS ═════════ */}
//                 {stepId === "details" && (
//                   <>
//                     <SectionHead icon={DollarSign} title="Property Details" />
//                     <div className="p-6 space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {f?.buildUpArea && (
//                           <div><Label htmlFor="buildUpArea" className="font-medium mb-2 block">Built-up Area (sqft) <span className="text-red-500">*</span></Label>
//                             <Input id="buildUpArea" type="number" value={formData.buildUpArea} onChange={handleChange} onBlur={handleBlur} className={errCls("buildUpArea")} /><FieldError name="buildUpArea" /></div>
//                         )}
//                         {f?.carpetArea && (
//                           <div><Label htmlFor="carpetArea" className="font-medium mb-2 block">Carpet Area (sqft) <span className="text-red-500">*</span></Label>
//                             <Input id="carpetArea" type="number" value={formData.carpetArea} onChange={handleChange} onBlur={handleBlur} className={errCls("carpetArea")} /><FieldError name="carpetArea" /></div>
//                         )}
//                         {f?.plotArea && (
//                           <div><Label htmlFor="plotArea" className="font-medium mb-2 block">Plot Area (sqft) <span className="text-red-500">*</span></Label>
//                             <Input id="plotArea" type="number" value={formData.plotArea} onChange={handleChange} onBlur={handleBlur} className={errCls("plotArea")} /><FieldError name="plotArea" /></div>
//                         )}
//                         {f?.acre && (
//                           <div><Label htmlFor="acre" className="font-medium mb-2 block">Area (acres) <span className="text-red-500">*</span></Label>
//                             <Input id="acre" type="number" step="0.01" value={formData.acre} onChange={handleChange} onBlur={handleBlur} className={errCls("acre")} /><FieldError name="acre" /></div>
//                         )}
//                         {f?.plotType && (
//                           <div><Label className="font-medium mb-2 block">Document Basis <span className="text-red-500">*</span></Label>
//                             <Select value={formData.plotType} onValueChange={(v) => handleSelect("plotType", v)}>
//                               <SelectTrigger className={errCls("plotType")}><SelectValue placeholder="RL / Registry" /></SelectTrigger>
//                               <SelectContent><SelectItem value="RL">RL (Ready Layout)</SelectItem><SelectItem value="Registry">Registry</SelectItem></SelectContent>
//                             </Select><FieldError name="plotType" /></div>
//                         )}
//                         {f?.facing && (
//                           <div><Label className="font-medium mb-2 block">Facing <span className="text-red-500">*</span></Label>
//                             <Select value={formData.facing} onValueChange={(v) => handleSelect("facing", v)}>
//                               <SelectTrigger className={errCls("facing")}><SelectValue placeholder="Select facing" /></SelectTrigger>
//                               <SelectContent>{FACING_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
//                             </Select><FieldError name="facing" /></div>
//                         )}
//                         {/* Single free-text dimension field — was previously three separate
//                             Front / Depth / Length number inputs. One field is simpler to fill
//                             in and covers both the "30x40" residential case and the farmland
//                             front/depth/length case without forcing a rigid input shape. */}
//                         {f?.dimension && (
//                           <div className="md:col-span-2">
//                             <Label htmlFor="dimension" className="font-medium mb-2 block">dimension <span className="text-red-500">*</span></Label>
//                             <Input
//                               id="dimension"
//                               placeholder={dimensionPlaceholder}
//                               value={formData.dimension}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               className={errCls("dimension")}
//                             />
//                             <FieldError name="dimension" />
//                           </div>
//                         )}
//                         {f?.bedrooms && (
//                           <div><Label className="font-medium mb-2 block">Bedrooms (BHK) <span className="text-red-500">*</span></Label>
//                             <Select value={formData.bedrooms} onValueChange={(v) => handleSelect("bedrooms", v)}>
//                               <SelectTrigger className={errCls("bedrooms")}><SelectValue placeholder="Select BHK" /></SelectTrigger>
//                               <SelectContent>{[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n === 6 ? "6+ BHK" : `${n} BHK`}</SelectItem>)}</SelectContent>
//                             </Select><FieldError name="bedrooms" /></div>
//                         )}
//                         {f?.bathrooms && (
//                           <div><Label className="font-medium mb-2 block">Bathrooms <span className="text-red-500">*</span></Label>
//                             <Select value={formData.bathrooms} onValueChange={(v) => handleSelect("bathrooms", v)}>
//                               <SelectTrigger className={errCls("bathrooms")}><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
//                               <SelectContent>{[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n === 5 ? "5+" : n}</SelectItem>)}</SelectContent>
//                             </Select><FieldError name="bathrooms" /></div>
//                         )}
//                         {f?.furnishing && (
//                           <div><Label className="font-medium mb-2 block">Furnishing</Label>
//                             <Select value={formData.furnishing} onValueChange={(v) => handleSelect("furnishing", v)}>
//                               <SelectTrigger className={errCls("furnishing")}><SelectValue placeholder="Select furnishing" /></SelectTrigger>
//                               <SelectContent><SelectItem value="Fully Furnished">Fully Furnished</SelectItem><SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem><SelectItem value="Unfurnished">Unfurnished</SelectItem></SelectContent>
//                             </Select><FieldError name="furnishing" /></div>
//                         )}
//                         <div><Label htmlFor="price" className="font-medium mb-2 block">Price (₹) <span className="text-red-500">*</span></Label>
//                           <Input id="price" type="number" value={formData.price} onChange={handleChange} onBlur={handleBlur} className={errCls("price")} /><FieldError name="price" /></div>
//                         {f?.ratePerSqft && (
//                           <div><Label className="font-medium mb-2 block">Rate ({rateUnitLabel}) — auto</Label>
//                             <Input value={computedRate ? `₹ ${computedRate}` : "—"} readOnly disabled className="bg-gray-50" />
//                             <p className="mt-1 text-xs text-gray-400">Calculated from price ÷ area.</p></div>
//                         )}
//                         {f?.brokerage && (
//                           <div><Label htmlFor="brokerage" className="font-medium mb-2 block">Brokerage (₹ or %)</Label>
//                             <Input id="brokerage" type="number" value={formData.brokerage} onChange={handleChange} onBlur={handleBlur} className={errCls("brokerage")} /><FieldError name="brokerage" /></div>
//                         )}
//                       </div>
//                       <div className="flex justify-between pt-4">
//                         <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
//                         <Button type="button" onClick={goNext}>{f?.amenities ? "Next: Amenities" : "Next: Location"}</Button>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* ═════════ AMENITIES ═════════ */}
//                 {stepId === "amenities" && (
//                   <>
//                     <SectionHead icon={CheckCircle} title="Amenities" />
//                     <div className="p-6 space-y-4">
//                       <p className="text-sm text-gray-500">Gallery, lift, security, power backup, etc.</p>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                         {amenities.map((a: any) => (
//                           <label key={a.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
//                             <input type="checkbox" name={a.key} checked={formData.amenities.includes(a.key)} onChange={handleCheckbox}
//                               className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
//                             <span className="text-gray-700">{a.label}</span>
//                           </label>
//                         ))}
//                         <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
//                           <input type="checkbox" checked={formData.hasOtherAmenity} onChange={(e) => toggleOther(e.target.checked)}
//                             className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
//                           <span className="text-gray-700">{t.Other || "Other"}</span>
//                         </label>
//                       </div>
//                       {formData.hasOtherAmenity && (
//                         <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
//                           <Label htmlFor="otherAmenity" className="font-medium mb-2 block">Other amenity</Label>
//                           <Input id="otherAmenity" placeholder="e.g., Clubhouse, Solar panels, Rainwater harvesting"
//                             value={formData.otherAmenity} onChange={handleChange} className="focus:ring-2 focus:ring-primary/20" />
//                           <p className="mt-1 text-xs text-gray-400">Separate multiple with commas.</p>
//                         </motion.div>
//                       )}
//                       <div className="flex justify-between pt-4">
//                         <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
//                         <Button type="button" onClick={goNext}>Next: Location</Button>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* ═════════ LOCATION ═════════ */}
//                 {stepId === "location" && (
//                   <>
//                     <SectionHead icon={MapPin} title="Location Information" />
//                     <div className="p-6 space-y-4">
//                       <div><Label htmlFor="address" className="font-medium mb-2 block">Address <span className="text-red-500">*</span></Label>
//                         <Textarea id="address" rows={2} value={formData.address} onChange={handleChange} onBlur={handleBlur} className={errCls("address")} /><FieldError name="address" /></div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div><Label htmlFor="locality" className="font-medium mb-2 block">Locality / Area <span className="text-red-500">*</span></Label>
//                           <Input id="locality" value={formData.locality} onChange={handleChange} onBlur={handleBlur} className={errCls("locality")} /><FieldError name="locality" /></div>
//                         <div><Label htmlFor="city" className="font-medium mb-2 block">City <span className="text-red-500">*</span></Label>
//                           <Input id="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} className={errCls("city")} /><FieldError name="city" /></div>
//                         <div><Label htmlFor="state" className="font-medium mb-2 block">State <span className="text-red-500">*</span></Label>
//                           <Input id="state" value={formData.state} onChange={handleChange} onBlur={handleBlur} className={errCls("state")} /><FieldError name="state" /></div>
//                         <div><Label htmlFor="pincode" className="font-medium mb-2 block">Pincode <span className="text-red-500">*</span></Label>
//                           <Input id="pincode" value={formData.pincode} onChange={handleChange} onBlur={handleBlur} className={errCls("pincode")} maxLength={6} /><FieldError name="pincode" /></div>
//                       </div>
//                       <div className="flex justify-between pt-4">
//                         <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
//                         <Button type="button" onClick={goNext}>Next: Contact</Button>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* ═════════ CONTACT ═════════ */}
//                 {stepId === "contact" && (
//                   <>
//                     <SectionHead icon={User} title="Contact Information" />
//                     <div className="p-6 space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div><Label htmlFor="ownerName" className="font-medium mb-2 block">Owner / Agent Name <span className="text-red-500">*</span></Label>
//                           <Input id="ownerName" value={formData.ownerName} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerName")} /><FieldError name="ownerName" /></div>
//                         <div><Label htmlFor="ownerPhone" className="font-medium mb-2 block">Phone <span className="text-red-500">*</span></Label>
//                           <Input id="ownerPhone" value={formData.ownerPhone} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerPhone")} maxLength={10} /><FieldError name="ownerPhone" /></div>
//                         <div className="md:col-span-2"><Label htmlFor="ownerEmail" className="font-medium mb-2 block">Email <span className="text-red-500">*</span></Label>
//                           <Input id="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerEmail")} /><FieldError name="ownerEmail" /></div>
//                       </div>
//                       <div className="flex justify-between pt-4">
//                         <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
//                         <Button type="button" onClick={goNext}>Next: Media</Button>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* ═════════ MEDIA ═════════ */}
//                 {stepId === "media" && (
//                   <>
//                     <SectionHead icon={Camera} title="Media & Documents" />
//                     <div className="p-6 space-y-6">
//                       <div>
//                         <Label className="font-medium mb-2 block">Property Photos <span className="text-red-500">*</span></Label>
//                         <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${fieldErrors.images ? "border-red-400" : "border-gray-300 hover:border-primary"}`}>
//                           <input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" disabled={compressingImages} />
//                           <label htmlFor="images" className="cursor-pointer block">
//                             {compressingImages ? (
//                               <><Loader2 className="w-10 h-10 mx-auto text-primary mb-2 animate-spin" /><p className="text-gray-600">Compressing…</p></>
//                             ) : (
//                               <><Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
//                                 <p className="text-gray-600">Click to upload (max {MAX_IMAGES})</p>
//                                 <p className="text-xs text-blue-500 mt-1">Images over 5 MB are auto-compressed</p></>
//                             )}
//                           </label>
//                         </div>
//                         <FieldError name="images" />
//                         {imagePreviews.length > 0 && (
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                             {imagePreviews.map((p, i) => (
//                               <div key={i} className="relative group">
//                                 <img src={p} alt={`Preview ${i + 1}`} className="w-full h-28 object-cover rounded-lg" />
//                                 <button type="button" onClick={() => removeImage(i)}
//                                   className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <X className="w-4 h-4" />
//                                 </button>
//                                 <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
//                                   {(images[i]?.size / 1024 / 1024).toFixed(1)} MB
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>

//                       <SingleUpload label={`Document ${formData.category === "Farmland" ? "(7/12)" : ""} (optional)`}
//                             file={docFile} error={fieldErrors.document} accept={DOC_ACCEPT}
//                             onChange={handleSingleFile(setDocFile, "document", "doc")} onClear={() => setDocFile(null)} />

//                       {f?.layoutMap && (
//                         <SingleUpload label="Layout Map" file={layoutMapFile} error={fieldErrors.layoutMap} accept={DOC_ACCEPT}
//                           onChange={handleSingleFile(setLayoutMapFile, "layoutMap", "doc")} onClear={() => setLayoutMapFile(null)} />
//                       )}
//                       {f?.landMap && (
//                         <SingleUpload label="Land Map" file={landMapFile} error={fieldErrors.landMap} accept={DOC_ACCEPT}
//                           onChange={handleSingleFile(setLandMapFile, "landMap", "doc")} onClear={() => setLandMapFile(null)} />
//                       )}
//                       {f?.video && (
//                         <SingleUpload label="Walkthrough Video (optional)" file={videoFile} error={fieldErrors.video} accept="video/*"
//                           onChange={handleSingleFile(setVideoFile, "video", "video")} onClear={() => setVideoFile(null)} />
//                       )}

//                       <div className="flex justify-between pt-4">
//                         <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
//                         <Button type="submit" disabled={loading || compressingImages} className="bg-gradient-to-r from-primary to-primary/70">
//                           {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>) : "Submit Property"}
//                         </Button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </form>
//         </div>
//       </div>
//     </AdminSidebar>
//   );
// }

// /* ─── Small presentational helpers ─────────────────────────────────────────── */
// function SectionHead({ icon: Icon, title }: { icon: any; title: string }) {
//   return (
//     <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
//       <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-gray-900">{title}</h2></div>
//     </div>
//   );
// }

// function SingleUpload({ label, required, file, error, accept, onChange, onClear }: {
//   label: string; required?: boolean; file: File | null; error?: string; accept: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void;
// }) {
//   const id = `su-${label.replace(/\W+/g, "")}`;
//   return (
//     <div>
//       <Label className="font-medium mb-2 block">{label}{required && <span className="text-red-500"> *</span>}</Label>
//       {file ? (
//         <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
//           <span className="flex items-center gap-2 text-sm text-gray-700 truncate">
//             <FileText className="w-4 h-4 text-primary shrink-0" />{file.name}
//             <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
//           </span>
//           <button type="button" onClick={onClear} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
//         </div>
//       ) : (
//         <div className={`border-2 border-dashed rounded-lg p-4 text-center ${error ? "border-red-400" : "border-gray-300 hover:border-primary"}`}>
//           <input id={id} type="file" accept={accept} onChange={onChange} className="hidden" />
//           <label htmlFor={id} className="cursor-pointer flex items-center justify-center gap-2 text-gray-500 text-sm">
//             <Upload className="w-4 h-4" /> Click to upload
//           </label>
//         </div>
//       )}
//       {error && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="w-3 h-3" />{error}</p>}
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSidebar from "@/components/admin-sidebar";
import { useLanguage } from "@/context/language-context";
import { BASE_URL } from "../../baseurl";
import {
  Loader2, CheckCircle, AlertCircle, Upload, X, Home, MapPin,
  Camera, User, DollarSign, FileText, ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ════════════════════════════════════════════════════════════════════════
   CATEGORY CONFIG — single source of truth for which fields each type shows.
   Add a category or flip a flag here; the whole form + validation follows.
   ════════════════════════════════════════════════════════════════════════ */
type PropertyType =
  | "Flat / Apartment" | "Duplex" | "Row House" | "Villa" | "Independent House"
  | "Plot" | "Farmland";

interface FieldFlags {
  buildUpArea: boolean;
  carpetArea: boolean;
  plotArea: boolean;      // sqft
  acre: boolean;          // stored in `area`
  plotType: boolean;      // RL / Registry
  facing: boolean;
  dimension: boolean;     // single free-text field, e.g. "30x40 ft" or "100/200/150"
  bedrooms: boolean;
  bathrooms: boolean;
  furnishing: boolean;
  amenities: boolean;
  brokerage: boolean;
  ratePerSqft: boolean;   // computed, read-only
  layoutMap: boolean;
  landMap: boolean;
  document: boolean;      // 7/12 or sale deed
  video: boolean;
}

/* All built residential types share the same field set. */
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
    fields: {
      ...RESIDENTIAL_FLAGS, buildUpArea: false, carpetArea: false, plotArea: true,
      plotType: true, bedrooms: false, bathrooms: false, furnishing: false, amenities: false,
    },
  },
  "Farmland": {
    rateBase: "acre", rateUnit: "acre",
    fields: {
      ...RESIDENTIAL_FLAGS, buildUpArea: false, carpetArea: false, plotArea: false, acre: true,
      facing: false, bedrooms: false, bathrooms: false, furnishing: false,
      amenities: false, brokerage: false, layoutMap: false, landMap: true,
    },
  },
};

const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const IMAGE_COMPRESSION_THRESHOLD = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES = 10;
const DOC_ACCEPT = "image/*,application/pdf";

/* Set to true only if the backend entity uses primitive double/int rather than
   the boxed Double/Integer — primitives reject a JSON null on deserialization. */
const BACKEND_REJECTS_NULL_NUMBERS = false;

/* ─── Which fields live in which wizard step (for per-step gating) ─────────── */
const SECTION_FIELDS: Record<string, string[]> = {
  basic: ["title", "description", "propertyFor", "category"],
  details: [
    "buildUpArea", "carpetArea", "plotArea", "acre", "plotType", "facing",
    "dimension", "bedrooms", "bathrooms", "furnishing",
    "price", "brokerage",
  ],
  amenities: [],
  location: ["address", "locality", "city", "state", "pincode"],
  contact: ["ownerName", "ownerPhone", "ownerEmail"],
  media: ["document", "images"],
};

/* ─── Image compression (skips PDFs / non-images) ─────────────────────────── */
async function compressImage(file: File, quality = 0.7): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 2400;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
          else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
        }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg", lastModified: Date.now() }));
          },
          "image/jpeg", quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/* ─── Pull a usable message out of any error body (JSON or HTML) ───────────── */
function extractMessage(raw: string, fallback: string): string {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.message || parsed?.error || fallback;
  } catch {
    return raw.slice(0, 300);
  }
}

/* ─── Session-aware fetch ───────────────────────────────────────────────────
   Spring forwards unhandled controller exceptions to /error. Because /error is
   not in the backend's PUBLIC_URLS, that dispatch is rejected by the security
   chain and JwtAuthenticationEntryPoint answers 401 — so a genuine 500 (bad
   column, failed Firebase upload) reaches the browser looking exactly like an
   expired session. Blindly logging out on 401/403 was hiding every real error.

   Two guards now:
     - the body must actually look like a token problem, and
     - callers can pass autoLogout=false to opt out entirely.
   ─────────────────────────────────────────────────────────────────────────── */
async function authorizedFetch(
  url: string,
  options: RequestInit,
  autoLogout = true
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    const raw = await response.clone().text().catch(() => "");
    console.error(`${response.status} from`, url, raw);

    const looksLikeExpiry = /jwt|token|expired|unauthorized|bad credentials/i.test(raw);

    if (autoLogout && looksLikeExpiry) {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("admintoken");
      window.location.href = "/Login";
      throw new Error("Session expired. Redirecting to login...");
    }

    throw new Error(
      extractMessage(raw, `Server rejected the request (${response.status}). Check the backend log.`)
    );
  }

  return response;
}

const INITIAL_FORM = {
  title: "", description: "", propertyFor: "", category: "" as "" | PropertyType,
  price: "", buildUpArea: "", carpetArea: "", plotArea: "", acre: "",
  plotType: "", facing: "", dimension: "",
  bedrooms: "", bathrooms: "", furnishing: "", amenities: [] as string[],
  hasOtherAmenity: false, otherAmenity: "",
  brokerage: "", address: "", locality: "", city: "", state: "", pincode: "",
  ownerName: "", ownerPhone: "", ownerEmail: "", status: "ACCEPTED",
};

export default function AddPropertyPage() {
  const { translations: t } = useLanguage();
  const router = useRouter();
  const amenities = t.amenities || [];

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [layoutMapFile, setLayoutMapFile] = useState<File | null>(null);
  const [landMapFile, setLandMapFile] = useState<File | null>(null);

  const [compressingImages, setCompressingImages] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const cfg = formData.category ? PROPERTY_TYPE_CONFIG[formData.category] : null;
  const f = cfg?.fields;

  /* ─── Auto-computed rate ─────────────────────────────────────────────────── */
  const computedRate = useMemo(() => {
    if (!cfg?.rateBase) return "";
    const price = parseFloat(formData.price);
    const base = parseFloat((formData as any)[cfg.rateBase]);
    if (!price || !base || base <= 0) return "";
    return (price / base).toFixed(2);
  }, [cfg, formData]);

  /* ─── Dynamic wizard steps (skip Amenities unless Residential) ───────────── */
  const sections = useMemo(() => {
    const s = [
      { id: "basic", title: t.BasicInformation || "Basic Info", icon: Home },
      { id: "details", title: t.PropertyDetails || "Details", icon: DollarSign },
    ];
    if (f?.amenities) s.push({ id: "amenities", title: t.Amenities || "Amenities", icon: CheckCircle });
    s.push(
      { id: "location", title: t.LocationInformation || "Location", icon: MapPin },
      { id: "contact", title: t.ContactInformation || "Contact", icon: User },
      { id: "media", title: t.propertyImages || "Media", icon: Camera },
    );
    return s;
  }, [f, t]);

  const stepId = sections[currentStep]?.id ?? "basic";

  useEffect(() => {
    const userToken = localStorage.getItem("usertoken");
    const adminToken = localStorage.getItem("admintoken");
    if (!userToken && !adminToken) window.location.href = "/Login";
  }, []);

  /* FIX: the old unmount cleanup closed over the initial empty array, so no
     object URL was ever revoked. Mirror the list into a ref and revoke that. */
  const previewsRef = useRef<string[]>([]);
  useEffect(() => { previewsRef.current = imagePreviews; }, [imagePreviews]);
  useEffect(() => () => { previewsRef.current.forEach((p) => URL.revokeObjectURL(p)); }, []);

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
      case "plotArea":    return flags?.plotArea ? posNum("Enter valid plot area (sqft)") : "";
      case "acre":        return flags?.acre ? posNum("Enter valid area in acres") : "";
      case "plotType":    return flags?.plotType ? req("Select document type (RL / Registry)") : "";
      case "facing":      return flags?.facing ? req("Please select facing") : "";
      case "dimension":   return flags?.dimension ? req("Please enter dimension") : "";
      case "bedrooms":    return flags?.bedrooms ? req("Select number of bedrooms") : "";
      case "bathrooms":   return flags?.bathrooms ? req("Select number of bathrooms") : "";
      case "furnishing":  return flags?.furnishing && !val ? "Select furnishing status" : "";
      case "brokerage":
        if (!flags?.brokerage || !val) return ""; // optional
        return isNaN(+val) || +val < 0 ? "Enter a valid brokerage" : "";

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
    if (name === "images" && images.length === 0) return "Upload at least one property image";
    return "";
  }, [images]);

  /** Validate every field in a wizard step. Returns true if the step is clean. */
  const validateStep = useCallback((id: string): boolean => {
    const errs: Record<string, string> = {};
    for (const name of SECTION_FIELDS[id] || []) {
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
    setFieldErrors((prev) => (prev[id] ? { ...prev, [id]: "" } : prev)); // live-clear
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const msg = validateField(id, value);
    setFieldErrors((prev) => ({ ...prev, [id]: msg }));
  }, [validateField]);

  const handleSelect = useCallback((id: string, value: string) => {
    if (id === "category") {
      setFormData((prev) => ({
        ...INITIAL_FORM,
        title: prev.title, description: prev.description,
        propertyFor: prev.propertyFor, category: value as PropertyType,
      }));
      setFieldErrors({});           // drop errors belonging to the old category
      setServerError("");
      setCurrentStep(0);
      return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  /* ─── Gallery images ─────────────────────────────────────────────────────── */
  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    if (images.length + incoming.length > MAX_IMAGES) {
      setFieldErrors((p) => ({ ...p, images: `Maximum ${MAX_IMAGES} images allowed` }));
      e.target.value = ""; return;
    }
    setFieldErrors((p) => ({ ...p, images: "" }));
    setCompressingImages(true);
    try {
      const processed = await Promise.all(
        incoming.map((file) => (file.size > IMAGE_COMPRESSION_THRESHOLD ? compressImage(file) : Promise.resolve(file)))
      );
      setImages((prev) => [...prev, ...processed]);
      setImagePreviews((prev) => [...prev, ...processed.map((x) => URL.createObjectURL(x))]);
    } catch {
      setFieldErrors((p) => ({ ...p, images: "Failed to process one or more images" }));
    } finally {
      setCompressingImages(false);
      e.target.value = "";
    }
  }, [images]);

  const removeImage = useCallback((i: number) => {
    URL.revokeObjectURL(imagePreviews[i]);
    setImages((p) => p.filter((_, idx) => idx !== i));
    setImagePreviews((p) => p.filter((_, idx) => idx !== i));
  }, [imagePreviews]);

  /* ─── Single-file uploads (document / video / maps) ──────────────────────── */
  const handleSingleFile = useCallback(
    (setter: (f: File | null) => void, key: string, accept: "doc" | "video") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
          const okType = accept === "video" ? file.type.startsWith("video/") : /image\/|application\/pdf/.test(file.type);
          if (!okType) { setFieldErrors((p) => ({ ...p, [key]: `Invalid file type` })); e.target.value = ""; return; }
        }
        setter(file);
        setFieldErrors((p) => ({ ...p, [key]: "" }));
        e.target.value = "";
      },
    []
  );

  /* ─── Navigation ─────────────────────────────────────────────────────────── */
  const goNext = () => {
    if (!validateStep(stepId)) return;                 // block if step invalid
    if (currentStep < sections.length - 1) { setCurrentStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const goPrev = () => { if (currentStep > 0) { setCurrentStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

  /* ════════════════════════════ SUBMIT ═══════════════════════════════════ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate every step; jump to the first that fails.
    for (let i = 0; i < sections.length; i++) {
      if (!validateStep(sections[i].id)) {
        setCurrentStep(i);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setServerError(""); setSuccess(""); setLoading(true);
    try {
      const token = localStorage.getItem("usertoken") || localStorage.getItem("admintoken");
      if (!token) { setServerError("Session expired. Redirecting..."); setTimeout(() => (window.location.href = "/Login"), 1500); return; }

      /* FIX: JSON.stringify DELETES keys whose value is undefined, so for Plot
         and Farmland the backend never received buildUpArea / carpetArea /
         bedrooms / bathrooms / area at all — any server code touching those
         boxed fields then threw. Send explicit null (or 0) so every key is
         always present in the payload. */
      const numOrNull = BACKEND_REJECTS_NULL_NUMBERS ? 0 : null;
      const num = (on: boolean | undefined, v: string) => {
        if (!on) return numOrNull;
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : numOrNull;
      };
      const int = (on: boolean | undefined, v: string) => {
        if (!on) return numOrNull;
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : numOrNull;
      };
      const str = (on: boolean | undefined, v: string) => (on && v ? v : null);

      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        propertyFor: formData.propertyFor,
        propertyType: formData.category,
        price: num(true, formData.price),
        area: num(f?.acre, formData.acre),                 // acres (Farmland)
        buildUpArea: num(f?.buildUpArea, formData.buildUpArea),
        carpetArea: num(f?.carpetArea, formData.carpetArea),
        plotArea: num(f?.plotArea, formData.plotArea),
        plotType: str(f?.plotType, formData.plotType),
        ratePerSqft: computedRate ? parseFloat(computedRate) : numOrNull,
        facing: str(f?.facing, formData.facing),
        dimension: str(f?.dimension, formData.dimension),
        bedrooms: int(f?.bedrooms, formData.bedrooms),
        bathrooms: int(f?.bathrooms, formData.bathrooms),
        furnishing: str(f?.furnishing, formData.furnishing),
        amenities: f?.amenities
          ? [
              ...formData.amenities,
              ...(formData.hasOtherAmenity && formData.otherAmenity.trim()
                ? formData.otherAmenity.split(",").map((s) => s.trim()).filter(Boolean)
                : []),
            ]
          : [],
        brokerage: num(f?.brokerage, formData.brokerage),
        address: formData.address.trim(),
        locality: formData.locality.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        ownerName: formData.ownerName.trim(),
        ownerPhone: formData.ownerPhone.trim(),
        ownerEmail: formData.ownerEmail.trim(),
        status: formData.status,
      };

      const body = new FormData();
      body.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
      images.forEach((img) => body.append("images", img));
      if (videoFile) body.append("video", videoFile);
      if (docFile) body.append("documentImage", docFile);              // → sevenTwelyDoucmnetImg
      if (f?.layoutMap && layoutMapFile) body.append("layoutMap", layoutMapFile);
      if (f?.landMap && landMapFile) body.append("landMap", landMapFile);

      /* autoLogout=false: this call must never bounce to /Login. If the server
         answers 401/403 here, show the message so the real cause is visible. */
      const res = await authorizedFetch(
        `${BASE_URL}/addProperty`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body },
        false
      );

      /* FIX: res.json() returns null when the server replies with an HTML error
         page, which threw away the real message. Read as text, then try JSON. */
      if (!res.ok) {
        const raw = await res.text().catch(() => "");
        console.error("addProperty failed", res.status, raw);
        throw new Error(extractMessage(raw, `Failed to submit property (${res.status})`));
      }

      setSuccess("Property submitted successfully! Redirecting to Properties…");
      // Reset
      setFormData(INITIAL_FORM);
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
      setImages([]); setImagePreviews([]); setDocFile(null); setVideoFile(null);
      setLayoutMapFile(null); setLandMapFile(null); setFieldErrors({}); setCurrentStep(0);
      setTimeout(() => router.push("/admin/Properties"), 2000);
    } catch (err: any) {
      if (err.message !== "Session expired. Redirecting to login...")
        setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Small render helpers ───────────────────────────────────────────────── */
  const errCls = (name: string) => (fieldErrors[name] ? "border-red-400 focus:ring-red-200" : "focus:ring-2 focus:ring-primary/20");
  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
        <AlertCircle className="w-3 h-3" /> {fieldErrors[name]}
      </p>
    ) : null;

  const rateUnitLabel = cfg?.rateUnit === "acre" ? "₹ / acre" : "₹ / sqft";
  const dimensionPlaceholder = formData.category === "Farmland" ? "e.g., 300/400/500 ft (front/depth/length)" : "e.g., 30 x 40 ft";

  return (
    <AdminSidebar>
      <div className="p-4 md:p-8">
        {/* Header — matches the Manage Properties page */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Add New Property
            </h1>
            <p className="text-gray-500 mt-1">Create a new property listing</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/Properties")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Properties
          </Button>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-between max-w-3xl overflow-x-auto">
          {sections.map((s, i) => {
            const Icon = s.icon;
            const active = i === currentStep, done = i < currentStep;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    active ? "bg-primary text-white shadow-lg scale-105" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {done ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs mt-2 ${active ? "text-primary font-semibold" : "text-gray-500"}`}>{s.title}</span>
                </div>
                {i < sections.length - 1 && <div className="w-10 h-px bg-gray-300 mx-2" />}
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl">
          {/* Server / success banners */}
          <AnimatePresence>
            {serverError && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="whitespace-pre-wrap break-words">{serverError}</p>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div key={stepId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }} className="bg-white rounded-xl shadow-sm border overflow-hidden">

                {/* ═════════ BASIC ═════════ */}
                {stepId === "basic" && (
                  <>
                    <SectionHead icon={Home} title="Basic Information" />
                    <div className="p-6 space-y-4">
                      <div>
                        <Label htmlFor="title" className="font-medium mb-2 block">Property Title <span className="text-red-500">*</span></Label>
                        <Input id="title" placeholder="e.g., 3BHK Duplex near Wardha Road" value={formData.title}
                          onChange={handleChange} onBlur={handleBlur} className={errCls("title")} />
                        <FieldError name="title" />
                      </div>
                      <div>
                        <Label htmlFor="description" className="font-medium mb-2 block">Description <span className="text-red-500">*</span></Label>
                        <Textarea id="description" rows={5} placeholder="Describe the property, nearby landmarks, etc."
                          value={formData.description} onChange={handleChange} onBlur={handleBlur} className={`resize-none ${errCls("description")}`} />
                        <FieldError name="description" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium mb-2 block">Purpose <span className="text-red-500">*</span></Label>
                          <Select value={formData.propertyFor} onValueChange={(v) => handleSelect("propertyFor", v)}>
                            <SelectTrigger className={errCls("propertyFor")}><SelectValue placeholder="Sell / Rent" /></SelectTrigger>
                            <SelectContent><SelectItem value="Sale">Sell</SelectItem><SelectItem value="Rent">Rent</SelectItem></SelectContent>
                          </Select>
                          <FieldError name="propertyFor" />
                        </div>
                        <div>
                          <Label className="font-medium mb-2 block">Property Type <span className="text-red-500">*</span></Label>
                          <Select value={formData.category} onValueChange={(v) => handleSelect("category", v)}>
                            <SelectTrigger className={errCls("category")}><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              {(Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[]).map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
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
                        <Button type="button" onClick={goNext}>Next: Details</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ DETAILS ═════════ */}
                {stepId === "details" && (
                  <>
                    <SectionHead icon={DollarSign} title="Property Details" />
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {f?.buildUpArea && (
                          <div><Label htmlFor="buildUpArea" className="font-medium mb-2 block">Built-up Area (sqft) <span className="text-red-500">*</span></Label>
                            <Input id="buildUpArea" type="number" value={formData.buildUpArea} onChange={handleChange} onBlur={handleBlur} className={errCls("buildUpArea")} /><FieldError name="buildUpArea" /></div>
                        )}
                        {f?.carpetArea && (
                          <div><Label htmlFor="carpetArea" className="font-medium mb-2 block">Carpet Area (sqft) <span className="text-red-500">*</span></Label>
                            <Input id="carpetArea" type="number" value={formData.carpetArea} onChange={handleChange} onBlur={handleBlur} className={errCls("carpetArea")} /><FieldError name="carpetArea" /></div>
                        )}
                        {f?.plotArea && (
                          <div><Label htmlFor="plotArea" className="font-medium mb-2 block">Plot Area (sqft) <span className="text-red-500">*</span></Label>
                            <Input id="plotArea" type="number" value={formData.plotArea} onChange={handleChange} onBlur={handleBlur} className={errCls("plotArea")} /><FieldError name="plotArea" /></div>
                        )}
                        {f?.acre && (
                          <div><Label htmlFor="acre" className="font-medium mb-2 block">Area (acres) <span className="text-red-500">*</span></Label>
                            <Input id="acre" type="number" step="0.01" value={formData.acre} onChange={handleChange} onBlur={handleBlur} className={errCls("acre")} /><FieldError name="acre" /></div>
                        )}
                        {f?.plotType && (
                          <div><Label className="font-medium mb-2 block">Document Basis <span className="text-red-500">*</span></Label>
                            <Select value={formData.plotType} onValueChange={(v) => handleSelect("plotType", v)}>
                              <SelectTrigger className={errCls("plotType")}><SelectValue placeholder="RL / Registry" /></SelectTrigger>
                              <SelectContent><SelectItem value="RL">RL (Ready Layout)</SelectItem><SelectItem value="REGISTRY">Registry</SelectItem></SelectContent>
                            </Select><FieldError name="plotType" /></div>
                        )}
                        {f?.facing && (
                          <div><Label className="font-medium mb-2 block">Facing <span className="text-red-500">*</span></Label>
                            <Select value={formData.facing} onValueChange={(v) => handleSelect("facing", v)}>
                              <SelectTrigger className={errCls("facing")}><SelectValue placeholder="Select facing" /></SelectTrigger>
                              <SelectContent>{FACING_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                            </Select><FieldError name="facing" /></div>
                        )}
                        {/* Single free-text dimension field — covers both the "30x40"
                            residential case and the farmland front/depth/length case. */}
                        {f?.dimension && (
                          <div className="md:col-span-2">
                            <Label htmlFor="dimension" className="font-medium mb-2 block">Dimension <span className="text-red-500">*</span></Label>
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
                            <Select value={formData.bedrooms} onValueChange={(v) => handleSelect("bedrooms", v)}>
                              <SelectTrigger className={errCls("bedrooms")}><SelectValue placeholder="Select BHK" /></SelectTrigger>
                              <SelectContent>{[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n === 6 ? "6+ BHK" : `${n} BHK`}</SelectItem>)}</SelectContent>
                            </Select><FieldError name="bedrooms" /></div>
                        )}
                        {f?.bathrooms && (
                          <div><Label className="font-medium mb-2 block">Bathrooms <span className="text-red-500">*</span></Label>
                            <Select value={formData.bathrooms} onValueChange={(v) => handleSelect("bathrooms", v)}>
                              <SelectTrigger className={errCls("bathrooms")}><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
                              <SelectContent>{[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n === 5 ? "5+" : n}</SelectItem>)}</SelectContent>
                            </Select><FieldError name="bathrooms" /></div>
                        )}
                        {f?.furnishing && (
                          <div><Label className="font-medium mb-2 block">Furnishing</Label>
                            <Select value={formData.furnishing} onValueChange={(v) => handleSelect("furnishing", v)}>
                              <SelectTrigger className={errCls("furnishing")}><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                              <SelectContent><SelectItem value="Fully Furnished">Fully Furnished</SelectItem><SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem><SelectItem value="Unfurnished">Unfurnished</SelectItem></SelectContent>
                            </Select><FieldError name="furnishing" /></div>
                        )}
                        <div><Label htmlFor="price" className="font-medium mb-2 block">Price (₹) <span className="text-red-500">*</span></Label>
                          <Input id="price" type="number" value={formData.price} onChange={handleChange} onBlur={handleBlur} className={errCls("price")} /><FieldError name="price" /></div>
                        {f?.ratePerSqft && (
                          <div><Label className="font-medium mb-2 block">Rate ({rateUnitLabel}) — auto</Label>
                            <Input value={computedRate ? `₹ ${computedRate}` : "—"} readOnly disabled className="bg-gray-50" />
                            <p className="mt-1 text-xs text-gray-400">Calculated from price ÷ area.</p></div>
                        )}
                        {f?.brokerage && (
                          <div><Label htmlFor="brokerage" className="font-medium mb-2 block">Brokerage (₹ or %)</Label>
                            <Input id="brokerage" type="number" value={formData.brokerage} onChange={handleChange} onBlur={handleBlur} className={errCls("brokerage")} /><FieldError name="brokerage" /></div>
                        )}
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
                        <Button type="button" onClick={goNext}>{f?.amenities ? "Next: Amenities" : "Next: Location"}</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ AMENITIES ═════════ */}
                {stepId === "amenities" && (
                  <>
                    <SectionHead icon={CheckCircle} title="Amenities" />
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-gray-500">Gallery, lift, security, power backup, etc.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {amenities.map((a: any) => (
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
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                          <Label htmlFor="otherAmenity" className="font-medium mb-2 block">Other amenity</Label>
                          <Input id="otherAmenity" placeholder="e.g., Clubhouse, Solar panels, Rainwater harvesting"
                            value={formData.otherAmenity} onChange={handleChange} className="focus:ring-2 focus:ring-primary/20" />
                          <p className="mt-1 text-xs text-gray-400">Separate multiple with commas.</p>
                        </motion.div>
                      )}
                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
                        <Button type="button" onClick={goNext}>Next: Location</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ LOCATION ═════════ */}
                {stepId === "location" && (
                  <>
                    <SectionHead icon={MapPin} title="Location Information" />
                    <div className="p-6 space-y-4">
                      <div><Label htmlFor="address" className="font-medium mb-2 block">Address <span className="text-red-500">*</span></Label>
                        <Textarea id="address" rows={2} value={formData.address} onChange={handleChange} onBlur={handleBlur} className={errCls("address")} /><FieldError name="address" /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="locality" className="font-medium mb-2 block">Locality / Area <span className="text-red-500">*</span></Label>
                          <Input id="locality" value={formData.locality} onChange={handleChange} onBlur={handleBlur} className={errCls("locality")} /><FieldError name="locality" /></div>
                        <div><Label htmlFor="city" className="font-medium mb-2 block">City <span className="text-red-500">*</span></Label>
                          <Input id="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} className={errCls("city")} /><FieldError name="city" /></div>
                        <div><Label htmlFor="state" className="font-medium mb-2 block">State <span className="text-red-500">*</span></Label>
                          <Input id="state" value={formData.state} onChange={handleChange} onBlur={handleBlur} className={errCls("state")} /><FieldError name="state" /></div>
                        <div><Label htmlFor="pincode" className="font-medium mb-2 block">Pincode <span className="text-red-500">*</span></Label>
                          <Input id="pincode" value={formData.pincode} onChange={handleChange} onBlur={handleBlur} className={errCls("pincode")} maxLength={6} /><FieldError name="pincode" /></div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
                        <Button type="button" onClick={goNext}>Next: Contact</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ CONTACT ═════════ */}
                {stepId === "contact" && (
                  <>
                    <SectionHead icon={User} title="Contact Information" />
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="ownerName" className="font-medium mb-2 block">Owner / Agent Name <span className="text-red-500">*</span></Label>
                          <Input id="ownerName" value={formData.ownerName} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerName")} /><FieldError name="ownerName" /></div>
                        <div><Label htmlFor="ownerPhone" className="font-medium mb-2 block">Phone <span className="text-red-500">*</span></Label>
                          <Input id="ownerPhone" value={formData.ownerPhone} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerPhone")} maxLength={10} /><FieldError name="ownerPhone" /></div>
                        <div className="md:col-span-2"><Label htmlFor="ownerEmail" className="font-medium mb-2 block">Email <span className="text-red-500">*</span></Label>
                          <Input id="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleChange} onBlur={handleBlur} className={errCls("ownerEmail")} /><FieldError name="ownerEmail" /></div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
                        <Button type="button" onClick={goNext}>Next: Media</Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ═════════ MEDIA ═════════ */}
                {stepId === "media" && (
                  <>
                    <SectionHead icon={Camera} title="Media & Documents" />
                    <div className="p-6 space-y-6">
                      <div>
                        <Label className="font-medium mb-2 block">Property Photos <span className="text-red-500">*</span></Label>
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${fieldErrors.images ? "border-red-400" : "border-gray-300 hover:border-primary"}`}>
                          <input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" disabled={compressingImages} />
                          <label htmlFor="images" className="cursor-pointer block">
                            {compressingImages ? (
                              <><Loader2 className="w-10 h-10 mx-auto text-primary mb-2 animate-spin" /><p className="text-gray-600">Compressing…</p></>
                            ) : (
                              <><Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-600">Click to upload (max {MAX_IMAGES})</p>
                                <p className="text-xs text-blue-500 mt-1">Images over 5 MB are auto-compressed</p></>
                            )}
                          </label>
                        </div>
                        <FieldError name="images" />
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {imagePreviews.map((p, i) => (
                              <div key={p} className="relative group">
                                <img src={p} alt={`Preview ${i + 1}`} className="w-full h-28 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeImage(i)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="w-4 h-4" />
                                </button>
                                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                  {((images[i]?.size ?? 0) / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <SingleUpload label={`Document ${formData.category === "Farmland" ? "(7/12)" : ""} (optional)`}
                            file={docFile} error={fieldErrors.document} accept={DOC_ACCEPT}
                            onChange={handleSingleFile(setDocFile, "document", "doc")} onClear={() => setDocFile(null)} />

                      {f?.layoutMap && (
                        <SingleUpload label="Layout Map" file={layoutMapFile} error={fieldErrors.layoutMap} accept={DOC_ACCEPT}
                          onChange={handleSingleFile(setLayoutMapFile, "layoutMap", "doc")} onClear={() => setLayoutMapFile(null)} />
                      )}
                      {f?.landMap && (
                        <SingleUpload label="Land Map" file={landMapFile} error={fieldErrors.landMap} accept={DOC_ACCEPT}
                          onChange={handleSingleFile(setLandMapFile, "landMap", "doc")} onClear={() => setLandMapFile(null)} />
                      )}
                      {f?.video && (
                        <SingleUpload label="Walkthrough Video (optional)" file={videoFile} error={fieldErrors.video} accept="video/*"
                          onChange={handleSingleFile(setVideoFile, "video", "video")} onClear={() => setVideoFile(null)} />
                      )}

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={goPrev}>Previous</Button>
                        <Button type="submit" disabled={loading || compressingImages} className="bg-gradient-to-r from-primary to-primary/70">
                          {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>) : "Submit Property"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
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

function SingleUpload({ label, required, file, error, accept, onChange, onClear }: {
  label: string; required?: boolean; file: File | null; error?: string; accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void;
}) {
  const id = `su-${label.replace(/\W+/g, "")}`;
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
        <div className={`border-2 border-dashed rounded-lg p-4 text-center ${error ? "border-red-400" : "border-gray-300 hover:border-primary"}`}>
          <input id={id} type="file" accept={accept} onChange={onChange} className="hidden" />
          <label htmlFor={id} className="cursor-pointer flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Upload className="w-4 h-4" /> Click to upload
          </label>
        </div>
      )}
      {error && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}
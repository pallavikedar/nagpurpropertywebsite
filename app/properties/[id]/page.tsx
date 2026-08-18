"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bath,
  Bed,
  Building2,
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  Eye,
  Heart,
  Home,
  Maximize2,
  MessageCircle,
  MapPin,
  Ruler,
  Share2,
  Shield,
  Sparkles,
  Trees,
  User,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

/** Enquiry number lives in env so staging/prod can differ and it isn't a code change. */
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "919494942894";

/** Where image paths resolve from when the backend returns relative paths
 *  like "uploads/abc.jpg" or "/property/image/12". next/image rejects any src
 *  that is neither absolute nor root-relative, so this has to be resolved
 *  before it reaches the component. */
const IMAGE_BASE_URL = (
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || BASE_URL || ""
).replace(/\/+$/, "");

/**
 * IMAGE LOADING — read this before changing anything below.
 *
 * next/image refuses any remote src whose host isn't listed in
 * next.config.js `images.remotePatterns`. When it refuses, it never mounts a
 * real <img>, so neither onLoad nor onError fires — you get a grey box and no
 * console error. That was the "images not showing" bug.
 *
 * This file therefore serves images UNOPTIMIZED by default, which skips the
 * optimizer and the allow-list entirely. It always works, including when the
 * image endpoint needs an Authorization header (the optimizer runs
 * server-side and doesn't forward headers).
 *
 * To turn optimization back on (smaller files, WebP, proper caching):
 *   1. set NEXT_PUBLIC_OPTIMIZE_IMAGES=true
 *   2. add the host to next.config.js — matching is exact and case-sensitive
 *      on protocol, hostname, port AND pathname:
 *
 *      images: {
 *        remotePatterns: [
 *          { protocol: "https", hostname: "api.yourdomain.com", pathname: "/**" },
 *          { protocol: "http",  hostname: "localhost", port: "8080", pathname: "/**" },
 *        ],
 *      }
 *
 *   3. restart the dev server — next.config.js is read at build time only.
 */
const UNOPTIMIZED_IMAGES = process.env.NEXT_PUBLIC_OPTIMIZE_IMAGES !== "true";

/** Categories where the property IS the land: no bedrooms, bathrooms,
 *  furnishing, parking or floor number. Compared case-insensitively because
 *  the API is not guaranteed to keep its casing stable. */
const LAND_CATEGORIES = new Set(["plot", "farmland"]);

/** How many images render above the fold (1 hero + 4 thumbnails). */
const VISIBLE_IMAGE_COUNT = 5;

/** Safety net for next/image: if a hostname is missing from
 *  next.config.js `images.remotePatterns`, next/image never mounts a real
 *  <img>, so neither onLoad nor onError fires and the skeleton spins forever. */
const IMAGE_LOAD_TIMEOUT_MS = 8000;

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

interface RawProperty {
  id: number | string;
  title?: string;
  description?: string;
  propertyFor?: string; // "Sale" | "Rent"
  propertyType?: string; // "Apartment" | "Villa" | "Plot" | "Farmland" ...
  price?: number;
  area?: number; // acres, for Farmland
  buildUpArea?: number | null;
  carpetArea?: number | null;
  plotArea?: number | null;
  plotType?: string | null; // "RL" | "Registry"
  dimension?: string | null; // e.g. "25/30"
  ratePerSqft?: number | null;
  brokerage?: number | null;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  amenities?: string[];
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status?: string;
  verified?: boolean;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  images?: string[];
  image?: string;
  createdAt?: string;
  views?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  yearBuilt?: number;
  parking?: string;
}

interface Property {
  id: string;
  title: string;
  address: string;
  locality?: string;
  city?: string;
  pincode?: string;
  images: string[];
  type: "rent" | "sale";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  category: string;
  status?: string;
  verified: boolean;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail?: string;
  description?: string;
  yearBuilt?: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  furnishing?: string;
  parking?: string;
  plotType?: string;
  dimension?: string;
  carpetArea?: number;
  ratePerSqft?: number;
  brokerage?: number;
  amenities: string[];
  createdAt?: string;
  views?: number;
}

/* -------------------------------------------------------------------------- */
/* Normalisation                                                               */
/* -------------------------------------------------------------------------- */

const toNumber = (value: unknown): number => {
  const n = typeof value === "string" ? Number(value) : (value as number);
  return Number.isFinite(n) ? (n as number) : 0;
};

/** Turns whatever the backend sent into something next/image accepts:
 *  absolute URLs pass through, everything else is joined onto IMAGE_BASE_URL.
 *  A bare "uploads/x.jpg" would otherwise throw "Failed to parse src". */
function resolveImageUrl(src: string): string | null {
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return IMAGE_BASE_URL ? `${IMAGE_BASE_URL}${path}` : path;
}

/** Drops empties/dupes and anything that isn't a usable URL, so the gallery
 *  never renders a broken tile for a null the backend slipped in. */
const cleanImages = (raw: RawProperty): string[] => {
  const candidates = raw.images?.length ? raw.images : raw.image ? [raw.image] : [];
  return Array.from(
    new Set(
      candidates
        .filter((src): src is string => typeof src === "string")
        .map(resolveImageUrl)
        .filter((src): src is string => Boolean(src))
    )
  );
};

function normalizeProperty(raw: RawProperty): Property {
  const composedAddress = [raw.locality, raw.city, raw.state, raw.pincode]
    .filter(Boolean)
    .join(", ");

  return {
    id: String(raw.id),
    title: raw.title?.trim() || "Untitled property",
    address: raw.address?.trim() || composedAddress || "Location not specified",
    locality: raw.locality?.trim() || undefined,
    city: raw.city?.trim() || undefined,
    pincode: raw.pincode?.trim() || undefined,
    images: cleanImages(raw),
    type: raw.propertyFor?.trim().toLowerCase() === "rent" ? "rent" : "sale",
    price: toNumber(raw.price),
    bedrooms: toNumber(raw.bedrooms),
    bathrooms: toNumber(raw.bathrooms),
    area:
      toNumber(raw.buildUpArea) ||
      toNumber(raw.carpetArea) ||
      toNumber(raw.plotArea) ||
      toNumber(raw.area),
    category: raw.propertyType?.trim() || "Property",
    status: raw.status?.trim() || undefined,
    verified: raw.verified === true,
    ownerName: raw.ownerName?.trim() || "Nagpur Properties",
    ownerPhone: raw.ownerPhone?.trim() || undefined,
    ownerEmail: raw.ownerEmail?.trim() || undefined,
    description: raw.description?.trim() || undefined,
    yearBuilt: raw.yearBuilt || undefined,
    floorNumber: raw.floorNumber ?? undefined,
    totalFloors: raw.totalFloors ?? undefined,
    facing: raw.facing?.trim() || undefined,
    furnishing: raw.furnishing?.trim() || undefined,
    parking: raw.parking?.trim() || undefined,
    plotType: raw.plotType?.trim() || undefined,
    dimension: raw.dimension?.trim() || undefined,
    carpetArea: toNumber(raw.carpetArea) || undefined,
    ratePerSqft: raw.ratePerSqft ?? undefined,
    brokerage: raw.brokerage ?? undefined,
    amenities: (raw.amenities ?? [])
      .filter((a): a is string => typeof a === "string")
      .map((a) => a.trim())
      .filter(Boolean),
    createdAt: raw.createdAt,
    views: raw.views,
  };
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const trimZeros = (value: number) => value.toFixed(2).replace(/\.?0+$/, "");

/** Sale prices read better compacted (₹1.25 Cr); rent reads better in full
 *  (₹22,000/month), so rent only compacts once it crosses a lakh. */
function formatPrice(price: number, type: Property["type"] = "sale"): string {
  if (!Number.isFinite(price) || price <= 0) return "Price on request";
  if (type === "rent" && price < 100000) return `₹${inr.format(price)}`;
  if (price >= 10000000) return `₹${trimZeros(price / 10000000)} Cr`;
  if (price >= 100000) return `₹${trimZeros(price / 100000)} L`;
  return `₹${inr.format(price)}`;
}

const formatArea = (area: number, unit: string) =>
  area > 0 ? `${inr.format(area)} ${unit}` : "—";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  parking: <Car className="h-4 w-4" />,
  carparking: <Car className="h-4 w-4" />,
  lift: <Building2 className="h-4 w-4" />,
  elevator: <Building2 className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  cctv: <Shield className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
  swimmingpool: <Waves className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  gymnasium: <Dumbbell className="h-4 w-4" />,
  clubhouse: <Coffee className="h-4 w-4" />,
  powerbackup: <Sparkles className="h-4 w-4" />,
  ac: <Wind className="h-4 w-4" />,
  airconditioning: <Wind className="h-4 w-4" />,
  garden: <Trees className="h-4 w-4" />,
  park: <Trees className="h-4 w-4" />,
  playarea: <Trees className="h-4 w-4" />,
  childrenplayarea: <Trees className="h-4 w-4" />,
  childrensplayarea: <Trees className="h-4 w-4" />,
};

/** Strips spaces, hyphens and case so "Power Backup", "power-backup" and
 *  "powerBackup" all resolve to the same icon. */
function amenityIcon(name: string) {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return AMENITY_ICONS[key] ?? <CheckCircle className="h-4 w-4" />;
}

/** The API stores amenities as camelCase keys ("powerBackup",
 *  "childrensPlayArea"). CSS `capitalize` alone renders those verbatim, so
 *  split the words out before displaying. */
function formatAmenity(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* -------------------------------------------------------------------------- */
/* SmartImage                                                                  */
/* -------------------------------------------------------------------------- */

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** "cover" crops to fill (gallery tiles); "contain" shows the whole image
   *  (lightbox). These must never both be applied — see note below. */
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes: string;
}

const SmartImage = React.memo(function SmartImage({
  src,
  alt,
  className,
  fit = "cover",
  priority = false,
  sizes,
}: SmartImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  // A ref, not state, so the timeout never has to read stale state or run a
  // side effect from inside a setState updater (which React can call twice).
  const settled = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    settled.current = false;

    // Cached and preloaded images fire their load event BEFORE React can
    // attach onLoad, and this effect runs after commit — without the check
    // below it would reset such an image to "loading" and leave it at
    // opacity-0. img.complete is the browser's own answer to "did this
    // already finish?", and naturalWidth === 0 on a complete image means it
    // failed.
    const node = imgRef.current;
    if (node?.complete) {
      settled.current = true;
      setStatus(node.naturalWidth > 0 ? "loaded" : "error");
      return;
    }

    setStatus("loading");

    const timer = window.setTimeout(() => {
      if (settled.current) return;
      setStatus("error");
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[SmartImage] no load/error event after ${IMAGE_LOAD_TIMEOUT_MS}ms: ${src}`
        );
      }
    }, IMAGE_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [src]);

  const handleLoad = useCallback(() => {
    settled.current = true;
    setStatus("loaded");
  }, []);

  const handleError = useCallback(() => {
    settled.current = true;
    setStatus("error");
  }, []);

  if (process.env.NODE_ENV !== "production" && /\babsolute\b|\bfixed\b/.test(className ?? "")) {
    // The wrapper below is `relative` because next/image's `fill` needs a
    // positioned ancestor. Passing `absolute` in className puts both classes
    // on one element, and Tailwind emits `.relative` AFTER `.absolute`, so
    // `relative` wins — `inset-0` then does nothing and the box collapses to
    // height 0. Size this component with h-full/w-full or an aspect ratio and
    // put any absolute positioning on a parent element instead.
    console.error(
      "[SmartImage] className must not contain absolute/fixed — the box will collapse to 0 height.",
      className
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" aria-hidden="true" />
      )}

      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs text-gray-400">
          Image unavailable
        </div>
      ) : (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          unoptimized={UNOPTIMIZED_IMAGES}
          sizes={sizes}
          draggable={false}
          // Exactly one object-fit class. Passing "object-cover" and
          // "object-contain" together does NOT let the later one in the string
          // win — CSS order in Tailwind's stylesheet decides, and object-cover
          // is emitted after object-contain, so it always won and the lightbox
          // silently cropped the image.
          className={`${
            fit === "contain" ? "object-contain" : "object-cover"
          } transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Shell states                                                                */
/* -------------------------------------------------------------------------- */

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function PageSkeleton() {
  return (
    <PageShell>
      <main className="flex-1" aria-busy="true" aria-label="Loading property">
        <div className="container px-4 py-8 md:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-10 w-2/3 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="aspect-[16/9] rounded-2xl bg-gray-200 lg:col-span-3" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <div className="aspect-video rounded-xl bg-gray-200 lg:aspect-square" />
                <div className="aspect-video rounded-xl bg-gray-200 lg:aspect-square" />
                <div className="hidden aspect-video rounded-xl bg-gray-200 lg:block lg:aspect-square" />
                <div className="hidden aspect-video rounded-xl bg-gray-200 lg:block lg:aspect-square" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-24 rounded-xl bg-gray-200" />
                <div className="h-64 rounded-xl bg-gray-200" />
              </div>
              <div className="h-80 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}

function StatusScreen({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action: React.ReactNode;
}) {
  return (
    <PageShell>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="max-w-md p-8 text-center">
          <div className="mb-4 flex justify-center">{icon}</div>
          <h1 className="mb-2 text-xl font-semibold text-gray-900">{title}</h1>
          <p className="mb-6 text-sm text-gray-600">{message}</p>
          {action}
        </Card>
      </main>
    </PageShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; property: Property }
  | { kind: "missing" }
  | { kind: "error"; message: string };

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxTrigger = useRef<HTMLElement | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Fetch                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setState({ kind: "loading" });
      setSelectedIndex(0);

      try {
        // Detail pages are public: send the token only when one exists, so
        // logged-out visitors don't get a literal "Bearer null" rejected.
        const token =
          typeof window !== "undefined" ? localStorage.getItem("usertoken") : null;

        const response = await fetch(
          `${BASE_URL}/property/${encodeURIComponent(id)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            signal: controller.signal,
          }
        );

        if (response.status === 404 || response.status === 204) {
          setState({ kind: "missing" });
          return;
        }
        if (!response.ok) {
          throw new Error(
            `We couldn't load this property (server responded ${response.status}).`
          );
        }

        const data = (await response.json()) as RawProperty | null;
        if (!data || data.id == null) {
          setState({ kind: "missing" });
          return;
        }

        setState({ kind: "ready", property: normalizeProperty(data) });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState({
          kind: "error",
          message:
            (err as Error).message ||
            "We couldn't reach the server. Check your connection and try again.",
        });
      }
    })();

    return () => controller.abort();
  }, [id]);

  const property = state.kind === "ready" ? state.property : null;

  /* ---------------------------------------------------------------------- */
  /* Gallery                                                                 */
  /* ---------------------------------------------------------------------- */

  const images = useMemo(() => property?.images ?? [], [property]);
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const thumbnails = useMemo(
    () => images.slice(1, VISIBLE_IMAGE_COUNT),
    [images]
  );
  const hiddenImageCount = Math.max(0, imageCount - VISIBLE_IMAGE_COUNT + 1);

  const step = useCallback(
    (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
      setter((current) => (current + delta + imageCount) % imageCount);
    },
    [imageCount]
  );

  const nextImage = useCallback(() => step(setSelectedIndex, 1), [step]);
  const prevImage = useCallback(() => step(setSelectedIndex, -1), [step]);

  const openLightbox = useCallback((index: number, trigger?: HTMLElement | null) => {
    lightboxTrigger.current = trigger ?? null;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    lightboxTrigger.current?.focus();
  }, []);

  const isLightboxOpen = lightboxIndex !== null;

  // Keyboard control + scroll lock, both scoped to the open lightbox.
  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => ((i ?? 0) + 1) % imageCount);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => ((i ?? 0) - 1 + imageCount) % imageCount);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isLightboxOpen, imageCount, closeLightbox]);

  /* ---------------------------------------------------------------------- */
  /* Derived content                                                         */
  /* ---------------------------------------------------------------------- */

  const isLand = property
    ? LAND_CATEGORIES.has(property.category.toLowerCase())
    : false;
  const isFarmland = property?.category.toLowerCase() === "farmland";
  const areaUnit = isFarmland ? "acre" : "sq.ft";

  const statCards = useMemo(() => {
    if (!property) return [];

    if (isLand) {
      return [
        {
          icon: Ruler,
          bg: "bg-green-100",
          color: "text-green-600",
          label: isFarmland ? "Land area" : "Plot area",
          value: formatArea(property.area, areaUnit),
        },
        ...(property.plotType
          ? [
              {
                icon: Shield,
                bg: "bg-purple-100",
                color: "text-purple-600",
                label: "Document basis",
                value: property.plotType,
              },
            ]
          : []),
        ...(property.facing
          ? [
              {
                icon: Award,
                bg: "bg-blue-100",
                color: "text-blue-600",
                label: "Facing",
                value: property.facing,
              },
            ]
          : []),
        {
          icon: Building2,
          bg: "bg-orange-100",
          color: "text-orange-600",
          label: "Property type",
          value: property.category,
        },
      ];
    }

    return [
      {
        icon: Bed,
        bg: "bg-blue-100",
        color: "text-blue-600",
        label: "Bedrooms",
        value: property.bedrooms > 0 ? String(property.bedrooms) : "—",
      },
      {
        icon: Bath,
        bg: "bg-purple-100",
        color: "text-purple-600",
        label: "Bathrooms",
        value: property.bathrooms > 0 ? String(property.bathrooms) : "—",
      },
      {
        icon: Ruler,
        bg: "bg-green-100",
        color: "text-green-600",
        label: "Built-up area",
        value: formatArea(property.area, areaUnit),
      },
      {
        icon: Building2,
        bg: "bg-orange-100",
        color: "text-orange-600",
        label: "Property type",
        value: property.category,
      },
    ];
  }, [property, isLand, isFarmland, areaUnit]);

  const propertyUrl = useMemo(() => {
    if (!property) return "";
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${origin}/properties/${property.id}`;
  }, [property]);

  const shareMessage = useMemo(() => {
    if (!property) return "";
    const config = isLand
      ? formatArea(property.area, areaUnit)
      : `${property.bedrooms} BHK, ${formatArea(property.area, areaUnit)}`;

    return [
      `*${property.title}*`,
      `Location: ${property.address}`,
      `Price: ${formatPrice(property.price, property.type)}${
        property.type === "rent" ? "/month" : ""
      }`,
      `Configuration: ${config}`,
      ``,
      `View full details here:`,
      // The URL sits alone on its line — WhatsApp's link detector is strict
      // about adjacent characters.
      propertyUrl,
    ].join("\n");
  }, [property, isLand, areaUnit, propertyUrl]);

  const handleWhatsAppEnquiry = useCallback(() => {
    const message = [
      "Hello, I would like to enquire about the following property:",
      "",
      shareMessage,
      "",
      "Could you please share more details and a good time for a site visit? Thank you.",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareMessage]);

  const handleShare = useCallback(async () => {
    if (!property) return;
    const message = `Check out this property:\n\n${shareMessage}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: message,
          url: propertyUrl,
        });
        return;
      } catch (err) {
        // A cancelled share sheet is a deliberate choice — don't second-guess
        // it by opening WhatsApp. Only a real failure falls through.
        if ((err as Error).name === "AbortError") return;
      }
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [property, shareMessage, propertyUrl]);

  /* ---------------------------------------------------------------------- */
  /* Non-ready states                                                        */
  /* ---------------------------------------------------------------------- */

  if (state.kind === "loading") return <PageSkeleton />;

  if (state.kind === "error") {
    return (
      <StatusScreen
        icon={<Home className="h-12 w-12 text-gray-300" />}
        title="This property didn't load"
        message={state.message}
        action={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => window.location.reload()}>Try again</Button>
            <Link href="/properties">
              <Button variant="outline" className="w-full">
                Browse properties
              </Button>
            </Link>
          </div>
        }
      />
    );
  }

  if (state.kind === "missing" || !property) {
    return (
      <StatusScreen
        icon={<Home className="h-12 w-12 text-gray-300" />}
        title="Property not found"
        message="This listing has been removed or the link is incorrect."
        action={
          <Link href="/properties">
            <Button>Browse properties</Button>
          </Link>
        }
      />
    );
  }

  const heroImage = images[selectedIndex] ?? images[0];
  const priceLabel = formatPrice(property.price, property.type);

  /* JSON-LD so listings surface properly in search and link previews. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url: propertyUrl,
    description: property.description,
    image: images.slice(0, 5),
    datePosted: property.createdAt,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      postalCode: property.pincode,
      addressCountry: "IN",
    },
    ...(property.price > 0 && {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "INR",
      },
    }),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="sticky top-0 z-20 border-b bg-white"
        >
          <div className="container flex flex-wrap items-center gap-2 px-4 py-3 text-sm text-muted-foreground md:px-6">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <Link href="/properties" className="transition-colors hover:text-primary">
              Properties
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="max-w-[240px] truncate font-medium text-foreground sm:max-w-[420px]">
              {property.title}
            </span>
          </div>
        </nav>

        {/* Header */}
        <section className="border-b bg-white pb-4 pt-6">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge
                    className={
                      property.type === "rent"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-green-500 hover:bg-green-600"
                    }
                  >
                    {property.type === "rent" ? "For rent" : "For sale"}
                  </Badge>
                  <Badge variant="secondary">{property.category}</Badge>
                  {property.status &&
                    !/available|accepted|active/i.test(property.status) && (
                      <Badge variant="outline">{property.status}</Badge>
                    )}
                </div>

                <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                  {property.title}
                </h1>

                <p className="flex items-start text-sm text-gray-500">
                  <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>{property.address}</span>
                </p>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-3xl font-bold text-primary md:text-4xl">
                  {priceLabel}
                  {property.type === "rent" && property.price > 0 && (
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      /month
                    </span>
                  )}
                </p>
                {property.ratePerSqft != null && property.ratePerSqft > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    ₹{inr.format(property.ratePerSqft)} per{" "}
                    {isFarmland ? "acre" : "sq.ft"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-8" aria-label="Property photos">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
                  {imageCount > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => openLightbox(selectedIndex, e.currentTarget)}
                        className="absolute inset-0 h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label={`Enlarge photo ${selectedIndex + 1} of ${imageCount}`}
                      >
                        <SmartImage
                          src={heroImage}
                          alt={`${property.title} — photo ${selectedIndex + 1}`}
                          className="h-full w-full"
                          priority
                          sizes="(max-width: 1024px) 100vw, 75vw"
                        />
                      </button>

                      {hasMultipleImages && (
                        <>
                          <button
                            type="button"
                            onClick={prevImage}
                            aria-label="Previous photo"
                            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={nextImage}
                            aria-label="Next photo"
                            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          <p className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-md bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                            {selectedIndex + 1} / {imageCount}
                          </p>
                        </>
                      )}

                      <p className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-lg bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                        <Maximize2 className="h-3 w-3" aria-hidden="true" />
                        Tap to enlarge
                      </p>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <Home className="mb-2 h-10 w-10" aria-hidden="true" />
                      <p className="text-sm">No photos added yet</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsFavorite((f) => !f)}
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? "Remove from saved" : "Save this property"}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-2.5 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share this property"
                    className="absolute right-16 top-4 z-10 rounded-full bg-white/95 p-2.5 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                  >
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Thumbnails: a click selects the photo. Enlarging is the hero's
                  job, so browsing the strip no longer traps you in a lightbox. */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {thumbnails.map((img, i) => {
                    const index = i + 1;
                    const isLastTile = index === VISIBLE_IMAGE_COUNT - 1;
                    const showOverlay = isLastTile && hiddenImageCount > 0;

                    return (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() =>
                          showOverlay
                            ? openLightbox(index)
                            : setSelectedIndex(index)
                        }
                        aria-label={
                          showOverlay
                            ? `View all ${imageCount} photos`
                            : `Show photo ${index + 1}`
                        }
                        aria-current={selectedIndex === index}
                        className={`relative overflow-hidden rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          selectedIndex === index
                            ? "ring-2 ring-primary ring-offset-2"
                            : "hover:ring-2 hover:ring-gray-300"
                        }`}
                      >
                        <SmartImage
                          src={img}
                          alt={`${property.title} — photo ${index + 1}`}
                          className="aspect-video rounded-xl lg:aspect-square"
                          sizes="(max-width: 1024px) 45vw, 220px"
                        />
                        {showOverlay && (
                          <span className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/60 font-semibold text-white">
                            +{hiddenImageCount} more
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {thumbnails.length === 0 && (
                    <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 lg:aspect-square">
                      <p className="px-4 text-center text-sm text-gray-400">
                        Only one photo for this listing
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {isLightboxOpen && lightboxIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${property.title} photo viewer`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo viewer"
              autoFocus
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {hasMultipleImages && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => ((i ?? 0) - 1 + imageCount) % imageCount);
                }}
                className="absolute left-2 z-10 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 md:left-4"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}

            <div
              className="relative h-[80vh] w-[92vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage
                src={images[lightboxIndex]}
                alt={`${property.title} — photo ${lightboxIndex + 1} of ${imageCount}`}
                className="h-full w-full bg-transparent"
                fit="contain"
                sizes="92vw"
                priority
              />
            </div>

            {hasMultipleImages && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => ((i ?? 0) + 1) % imageCount);
                }}
                className="absolute right-2 z-10 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 md:right-4"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            )}

            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {lightboxIndex + 1} of {imageCount}
            </p>
          </div>
        )}

        {/* Content */}
        <section className="pb-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                          <div key={stat.label} className="text-center">
                            <div
                              className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                            >
                              <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                            </div>
                            <dt className="text-xs text-gray-500">{stat.label}</dt>
                            <dd className="text-lg font-bold capitalize text-gray-900">
                              {stat.value}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 rounded-b-none rounded-t-xl">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="space-y-4 p-6">
                        <p className="whitespace-pre-line leading-relaxed text-gray-700">
                          {property.description ||
                            (isLand
                              ? `This ${property.category.toLowerCase()} is located at ${property.address}.`
                              : `This ${
                                  property.bedrooms > 0
                                    ? `${property.bedrooms} bedroom `
                                    : ""
                                }${property.category.toLowerCase()} is located at ${
                                  property.address
                                }.`)}
                        </p>
                      </TabsContent>

                      <TabsContent value="details" className="p-6">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                          <div className="space-y-1">
                            <h2 className="mb-3 font-semibold text-gray-900">
                              Property specifications
                            </h2>
                            {/* <DetailRow label="Property ID" value={`#${property.id}`} /> */}
                            <DetailRow label="Listed by" value={property.ownerName} />
                            {!isLand && (
                              <>
                                <DetailRow label="Furnishing" value={property.furnishing} />
                                <DetailRow label="Car parking" value={property.parking} />
                              </>
                            )}
                            {isLand && (
                              <DetailRow label="Document basis" value={property.plotType} />
                            )}
                            <DetailRow
                              label="Brokerage"
                              value={
                                property.brokerage != null
                                  ? `₹${inr.format(property.brokerage)}`
                                  : undefined
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <h2 className="mb-3 font-semibold text-gray-900">
                              Additional info
                            </h2>
                            {!isLand && (
                              <>
                                <DetailRow
                                  label="Floor"
                                  value={
                                    property.floorNumber != null &&
                                    property.totalFloors != null
                                      ? `${property.floorNumber} of ${property.totalFloors}`
                                      : undefined
                                  }
                                />
                                <DetailRow
                                  label="Year built"
                                  value={property.yearBuilt?.toString()}
                                />
                              </>
                            )}
                            <DetailRow label="Facing" value={property.facing} />
                            <DetailRow
                              label="Carpet area"
                              value={
                                property.carpetArea
                                  ? formatArea(property.carpetArea, "sq.ft")
                                  : undefined
                              }
                            />
                            <DetailRow label="Dimensions" value={property.dimension} />
                            <DetailRow
                              label={`Rate (₹/${isFarmland ? "acre" : "sq.ft"})`}
                              value={
                                property.ratePerSqft != null
                                  ? `₹${inr.format(property.ratePerSqft)}`
                                  : undefined
                              }
                            />
                            <DetailRow label="Locality" value={property.locality} />
                            <DetailRow label="Pin code" value={property.pincode} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="amenities" className="p-6">
                        {property.amenities.length > 0 ? (
                          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {property.amenities.map((amenity) => (
                              <li
                                key={amenity}
                                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                              >
                                <span className="text-primary">{amenityIcon(amenity)}</span>
                                <span className="text-sm capitalize text-gray-700">
                                  {formatAmenity(amenity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No amenities listed. Ask us on WhatsApp and we&apos;ll confirm
                            what this property includes.
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <Card className="sticky top-24 border-t-4 border-t-primary shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Interested in this property?</CardTitle>
                    <CardDescription>Get in touch with us today</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Link
                      href={`/enquiry/property/${property.id}`}
                      className="block"
                    >
                      <Button className="w-full gap-2 shadow-md">
                        <MessageCircle className="h-4 w-4" />
                        Send enquiry
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleWhatsAppEnquiry}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Enquire on WhatsApp
                    </Button>

                    <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                      Share property
                    </Button>

                    <Separator />

                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" aria-hidden="true" />
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Listed by</p>
                        <p className="font-semibold text-gray-900">{property.ownerName}</p>
                        {property.verified && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" aria-hidden="true" />
                            Verified listing
                          </p>
                        )}
                      </div>
                    </div>

                    {(property.createdAt || property.views != null) && (
                      <div className="space-y-2 text-sm">
                        {property.createdAt && (
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="h-3 w-3" aria-hidden="true" /> Posted on
                            </span>
                            <span className="font-medium text-gray-900">
                              {new Date(property.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {property.views != null && (
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Eye className="h-3 w-3" aria-hidden="true" /> Views
                            </span>
                            <span className="font-medium text-gray-900">
                              {inr.format(property.views)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="text-center">
                      <p className="mb-1 text-xs text-gray-500">Want to see it in person?</p>
                      <Link href={`/enquiry/property/${property.id}`}>
                        <Button variant="link" className="gap-1 text-sm text-primary">
                          Schedule a site visit
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Small presentational helper                                                 */
/* -------------------------------------------------------------------------- */

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b py-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium capitalize text-gray-900">{value}</span>
    </div>
  );
}
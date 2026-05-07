"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoutePrefetcher() {
  const router = useRouter();
  
  useEffect(() => {
    // Prefetch all routes instantly
    const routes = ["/", "/properties", "/add-property", "/contact", "/Login", "/profile"];
    routes.forEach(route => router.prefetch(route));
    
    // Prefetch on hover - FIXED
    const prefetchOnHover = (e) => {
      // Check if e.target is an element and has closest method
      if (e.target && typeof e.target.closest === 'function') {
        const link = e.target.closest('a');
        if (link?.href && link.getAttribute('href') && !link.href.startsWith('http')) {
          const href = link.getAttribute('href');
          if (href) router.prefetch(href);
        }
      }
    };
    
    document.addEventListener('mouseenter', prefetchOnHover, true);
    return () => document.removeEventListener('mouseenter', prefetchOnHover, true);
  }, [router]);
  
  return null;
}
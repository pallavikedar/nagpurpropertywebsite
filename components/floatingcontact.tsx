"use client";

import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      
      {/* WhatsApp */}
      <a
        href="https://wa.me/919494942894" // replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:scale-110 transition"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>

      {/* Call */}
      <a
        href="tel:+919494942894" // replace with your number
        className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition"
        aria-label="Call"
      >
        <FaPhoneAlt size={22} />
      </a>
    </div>
  );
}

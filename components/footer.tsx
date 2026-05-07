"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Twitter, 
  Youtube,
  Linkedin,
  Home,
  Building2,
  PlusCircle,
  Scale,
  PhoneCall,
  ChevronRight,
  ArrowUp,
  Clock,
  Award,
  Shield,
  Heart
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const { translations } = useLanguage();
  const t = translations;
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const quickLinks = [
    { href: "/", label: t.home || "Home", icon: Home },
    { href: "/properties", label: t.Properties || "Properties", icon: Building2 },
    { href: "/add-property", label: t.AddProperty || "Add Property", icon: PlusCircle },
    { href: "/enquiry/legal", label: t.LegalConsultancy || "Legal Consultancy", icon: Scale },
    { href: "/contact", label: t.Contact || "Contact", icon: PhoneCall },
  ];

  const propertyTypes = [
    { href: "/properties?category=residential", label: t.Residential || "Residential" },
    { href: "/properties?category=commercial", label: t.Commercial || "Commercial" },
    { href: "/properties?category=land", label: t.LandPlots || "Land & Plots" },
    { href: "/properties?type=rent", label: t.RentalProperties || "Rental Properties" },
    { href: "/properties?type=buy", label: t.PropertiesforSale || "Properties for Sale" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "#1877f2" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "#1da1f2" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "#e4405f" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "#0a66c2" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "#ff0000" },
  ];

  const stats = [
    { value: "500+", label: "Properties Sold", icon: Award },
    { value: "1000+", label: "Happy Clients", icon: Heart },
    { value: "99%", label: "Success Rate", icon: Shield },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      {/* Main Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundRepeat: "repeat",
          }} />
        </div>

        {/* Decorative Gradient Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Top Section with Newsletter */}
          {/* <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerVariants}
            className="border-b border-gray-700 pb-12 mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-400">
                  Get the latest property updates, market insights, and exclusive offers directly in your inbox.
                </p>
              </div>
              <div>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary"
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                    Subscribe Now
                  </Button>
                </form>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm mt-2"
                  >
                    ✅ Thank you for subscribing!
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div> */}

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={footerVariants}
              className="space-y-4"
            >
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent mb-3">
                  {t.appName || "Nagpur Properties"}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t.YourtrustedpartnerforrealestatesolutionsinNagpurWehelpyoufindbuysellandrentpropertieswithease}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="text-primary font-bold text-lg">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              {/* <div className="pt-4">
                <p className="text-sm font-medium text-white mb-3">Follow Us</p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, scale: 1.1 }}
                        className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 group"
                        style={{ '--hover-color': social.color }}
                      >
                        <Icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                      </motion.a>
                    );
                  })}
                </div>
              </div> */}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={footerVariants}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white mb-4 relative inline-block">
                {t.QuickLinks || "Quick Links"}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary rounded-full mt-2" />
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                      >
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Property Types */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={footerVariants}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white mb-4 relative inline-block">
                {t.PropertyTypes || "Property Types"}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary rounded-full mt-2" />
              </h3>
              <ul className="space-y-3">
                {propertyTypes.map((type, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      href={type.href}
                      className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                      <span>{type.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={footerVariants}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white mb-4 relative inline-block">
                {t.ContactUs || "Contact Us"}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary rounded-full mt-2" />
              </h3>
              <ul className="space-y-4">
                <motion.li variants={itemVariants} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-gray-400 text-sm leading-relaxed flex-1">
                    302, Sai Shraddha Appt., Behind White House Bungalow, Utkarsh Society, Dabha-Wadi Road, Nagpur - 440023
                  </span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <a href="tel:+919494942894" className="text-gray-400 hover:text-primary transition-colors block">
                      +91 94949 42894
                    </a>
                    <a href="tel:+917888028866" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      +91 78880 28866
                    </a>
                  </div>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <a href="mailto:info@saraswatinagri.com" className="text-gray-400 hover:text-primary transition-colors">
                    {t.mail || "info@saraswatinagri.com"}
                  </a>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-gray-400 text-sm">
                    <div>Mon - Fri: 9:00 AM - 6:00 PM</div>
                    <div>Sat: 10:00 AM - 4:00 PM</div>
                    <div className="text-red-400">Sun: Closed</div>
                  </div>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-gray-700 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} {t.footer || "Nagpur Properties. All rights reserved."}
              </p>
              {/* <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/sitemap" className="text-gray-400 hover:text-primary transition-colors">
                  Sitemap
                </Link>
              </div> */}
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}

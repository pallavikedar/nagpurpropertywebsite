"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  FileText, 
  Shield, 
  Scale, 
  Building2, 
  Gavel,
  Users,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin,
  Send,
  Loader2,
  ChevronRight,
  Star,
  Briefcase,
  BookOpen,
  Heart,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/app/baseurl";
import { useLanguage } from "@/context/language-context";

export default function LegalConsultancyPage() {
  const { translations } = useLanguage();
  const t = translations;
  
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    requredService: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch(`${BASE_URL}/Enquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setSubmitStatus("success");
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        requredService: "",
        message: "",
      });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const legalServices = [
    {
      icon: FileText,
      title: t.PropertyDocumentation,
      description: t.Weensureallyourpropertydocumentsarelegallyverifiedandinorderprotectingyoufromfuturedisputes,
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: Shield,
      title: t.TitleVerification,
      description: t.Ourexpertsthoroughlyverifypropertytitlestoensuretheyareclearandfreefromanyencumbrances,
      gradient: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      icon: Scale,
      title: t.AgreementDrafting,
      description: t.Wedraftlegallysoundagreementsforsalepurchaseleaseandotherpropertytransactions,
      gradient: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: Building2,
      title: t.LegalCompliance,
      description: t.Weensureyourpropertytransactionscomplywithallrelevantlawsandregulations,
      gradient: "from-orange-500 to-red-500",
      delay: 0.4
    },
    {
      icon: Gavel,
      title: t.DisputeResolution,
      description: t.Ourlegalexpertshelpresolvepropertyrelateddisputesefficientlyandeffectively,
      gradient: "from-indigo-500 to-purple-500",
      delay: 0.5
    },
  ];

  const stats = [
    { value: "15+", label: t.YearsofExperience, icon: Award, color: "from-blue-500 to-cyan-500" },
    { value: "500+", label: t.SatisfiedClients, icon: Users, color: "from-purple-500 to-pink-500" },
    { value: "100%", label: t.LegalCompliance, icon: Shield, color: "from-green-500 to-emerald-500" },
    { value: "24/7", label: "Support Available", icon: Clock, color: "from-orange-500 to-red-500" },
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      position: "Homeowner",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "Excellent legal services! They helped me verify property documents and saved me from a potential fraud.",
      rating: 5
    },
    {
      name: "Priya Patel",
      position: "Real Estate Investor",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "Professional team with deep knowledge of property laws. Highly recommended for any property transaction.",
      rating: 5
    },
    {
      name: "Amit Kumar",
      position: "Business Owner",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      text: "Their agreement drafting service is top-notch. Very thorough and detail-oriented approach.",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center transform scale-105"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920&auto=format&fit=crop')",
                backgroundPosition: "center",
              }}
            />
          </div>
          
          <div className="container relative z-20 px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg px-6 py-2">
                Legal Expertise You Can Trust
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {t.LegalConsultancyServices}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                {t.expertlegaladvice}
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8">
                  Schedule Consultation
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-8">
                  Learn More
                </Button>
              </div> */}
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                Our Services
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {t.OurLegalServices}
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive legal solutions for all your property needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {legalServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: service.delay }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${service.gradient} group-hover:w-2 transition-all duration-300`} />
                    <div className="p-8">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                      <Button variant="link" className="mt-4 p-0 text-primary">
                        Learn More
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form and Information Section */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
          <div className="container px-4 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                    Get in Touch
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    {t.EnquireforLegalConsultancy}
                  </h2>
                  <p className="text-lg text-gray-600">
                    Fill out the form and our legal experts will get back to you within 24 hours
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Phone Number</p>
                      <a href="tel:+919494942894" className="text-gray-600 hover:text-primary transition-colors">
                        +91 94949 42894
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Address</p>
                      <a href="mailto:legal@saraswatinagri.com" className="text-gray-600 hover:text-primary transition-colors">
                        legal@saraswatinagri.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Office Address</p>
                      <p className="text-gray-600">
                        302, Sai Shraddha Appt., Behind White House Bungalow,<br />
                        Utkarsh Society, Dabha-Wadi Road, Nagpur - 440023
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Choose Us Preview */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Why Choose Us?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(0, 3).map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-primary/70 p-6">
                  <h3 className="text-2xl font-bold text-white">Request a Consultation</h3>
                  <p className="text-primary-foreground/90 mt-2">Fill in your details and we'll get back to you</p>
                </div>
                
                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-gray-700 font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullname')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your full name"
                        className={`transition-all duration-300 ${focusedField === 'fullname' ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your phone number"
                        className={`transition-all duration-300 ${focusedField === 'phone' ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email address"
                      className={`transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requredService" className="text-gray-700 font-medium">
                      Service Required <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="requredService"
                      name="requredService"
                      value={formData.requredService}
                      onChange={handleChange}
                      className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="documentation">{t.PropertyDocumentation}</option>
                      <option value="title">{t.TitleVerification}</option>
                      <option value="agreement">{t.AgreementDrafting}</option>
                      <option value="compliance">{t.LegalCompliance}</option>
                      <option value="dispute">{t.DisputeResolution}</option>
                      <option value="other">{t.Other}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      Your Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Please describe your legal requirements"
                      rows={5}
                      className={`transition-all duration-300 resize-none ${focusedField === 'message' ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                      required
                    />
                  </div>

                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                      >
                        ✓ Enquiry submitted successfully! We'll contact you soon.
                      </motion.div>
                    )}
                    
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                      >
                        ✗ Something went wrong. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary/70 hover:shadow-lg transition-all duration-300 text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t.SubmitEnquiry}
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              backgroundRepeat: "repeat",
            }} />
          </div>
          
          <div className="container relative z-10 px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-white/90 text-sm md:text-base">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-lg text-gray-600">Trusted by hundreds of satisfied clients</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
                  <div className="mt-4 flex justify-end">
                    <MessageCircle className="w-5 h-5 text-primary/50" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Need Legal Assistance?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Get expert legal advice for your property matters today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button size="lg" className="bg-gradient-to-r from-primary to-primary/70 text-lg px-8">
                  Schedule Free Consultation
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button> */}
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Call Now: +91 94949 42894
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
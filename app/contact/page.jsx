// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   MdPhone,
//   MdEmail,
//   MdLocationOn,
//   MdAccessTime,
//   MdSend,
//   MdCheckCircle,
//   MdError,
//   MdChat,
//   MdPhoneInTalk,
//   MdArrowForward,
//   MdVerified,
//   MdBusiness,
//   MdSchedule,
//   MdRoom,
// } from "react-icons/md";
// import { 
//   FaWhatsapp, 
//   FaLinkedinIn, 
//   FaYoutube, 
//   FaQuestionCircle, 
//   FaFacebookF, 
//   FaInstagram, 
//   FaTwitter,
//   FaBuilding,
//   FaHome,
//   FaHandshake,
// } from "react-icons/fa";
// import { HiOutlineMail } from "react-icons/hi";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import styles from "./Contact.module.css";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState("idle"); // Remove TypeScript syntax
//   const [errorMessage, setErrorMessage] = useState("");

//   // Remove TypeScript type annotation
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus("idle");
//     setErrorMessage("");

//     try {
//       // Simulate API call - Replace with actual API endpoint
//       const response = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error("Failed to send message");

//       setSubmitStatus("success");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//       });
//       setTimeout(() => setSubmitStatus("idle"), 5000);
//     } catch (error) {
//       setSubmitStatus("error");
//       setErrorMessage("Failed to send message. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const contactInfo = [
//     {
//       icon: <MdPhone className={styles.icon} />,
//       title: "Phone Numbers",
//       gradient: "gradientPurple",
//       details: [
//         { text: "+91 9494942894", link: "tel:+919494942894", icon: <MdPhone /> },
//         // { text: "+91 7888028866", link: "tel:+917888028866", icon: <MdPhone /> },
//       ],
//       whatsapp: "+91 9494942894",
//     },
//     {
//       icon: <MdLocationOn className={styles.icon} />,
//       title: "Office Address",
//       gradient: "gradientBlue",
//       details: [
//         { text: "302, Sai Shraddha Appt." },
//         { text: "Behind White House Bungalow," },
//         { text: "Utkarsh Society, Dabha-Wadi Road," },
//         { text: "Nagpur - 440023" },
//       ],
//     },
//     {
//       icon: <MdEmail className={styles.icon} />,
//       title: "Email Us",
//       gradient: "gradientRed",
//       details: [{ text: "info@saraswatinagri.com", link: "mailto:info@saraswatinagri.com", icon: <HiOutlineMail /> }],
//     },
//     {
//       icon: <MdAccessTime className={styles.icon} />,
//       title: "Business Hours",
//       gradient: "gradientOrange",
//       details: [
//         { text: "Mon - Fri: 9:00 AM - 6:00 PM" },
//         { text: "Sat: 10:00 AM - 4:00 PM" },
//         { text: "Sunday: Closed", className: "closedDay" },
//       ],
//     },
//   ];

//   const whyChooseUs = [
//     {
//       icon: <MdVerified />,
//       title: "Trusted by Thousands",
//       description: "Over 5000+ happy customers and counting",
//       color: "#10b981",
//     },
//     {
//       icon: <FaHandshake />,
//       title: "Expert Guidance",
//       description: "Professional advice at every step",
//       color: "#3b82f6",
//     },
//     {
//       icon: <MdSchedule />,
//       title: "Quick Response",
//       description: "Average response time under 2 hours",
//       color: "#f59e0b",
//     },
//     {
//       icon: <FaBuilding />,
//       title: "Wide Property Range",
//       description: "500+ properties available",
//       color: "#8b5cf6",
//     },
//   ];

//   const faqs = [
//     {
//       question: "What types of properties do you offer?",
//       answer: "We offer a wide range of properties including residential apartments, independent houses, luxury villas, commercial spaces, and plots for development.",
//     },
//     {
//       question: "How can I schedule a property visit?",
//       answer: "You can schedule a property visit by filling out the contact form, calling us directly, or sending us an email. Our team will get back to you within 24 hours to arrange a convenient time.",
//     },
//     {
//       question: "Do you offer property management services?",
//       answer: "Yes, we offer comprehensive property management services including tenant finding, rent collection, maintenance, and property upkeep.",
//     },
//     {
//       question: "What are your service charges?",
//       answer: "Our service charges vary depending on the type of property and services required. Please contact us for a detailed quote tailored to your specific needs.",
//     },
//     {
//       question: "Is there any consultation fee?",
//       answer: "Initial consultation is completely free. We believe in building long-term relationships with our clients.",
//     },
//     {
//       question: "How do I verify property ownership?",
//       answer: "We verify all legal documents and property ownership before listing. All our properties come with clear titles and necessary approvals.",
//     },
//   ];

//   return (
//     <div className={styles.contactPage}>
//       <Navbar />

//       {/* Hero Section */}
//       <div className={styles.heroSection}>
//         <div className={styles.heroOverlay} />
//         <div className={styles.heroContent}>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className={styles.heroInner}
//           >
//             <Badge className={styles.heroBadge}>Get in Touch</Badge>
//             <h1 className={styles.heroTitle}>Contact Us</h1>
//             <p className={styles.heroDescription}>
//               We'd love to hear from you. Whether you have a question about properties, 
//               pricing, or anything else, our team is ready to answer all your questions.
//             </p>
//             {/* <div className={styles.heroBreadcrumb}>
//               <a href="/">Home</a>
//               <MdArrowForward className={styles.breadcrumbArrow} />
//               <span>Contact Us</span>
//             </div> */}
//           </motion.div>
//         </div>
//       </div>

//       {/* Contact Info Cards */}
//       <div className={styles.infoSection}>
//         <div className={styles.container}>
//           <div className={styles.infoGrid}>
//             {contactInfo.map((info, index) => (
//               <motion.div
//                 key={index}
//                 className={`${styles.infoCard} ${styles[info.gradient]}`}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ y: -8 }}
//               >
//                 <div className={styles.cardIconWrapper}>
//                   {info.icon}
//                 </div>
//                 <h3 className={styles.cardTitle}>{info.title}</h3>
//                 <div className={styles.cardContent}>
//                   {info.details.map((detail, idx) => (
//                     detail.link ? (
//                       <a 
//                         key={idx}
//                         href={detail.link}
//                         className={`${styles.contactLink} ${detail.icon ? styles.withIcon : ''}`}
//                       >
//                         {detail.icon && <span className={styles.linkIcon}>{detail.icon}</span>}
//                         {detail.text}
//                       </a>
//                     ) : (
//                       <p key={idx} className={detail.className ? styles[detail.className] : ""}>
//                         {detail.text}
//                       </p>
//                     )
//                   ))}
//                   {info.whatsapp && (
//                     <a 
//                       href={`https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className={styles.whatsappLink}
//                     >
//                       <FaWhatsapp />
//                       <span>Chat on WhatsApp</span>
//                     </a>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Why Choose Us Section */}
//       <div className={styles.whyChooseSection}>
//         <div className={styles.container}>
//           <motion.div
//             className={styles.whyChooseWrapper}
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <div className={styles.sectionHeader}>
//               <h2 className={styles.sectionTitle}>Why Choose Us</h2>
//               <p className={styles.sectionSubtitle}>
//                 We make property transactions smooth and hassle-free
//               </p>
//             </div>
//             <div className={styles.whyChooseGrid}>
//               {whyChooseUs.map((item, index) => (
//                 <motion.div
//                   key={index}
//                   className={styles.whyChooseCard}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   viewport={{ once: true }}
//                   whileHover={{ y: -5 }}
//                 >
//                   <div className={styles.whyChooseIcon} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
//                     {item.icon}
//                   </div>
//                   <h3 className={styles.whyChooseTitle}>{item.title}</h3>
//                   <p className={styles.whyChooseDescription}>{item.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Contact Form & Quick Info Section */}
//       <div className={styles.formSection}>
//         <div className={styles.container}>
//           <div className={styles.formGrid}>
         
            
//             <motion.div
//               className={styles.infoWrapper}
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <div className={styles.quickContact}>
//                 <h3 className={styles.infoTitle}>Quick Contact</h3>
//                 <div className={styles.quickContactItems}>
//                   <div className={styles.quickContactItem}>
//                     <div className={styles.quickIcon}>
//                       <MdChat />
//                     </div>
//                     <div>
//                       <p className={styles.quickLabel}>24/7 Customer Support</p>
//                       <p className={styles.quickText}>Our team is always ready to help you</p>
//                     </div>
//                   </div>
//                   <div className={styles.quickContactItem}>
//                     <div className={`${styles.quickIcon} ${styles.whatsappIcon}`}>
//                       <FaWhatsapp />
//                     </div>
//                     <div>
//                       <p className={styles.quickLabel}>WhatsApp Us</p>
//                       <a href="https://wa.me/919494942894" className={styles.quickLink}>
//                         Click here to chat on WhatsApp
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
// </motion.div>
// <motion.div
//               className={styles.infoWrapper}
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <div className={styles.emergencyContact}>
//                 <div className={styles.emergencyIcon}>
//                   <MdPhoneInTalk />
//                 </div>
//                 <h3 className={styles.emergencyTitle}>Emergency Contact</h3>
//                 <p className={styles.emergencyText}>For urgent matters, call us directly:</p>
//                 <a href="tel:+919494942894" className={styles.emergencyPhone}>
//                   +91 9494942894
//                 </a>
//                 <p className={styles.emergencyNote}>Available 24/7 for emergencies</p>
//               </div>
// </motion.div>
// <motion.div
//               className={styles.infoWrapper}
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <div className={styles.responseTime}>
//                 <div className={styles.responseIcon}>
//                   <MdSchedule />
//                 </div>
                
//                 <h3 className={styles.responseTitle}>Response Time</h3>
//                 <div className={styles.responseBar}>
//                   <div className={styles.responseFill}></div>
//                 </div>
//                 <p className={styles.responseText}>Average response time: Under 2 hours</p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Map Section */}
//       <div className={styles.mapSection}>
//         <div className={styles.container}>
//           <motion.div
//             className={styles.mapWrapper}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <div className={styles.mapHeader}>
//               <MdRoom className={styles.mapHeaderIcon} />
//               <h2 className={styles.sectionTitle}>Find Us Here</h2>
//               <p className={styles.sectionSubtitle}>
//                 Visit our office for a face-to-face consultation. We'd love to meet you!
//               </p>
//               <div className={styles.locationBadge}>
//                 <MdLocationOn />
//                 <span>Nagpur, Maharashtra</span>
//               </div>
//             </div>
//             <div className={styles.mapContainer}>
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3720.637619819438!2d79.01232299999995!3d21.166815000000085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSai%20Shraddha%20Apt.%2C%20Behind%20White%20House%20Bungalow%2C%20Utkarsh%20Society%2C%20Dabha-Wadi%20Road%2C%20Nagpur!5e0!3m2!1sen!2sus!4v1749541710264!5m2!1sen!2sus"
//                 className={styles.mapIframe}
//                 allowFullScreen
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//                 title="Office Location Map"
//               />
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* FAQ Section */}
//       <div className={styles.faqSection}>
//         <div className={styles.container}>
//           <motion.div
//             className={styles.faqWrapper}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <div className={styles.faqHeader}>
//               <FaQuestionCircle className={styles.faqIcon} />
//               <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
//               <p className={styles.sectionSubtitle}>
//                 Find answers to common questions about our services
//               </p>
//             </div>
//             <div className={styles.faqGrid}>
//               {faqs.map((faq, index) => (
//                 <motion.div
//                   key={index}
//                   className={styles.faqItem}
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
//                   viewport={{ once: true }}
//                   whileHover={{ x: 8 }}
//                 >
//                   <h4 className={styles.faqQuestion}>{faq.question}</h4>
//                   <p className={styles.faqAnswer}>{faq.answer}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className={styles.ctaSection}>
//         <div className={styles.container}>
//           <motion.div
//             className={styles.ctaWrapper}
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <div className={styles.ctaContent}>
//               <h3 className={styles.ctaTitle}>Ready to Find Your Dream Property?</h3>
//               <p className={styles.ctaText}>
//                 Let us help you find the perfect property that matches your needs and budget.
//               </p>
//               <div className={styles.ctaButtons}>
//                 <a href="/properties" className={styles.ctaButton}>
//                   Browse Properties
//                   <MdArrowForward />
//                 </a>
                
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Contact;




"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdAccessTime,
  MdChat,
  MdPhoneInTalk,
  MdArrowForward,
  MdVerified,
  MdSchedule,
  MdRoom,
} from "react-icons/md";
import {
  FaWhatsapp,
  FaQuestionCircle,
  FaBuilding,
  FaHandshake,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/context/language-context";
import styles from "./Contact.module.css";

const Contact = () => {
  const { translations } = useLanguage();
  const t = translations.contact;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // "idle" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyChooseMeta = [
    { icon: <MdVerified />, color: "#10b981" },
    { icon: <FaHandshake />, color: "#3b82f6" },
    { icon: <MdSchedule />, color: "#f59e0b" },
    { icon: <FaBuilding />, color: "#8b5cf6" },
  ];

  const contactInfo = [
    {
      icon: <MdPhone className={styles.icon} />,
      title: t.phoneTitle,
      gradient: "gradientPurple",
      details: [
        { text: "+91 9494942894", link: "tel:+919494942894", icon: <MdPhone /> },
      ],
      whatsapp: "919494942894",
    },
    {
      icon: <MdLocationOn className={styles.icon} />,
      title: t.addressTitle,
      gradient: "gradientBlue",
      details: t.addressLines.map((line) => ({ text: line })),
    },
    {
      icon: <MdEmail className={styles.icon} />,
      title: t.emailTitle,
      gradient: "gradientRed",
      details: [
        {
          text: "info@saraswatinagri.com",
          link: "mailto:info@saraswatinagri.com",
          icon: <HiOutlineMail />,
        },
      ],
    },
    {
      icon: <MdAccessTime className={styles.icon} />,
      title: t.hoursTitle,
      gradient: "gradientOrange",
      details: t.hoursLines.map((h) => ({
        text: h.text,
        className: h.closed ? "closedDay" : "",
      })),
    },
  ];

  return (
    <div className={styles.contactPage}>
      <Navbar />

      {/* ── Hero ── */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroInner}
          >
            <Badge className={styles.heroBadge}>{t.heroBadge}</Badge>
            <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
            <p className={styles.heroDescription}>{t.heroDescription}</p>
          </motion.div>
        </div>
      </div>

      {/* ── Contact Info Cards ── */}
      <div className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className={`${styles.infoCard} ${styles[info.gradient]}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.cardIconWrapper}>{info.icon}</div>
                <h3 className={styles.cardTitle}>{info.title}</h3>
                <div className={styles.cardContent}>
                  {info.details.map((detail, idx) =>
                    detail.link ? (
                      <a
                        key={idx}
                        href={detail.link}
                        className={`${styles.contactLink} ${detail.icon ? styles.withIcon : ""}`}
                      >
                        {detail.icon && (
                          <span className={styles.linkIcon}>{detail.icon}</span>
                        )}
                        {detail.text}
                      </a>
                    ) : (
                      <p
                        key={idx}
                        className={detail.className ? styles[detail.className] : ""}
                      >
                        {detail.text}
                      </p>
                    )
                  )}
                  {info.whatsapp && (
                    <a
                      href={`https://wa.me/${info.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappLink}
                    >
                      <FaWhatsapp />
                      <span>{t.chatWhatsApp}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className={styles.whyChooseSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.whyChooseWrapper}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.whyChooseTitle}</h2>
              <p className={styles.sectionSubtitle}>{t.whyChooseSubtitle}</p>
            </div>
            <div className={styles.whyChooseGrid}>
              {t.whyChooseItems.map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.whyChooseCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={styles.whyChooseIcon}
                    style={{
                      backgroundColor: `${whyChooseMeta[index].color}15`,
                      color: whyChooseMeta[index].color,
                    }}
                  >
                    {whyChooseMeta[index].icon}
                  </div>
                  <h3 className={styles.whyChooseTitle}>{item.title}</h3>
                  <p className={styles.whyChooseDescription}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Quick Contact / Emergency / Response Time ── */}
      <div className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formGrid}>

            {/* Quick Contact */}
            <motion.div
              className={styles.infoWrapper}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={styles.quickContact}>
                <h3 className={styles.infoTitle}>{t.quickContactTitle}</h3>
                <div className={styles.quickContactItems}>
                  <div className={styles.quickContactItem}>
                    <div className={styles.quickIcon}>
                      <MdChat />
                    </div>
                    <div>
                      <p className={styles.quickLabel}>{t.support24Label}</p>
                      <p className={styles.quickText}>{t.support24Text}</p>
                    </div>
                  </div>
                  <div className={styles.quickContactItem}>
                    <div className={`${styles.quickIcon} ${styles.whatsappIcon}`}>
                      <FaWhatsapp />
                    </div>
                    <div>
                      <p className={styles.quickLabel}>{t.whatsAppLabel}</p>
                      <a
                        href="https://wa.me/919494942894"
                        className={styles.quickLink}
                      >
                        {t.whatsAppLinkText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              className={styles.infoWrapper}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={styles.emergencyContact}>
                <div className={styles.emergencyIcon}>
                  <MdPhoneInTalk />
                </div>
                <h3 className={styles.emergencyTitle}>{t.emergencyTitle}</h3>
                <p className={styles.emergencyText}>{t.emergencyText}</p>
                <a href="tel:+919494942894" className={styles.emergencyPhone}>
                  +91 9494942894
                </a>
                <p className={styles.emergencyNote}>{t.emergencyNote}</p>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              className={styles.infoWrapper}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={styles.responseTime}>
                <div className={styles.responseIcon}>
                  <MdSchedule />
                </div>
                <h3 className={styles.responseTitle}>{t.responseTitle}</h3>
                <div className={styles.responseBar}>
                  <div className={styles.responseFill}></div>
                </div>
                <p className={styles.responseText}>{t.responseText}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <div className={styles.mapSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.mapWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.mapHeader}>
              <MdRoom className={styles.mapHeaderIcon} />
              <h2 className={styles.sectionTitle}>{t.mapTitle}</h2>
              <p className={styles.sectionSubtitle}>{t.mapSubtitle}</p>
              <div className={styles.locationBadge}>
                <MdLocationOn />
                <span>{t.mapLocation}</span>
              </div>
            </div>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3720.637619819438!2d79.01232299999995!3d21.166815000000085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSai%20Shraddha%20Apt.%2C%20Behind%20White%20House%20Bungalow%2C%20Utkarsh%20Society%2C%20Dabha-Wadi%20Road%2C%20Nagpur!5e0!3m2!1sen!2sus!4v1749541710264!5m2!1sen!2sus"
                className={styles.mapIframe}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.mapTitle}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className={styles.faqSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.faqWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.faqHeader}>
              <FaQuestionCircle className={styles.faqIcon} />
              <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
              <p className={styles.sectionSubtitle}>{t.faqSubtitle}</p>
            </div>
            <div className={styles.faqGrid}>
              {t.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
                  viewport={{ once: true }}
                  whileHover={{ x: 8 }}
                >
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.ctaContent}>
              <h3 className={styles.ctaTitle}>{t.ctaTitle}</h3>
              <p className={styles.ctaText}>{t.ctaText}</p>
              <div className={styles.ctaButtons}>
                <a href="/properties" className={styles.ctaButton}>
                  {t.ctaBrowse}
                  <MdArrowForward />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
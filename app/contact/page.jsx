
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
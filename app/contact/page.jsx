"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MdOutlineContactPhone,
  MdOutlineLocationOn,
  MdOutlineEmail,
  MdAccessTime,
} from "react-icons/md";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const Contact = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="shadow-md z-50">
        <Navbar />
      </div>

      {/* Banner */}
      <motion.div
        className="relative w-full flex items-center justify-center text-center text-white overflow-hidden mb-16"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }}
        style={{ height: '200px' }}
      >
        <div
          className="absolute inset-0 bg-black/40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <motion.div variants={fadeUp} className="relative px-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">Contact Us</h1>
          <p className="mt-3 text-lg md:text-xl">
            <a href="/" className="underline hover:text-gray-200">Home</a> | <span>Contact Us</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-16 py-16 space-y-32">
        {/* Map Section */}
       

        {/* Contact Info Section */}
        <section className="w-full">
          <h2 className="text-3xl font-semibold mb-12 text-center text-gray-800">Contact Information</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              {
                icon: <MdOutlineContactPhone className="text-5xl text-green-600 mb-4" />,
                title: "Phone Numbers",
                content: (
                  <>
                    <p><a href="https://wa.me/91982338866" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600">📞 9823388866</a></p>
                    <p><a href="https://wa.me/917888028866" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600">📞 7888028866</a></p>
                  </>
                )
              },
              {
                icon: <MdOutlineLocationOn className="text-5xl text-blue-600 mb-4" />,
                title: "Office Address",
                content: (
                  <>
                    <p>302, Sai Shraddha Appt.</p>
                    <p>Behind White House Bungalow, Utkarsh Society</p>
                    <p>Dabha-Wadi Road, Nagpur</p>
                  </>
                )
              },
              {
                icon: <MdOutlineEmail className="text-5xl text-red-500 mb-4" />,
                title: "Email Us",
                content: <p><a href="mailto:info@saraswatinagri.com" className="text-gray-700 hover:text-red-500">📧 info@saraswatinagri.com</a></p>
              },
              {
                icon: <MdAccessTime className="text-5xl text-yellow-500 mb-4" />,
                title: "Business Hours",
                content: (
                  <>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p>Sat: 10:00 AM - 4:00 PM</p>
                    <p>Sun: Closed</p>
                  </>
                )
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center hover:shadow-3xl transition duration-300"
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                {card.icon}
                <h3 className="font-semibold mb-4 text-xl">{card.title}</h3>
                {card.content}
              </motion.div>
            ))}
          </motion.div>
        </section>
         <section className="w-full">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Our Location</h2>
          <motion.div
            className="w-full h-[450px] md:h-[500px] lg:h-[550px] rounded-3xl shadow-2xl overflow-hidden mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3720.637619819438!2d79.01232299999995!3d21.166815000000085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSai%20Shraddha%20Apt.%2C%20Behind%20White%20House%20Bungalow%2C%20Utkarsh%20Society%2C%20Dabha-Wadi%20Road%2C%20Nagpur!5e0!3m2!1sen!2sus!4v1749541710264!5m2!1sen!2sus"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <div className="bg-gray-100 mt-24 shadow-inner">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;

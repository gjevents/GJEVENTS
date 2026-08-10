import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Seo from "@/components/ui/Seo";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import ComingSoon from "@/components/sections/ComingSoon";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contect";
import CTA from "@/components/sections/CTA";

const ROUTE_SECTIONS = {
  "/about": "about",
  "/events": "gallery",
  "/services": "services",
  "/collaborate": "coming-soon",
  "/contact": "contact"
};

export default function Home() {
  const { pathname } = useLocation();

  useEffect(() => {
    const sectionId = ROUTE_SECTIONS[pathname];
    if (!sectionId) return;
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname]);

  return (
    <>
      <Seo />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Hero />
        <About />
        <Services />
        <ComingSoon />
        <Gallery />
        <Contact />
        <CTA />
        <Footer />
      </motion.main>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Seo from "@/components/ui/Seo";
import SplashScreen from "@/components/layout/SplashScreen";
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
  const [ready, setReady] = useState(false);
  const { pathname } = useLocation();

  // Play the cinematic splash once per browser session.
  useEffect(() => {
    const seen = sessionStorage.getItem("gj_splash");
    if (seen) {
      setReady(true);
      return;
    }
    sessionStorage.setItem("gj_splash", "1");
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      document.body.style.overflow = "";
    }, 5200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const sectionId = ROUTE_SECTIONS[pathname];
    if (!sectionId) return;
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname, ready]);

  if (!ready) {
    return (
      <>
        <Seo />
        <SplashScreen onDone={() => setReady(true)} />
      </>
    );
  }

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
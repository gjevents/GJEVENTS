import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

export default function Home() {
  const [ready, setReady] = useState(false);

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
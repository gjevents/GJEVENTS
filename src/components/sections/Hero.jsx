import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HERO_SLIDES, B2B_PORTAL_URL } from "@/utils/constants";
import { apiUrl, mediaUrl, parseApiResponse } from "@/lib/siteApi";

const SLIDE_MS = 4200;

// Magnetic B2B portal button.
function MagneticButton({ text = "Open B2B Portal", href = B2B_PORTAL_URL, textColor, backgroundColor }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * 0.3);
    y.set(dy * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href || B2B_PORTAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="group inline-flex items-center gap-2 rounded-full bg-saffron-gradient px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-royal shadow-[0_18px_40px_-12px_rgba(212,175,55,0.6)]"
      style={{ x: sx, y: sy, color: textColor, background: backgroundColor }}
    >
      {text}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

const fallbackSlides = HERO_SLIDES.map((slide, index) => ({
  id: slide.id,
  image: slide.image,
  label_text: slide.label,
  heading_line_1: "Experience Events",
  heading_line_2: "Like Never Before",
  description: "Professional Event Management | Premium Pass Distribution | Business Opportunities | Stall Bazaar",
  button_1_text: "Explore More",
  button_1_link: "#about",
  button_2_text: "Open B2B Portal",
  button_2_link: B2B_PORTAL_URL,
  label_color: "#D4AF37",
  heading_color: "#FFF8E7",
  secondary_heading_color: "#D4AF37",
  description_color: "#FFF8E7",
  button_text_color: "#3D2B1F",
  button_background_color: "#D4AF37",
  label_font_size: 12,
  heading_font_size: 88,
  description_font_size: 18,
  text_alignment: "center",
  text_position_x: 50,
  text_position_y: 50,
  display_order: index + 1,
}));

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch(apiUrl("/api/hero-slides/"));
        const payload = await parseApiResponse(response, "Unable to load hero slides.");
        if (response.ok && payload.length) {
          setSlides(payload.map((slide) => ({ ...slide, image: mediaUrl(slide.image) })));
          setIndex(0);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index] || fallbackSlides[0];
  const handlePrimaryClick = () => {
    if (!slide.button_1_link || slide.button_1_link.startsWith("#")) {
      document.querySelector(slide.button_1_link || "#about")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.location.href = slide.button_1_link;
  };

  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          {slides.map(
            (slide, i) =>
              i === index && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={slide.image}
                    alt={`GJ Events ${slide.label_text}`}
                    className="h-full w-full scale-105 object-cover animate-kenburns"
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-inkbrown/70 via-inkbrown/55 to-inkbrown/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.18),transparent_60%)]" />

      <div
        className="relative z-10 flex h-full px-6"
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: slide.text_alignment,
        }}
      >
        <div
          className="absolute flex max-w-5xl flex-col items-center"
          style={{
            left: `${slide.text_position_x}%`,
            top: `${slide.text_position_y}%`,
            transform: "translate(-50%, -50%)",
            alignItems: slide.text_alignment === "left" ? "flex-start" : slide.text_alignment === "right" ? "flex-end" : "center",
          }}
        >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex items-center gap-3 uppercase tracking-[0.35em] text-golden"
          style={{ color: slide.label_color, fontSize: `${slide.label_font_size}px` }}
        >
          <span className="h-px w-10 bg-golden/60" />
          {slide.label_text}
          <span className="h-px w-10 bg-golden/60" />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-bold leading-[1.05] text-cream sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ color: slide.heading_color, fontSize: `clamp(3rem, ${slide.heading_font_size / 16}vw, ${slide.heading_font_size}px)` }}
        >
          {slide.heading_line_1}
          <br />
          <span className="text-gradient-gold" style={{ color: slide.secondary_heading_color, backgroundImage: "none" }}>{slide.heading_line_2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 max-w-2xl text-base text-cream/80 sm:text-lg"
          style={{ color: slide.description_color, fontSize: `${slide.description_font_size}px` }}
        >
          {slide.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
        >
          <button
            onClick={handlePrimaryClick}
            className="inline-flex items-center gap-2 rounded-full border border-golden/50 px-8 py-3.5 text-sm uppercase tracking-[0.18em] text-cream transition-colors hover:bg-golden/10"
          >
            {slide.button_1_text}
            <ArrowDown className="h-4 w-4" />
          </button>
          <MagneticButton text={slide.button_2_text} href={slide.button_2_link} textColor={slide.button_text_color} backgroundColor={slide.button_background_color} />
        </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 h-1 w-full bg-cream/10">
        <motion.div
          key={index}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
          className="h-full bg-gradient-to-r from-heritage via-golden to-heritage"
        />
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HERO_SLIDES, B2B_PORTAL_URL } from "@/utils/constants";

const SLIDE_MS = 4200;

// Magnetic B2B portal button — drifts toward the cursor.
function MagneticButton() {
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
      href={B2B_PORTAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="group inline-flex items-center gap-2 rounded-full bg-saffron-gradient px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-royal shadow-[0_18px_40px_-12px_rgba(212,175,55,0.6)]"
    >
      Open B2B Portal
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  const scrollToAbout = () =>
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden">
      {/* Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          {HERO_SLIDES.map(
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
                    alt={`GJ Event ${slide.label}`}
                    className="h-full w-full scale-105 object-cover animate-kenburns"
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-inkbrown/70 via-inkbrown/55 to-inkbrown/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.18),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-golden"
        >
          <span className="h-px w-10 bg-golden/60" />
          {HERO_SLIDES[index].label}
          <span className="h-px w-10 bg-golden/60" />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-bold leading-[1.05] text-cream sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Experience Events
          <br />
          <span className="text-gradient-gold">Like Never Before</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 max-w-2xl text-base text-cream/80 sm:text-lg"
        >
          Professional Event Management · Premium Pass Distribution · Business
          Opportunities · Stall Bazaar
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
        >
          <button
            onClick={scrollToAbout}
            className="inline-flex items-center gap-2 rounded-full border border-golden/50 px-8 py-3.5 text-sm uppercase tracking-[0.18em] text-cream transition-colors hover:bg-golden/10"
          >
            Explore More
            <ArrowDown className="h-4 w-4" />
          </button>
          <MagneticButton />
        </motion.div>
      </div>

      {/* Gold progress bar */}
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
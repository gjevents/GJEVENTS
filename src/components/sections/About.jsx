import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Sparkles, Eye, Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { ABOUT_IMAGE } from "@/utils/constants";

const PILLARS = [
  { icon: Eye, title: "Our Vision", text: "To redefine how India experiences events — blending heritage with world-class technology." },
  { icon: Sparkles, title: "Our Mission", text: "Deliver flawless, memorable events with premium service and uncompromising quality." },
  { icon: Users, title: "Our Team", text: "A dedicated crew of planners, designers and coordinators driven by passion." },
  { icon: ShieldCheck, title: "Trust & Innovation", text: "Reliable execution today, futuristic platform tomorrow — built on a foundation of trust." }
];

const STATS = [
  { value: 250, suffix: "+", label: "Events Delivered" },
  { value: 15, suffix: "+", label: "Cities Reached" },
  { value: 50, suffix: "K+", label: "Happy Guests" },
  { value: 100, suffix: "%", label: "Commitment" }
];

// Animated counter that runs once when scrolled into view.
function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1600;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(start + (value - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function About() {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="relative mx-auto max-w-[120rem] px-6 py-28 md:px-12 md:py-40">
      {/* background serif texture */}
      <span className="pointer-events-none absolute left-0 top-10 select-none font-heading text-[18rem] leading-none text-royal/5">
        GJ
      </span>

      <SectionHeading
        eyebrow="About GJ Events"
        title={<>A Legacy of <span className="text-gradient-ember">Celebration</span></>}
        subtitle="GJ Events began with a simple belief — that every gathering deserves to be extraordinary. Today we orchestrate premium Garba nights, concerts, corporate events and stall bazaars, combining the warmth of Indian hospitality with the precision of global luxury."
      />

      <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
        {/* Image with parallax */}
        <div ref={imgRef} className="relative overflow-hidden rounded-3xl premium-shadow">
          <motion.img
            style={{ y, scale: 1.12 }}
            src={ABOUT_IMAGE}
            alt="GJ Events luxury event setup"
            className="h-[34rem] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inkbrown/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-5">
            <p className="font-heading text-xl text-royal">Crafting moments worth a crore.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Heritage modernism in every detail.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid gap-6 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card gilded-edge rounded-2xl p-6"
            >
              <p.icon className="h-8 w-8 text-heritage" />
              <h3 className="mt-4 font-heading text-2xl font-semibold text-royal">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-2 gap-8 rounded-3xl bg-heritage-gradient p-10 md:grid-cols-4 md:p-14">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-5xl font-bold text-gradient-gold md:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

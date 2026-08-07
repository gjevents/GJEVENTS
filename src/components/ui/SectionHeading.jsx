import React from "react";
import { motion } from "framer-motion";

// Elegant section heading with eyebrow, title and optional subtitle.
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${alignment} gap-4`}
    >
      {eyebrow && (
        <span
          className={`flex items-center gap-3 text-xs uppercase tracking-[0.3em] ${
            light ? "text-golden" : "text-heritage"
          }`}
        >
          <span className={`h-px w-10 ${light ? "bg-golden/60" : "bg-heritage/60"}`} />
          {eyebrow}
          {align === "center" && (
            <span className={`h-px w-10 ${light ? "bg-golden/60" : "bg-heritage/60"}`} />
          )}
        </span>
      )}
      <h2
        className={`font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] ${
          light ? "text-cream" : "text-royal"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl text-base md:text-lg leading-relaxed ${
            light ? "text-cream/70" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
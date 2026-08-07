import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";

// Shared legal layout: hero banner + glass content container + footer.
export default function LegalLayout({ title, eyebrow, children }) {
  return (
    <>
      <section className="relative overflow-hidden bg-heritage-gradient py-28 text-center md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.2),transparent_60%)]" />
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-golden"
          >
            {eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 font-heading text-5xl font-bold text-cream md:text-6xl"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-20 md:px-12">
        <div className="glass-card gilded-edge space-y-10 rounded-2xl p-8 md:p-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-golden/40 bg-cream/80 px-4 py-2 text-sm font-medium text-royal transition-colors hover:bg-cream"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Page
          </Link>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}

// Legal content block — heading + body paragraph.
export function Block({ heading, body }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-royal">{heading}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function LastUpdated() {
  return (
    <p className="text-sm text-muted-foreground">
      Last updated:{" "}
      {new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}
    </p>
  );
}
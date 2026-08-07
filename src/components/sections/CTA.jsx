import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { B2B_PORTAL_URL } from "@/utils/constants";

// Final CTA band redirecting to the B2B portal.
export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-saffron-gradient py-20 md:py-28">
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(45,27,8,0.4) 20px, rgba(45,27,8,0.4) 21px)"
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-heading text-4xl font-bold leading-tight text-royal sm:text-5xl md:text-6xl"
        >
          Ready to Collaborate?
        </motion.h2>
        <p className="mt-5 max-w-2xl text-lg text-royal/80">
          Step into the future of event business. Open the B2B portal and unlock stalls,
          passes, vendor registration and real-time analytics.
        </p>
        <motion.a
          href={B2B_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-royal px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-cream"
        >
          Open B2B Portal
          <ArrowUpRight className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
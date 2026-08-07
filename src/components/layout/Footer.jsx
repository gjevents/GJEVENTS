import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, Phone } from "lucide-react";
import { BRAND, B2B_PORTAL_URL, CONTACTS } from "@/utils/constants";

// High-density premium dark footer.
export default function Footer() {
  const { scrollYProgress } = useScroll();
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-nightbrown text-cream/70 overflow-hidden">
      {/* top golden line that grows with scroll */}
      <motion.div
        style={{ scaleX: grow }}
        className="absolute left-0 top-0 h-[2px] w-full origin-left bg-gradient-to-r from-heritage via-golden to-heritage"
      />

      <div className="mx-auto max-w-[120rem] px-6 py-20 md:px-12">
        <div className="grid gap-14 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-golden/40 bg-inkbrown/40 font-heading text-2xl font-bold text-gradient-gold">
                GJ
              </span>
              <span className="font-heading text-2xl font-bold text-cream">{BRAND.name}</span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              {BRAND.name} is a premium event management company crafting unforgettable
              Garba nights, concerts, corporate events and stall bazaars — building India's
              next-generation event platform.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-golden/80">
              Powered by {BRAND.poweredBy}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-cream">Explore</h3>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ["About", "#about"],
                ["Services", "#services"],
                ["Coming Soon", "#coming-soon"],
                ["Gallery", "#gallery"],
                ["Contact", "#contact"]
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-golden">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick contacts */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-cream">Reach Us</h3>
            <ul className="mt-6 space-y-3 text-sm">
              {CONTACTS.map((c) => (
                <li key={c.tel} className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-golden" />
                  <a href={`tel:${c.tel}`} className="transition-colors hover:text-golden">
                    {c.name} — {c.phone}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={B2B_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-golden/50 px-5 py-2 text-xs uppercase tracking-[0.2em] text-golden transition-colors hover:bg-golden/10"
            >
              Open B2B Portal
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="transition-colors hover:text-golden">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="transition-colors hover:text-golden">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-golden/50 bg-inkbrown/70 text-golden backdrop-blur-md transition-colors hover:bg-inkbrown"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </footer>
  );
}   
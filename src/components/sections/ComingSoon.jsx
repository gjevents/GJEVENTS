import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CreditCard, QrCode, Store, BarChart3, Ticket, Radio, Armchair, Smartphone, LayoutDashboard, BadgeCheck
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Particles from "@/components/ui/Particles";
import { B2B_PORTAL_URL } from "@/utils/constants";

const FEATURES = [
  { icon: CreditCard, label: "Online Pass Purchase" },
  { icon: Store, label: "Online Stall Booking" },
  { icon: QrCode, label: "QR Ticket Entry" },
  { icon: BadgeCheck, label: "Vendor Registration" },
  { icon: LayoutDashboard, label: "Business Dashboard" },
  { icon: BarChart3, label: "Real-Time Analytics" },
  { icon: Ticket, label: "Digital Pass" },
  { icon: Radio, label: "Live Event Updates" },
  { icon: Armchair, label: "Seat Booking" },
  { icon: Smartphone, label: "Mobile Experience" }
];

// Countdown to the platform launch.
function useCountdown(target) {
  const [remaining, setRemaining] = useState(() => target - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const clamp = Math.max(remaining, 0);
  const days = Math.floor(clamp / 86400000);
  const hours = Math.floor((clamp % 86400000) / 3600000);
  const mins = Math.floor((clamp % 3600000) / 60000);
  const secs = Math.floor((clamp % 60000) / 1000);
  return { days, hours, mins, secs };
}

export default function ComingSoon() {
  // Target: ~120 days from now, stable per render via ref.
  const targetRef = useRef(Date.now() + 1000 * 60 * 60 * 24 * 118);
  const { days, hours, mins, secs } = useCountdown(targetRef.current);

  // 3D digital pass flip on scroll
  const passRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: passRef, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-30, 0, 30]);

  const units = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: mins, l: "Minutes" },
    { v: secs, l: "Seconds" }
  ];

  return (
    <section
      id="coming-soon"
      className="relative overflow-hidden bg-heritage-gradient py-28 text-cream md:py-40"
    >
      {/* animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(230,126,34,0.5), transparent 50%), radial-gradient(circle at 80% 70%, rgba(212,175,55,0.4), transparent 50%)"
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <Particles count={20} />

      <div className="relative mx-auto max-w-[120rem] px-6 md:px-12">
        <SectionHeading
          eyebrow="The Future"
          light
          title={<>Something <span className="text-gradient-gold">BIG</span> is Coming</>}
          subtitle="GJ Events is building India's next-generation event platform — inspired by global event booking experiences, designed for the way India celebrates."
        />

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
          {/* Features + countdown */}
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                  className="flex items-center gap-3 rounded-xl glass-dark p-4"
                >
                  <f.icon className="h-6 w-6 shrink-0 text-golden" />
                  <span className="text-sm text-cream/90">{f.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Countdown */}
            <div className="mt-10 grid grid-cols-4 gap-3">
              {units.map((u) => (
                <div key={u.l} className="glass-dark rounded-2xl p-4 text-center">
                  <p className="font-heading text-4xl font-bold text-gradient-gold md:text-5xl tabular-nums">
                    {String(u.v).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream/60">
                    {u.l}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={B2B_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-saffron-gradient px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-royal"
            >
              Be an Early Partner
            </a>
          </div>

          {/* 3D digital pass */}
          <div ref={passRef} className="flex justify-center" style={{ perspective: 1200 }}>
            <motion.div
              style={{ rotateY }}
              className="relative h-72 w-full max-w-sm rounded-3xl glass-dark p-8 premium-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-3xl font-bold text-gradient-gold">GJ Events</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-cream/60">VIP Pass</span>
              </div>
              <p className="mt-8 text-sm text-cream/70">Admit One · Digital Pass</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Holder</p>
                  <p className="mt-1 font-heading text-lg text-cream">Future Guest</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-golden/40 bg-inkbrown/50">
                  <QrCode className="h-10 w-10 text-golden" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-cream/50">Scan to Enter</span>
                <span className="h-2 w-12 rounded-full bg-gradient-to-r from-heritage to-golden" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

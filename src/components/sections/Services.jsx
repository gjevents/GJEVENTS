import React from "react";
import { motion } from "framer-motion";
import { Ticket, Flame, CalendarDays, Building2, Store, Crown, Handshake } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const SERVICES = [
  { icon: Ticket, title: "Pass Distribution", text: "Premium passes managed and distributed with precision and exclusivity." },
  { icon: Flame, title: "Garba Events", text: "Soulful Garba nights engineered for energy, scale and tradition." },
  { icon: CalendarDays, title: "Event Planning", text: "End-to-end planning — concept, logistics and flawless execution." },
  { icon: Building2, title: "Corporate Events", text: "Sophisticated corporate gatherings that elevate your brand." },
  { icon: Store, title: "Stall Bazaar", text: "Curated bazaars connecting businesses with thriving crowds." },
  { icon: Crown, title: "VIP Management", text: "White-glove VIP experiences for guests who expect the finest." },
  { icon: Handshake, title: "Business Collaboration", text: "Partnership opportunities that grow brands alongside celebrations." }
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative mx-auto max-w-[120rem] px-6 py-28 md:px-12 md:py-40"
    >
      <SectionHeading
        eyebrow="What We Do"
        title={<>Premium Services, <span className="text-gradient-ember">Crafted</span></>}
        subtitle="From intimate gatherings to grand-scale festivals, every service is delivered with the same obsession for detail and premium quality."
      />

      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-2xl glass-card gilded-edge p-8"
          >
            {/* hover glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-golden/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-saffron-gradient text-royal shadow-lg">
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="relative mt-6 font-heading text-2xl font-semibold text-royal">
              {s.title}
            </h3>
            <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
              {s.text}
            </p>

            <span className="relative mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-heritage opacity-0 transition-all duration-500 group-hover:opacity-100">
              Discover <span className="h-px w-6 bg-heritage" />
            </span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
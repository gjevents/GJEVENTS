import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, User } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACTS } from "@/utils/constants";

// Premium contact cards with parallax names.
function ContactCard({ contact, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.12 }}
      className="group relative overflow-hidden rounded-2xl glass-card gilded-edge p-8"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-heritage/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-heritage-gradient text-cream">
          <User className="h-7 w-7" />
        </div>
        <div>
          <motion.h3
            style={{ y }}
            className="font-heading text-2xl font-semibold text-royal"
          >
            {contact.name}
          </motion.h3>
          <p className="text-xs uppercase tracking-[0.2em] text-heritage">{contact.role}</p>
        </div>
      </div>

      <a
        href={`tel:${contact.tel}`}
        className="mt-8 flex items-center justify-between rounded-xl border border-golden/30 bg-cream/40 px-5 py-4 transition-colors hover:border-golden"
      >
        <span className="flex items-center gap-3 text-lg font-medium text-royal">
          <Phone className="h-5 w-5 text-heritage" />
          {contact.phone}
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-heritage">Call</span>
      </a>
    </motion.div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-[120rem] px-6 py-28 md:px-12 md:py-40"
    >
      <SectionHeading
        eyebrow="Get in Touch"
        title={<>Direct Access to Our <span className="text-gradient-ember">Team</span></>}
        subtitle="Reach the right person for passes, stalls and technical support — no call centres, just direct lines to our executives."
      />

      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {CONTACTS.map((c, i) => (
          <ContactCard key={c.tel} contact={c} index={i} />
        ))}
      </div>
    </section>
  );
}
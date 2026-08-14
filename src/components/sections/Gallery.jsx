import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { apiUrl, mediaUrl, parseApiResponse } from "@/lib/siteApi";

export default function Gallery() {
  const [active, setActive] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(apiUrl("/api/gallery/"));
        const payload = await parseApiResponse(response, "Unable to load gallery because the backend returned HTML instead of JSON.");
        if (!response.ok) throw new Error(payload.error || `Unable to load gallery. HTTP status: ${response.status}.`);
        setImages(payload.map((item) => ({ ...item, image: mediaUrl(item.image) })));
      } catch (error) {
        console.error(error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  return (
    <section id="gallery" className="relative mx-auto max-w-[120rem] px-6 py-28 md:px-12 md:py-40">
      <SectionHeading
        eyebrow="Moments"
        title={<>The <span className="text-gradient-ember">Gallery</span></>}
        subtitle="A glimpse of the energy, scale and elegance we bring to every celebration."
      />

      {loading ? (
        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl premium-shadow">
              <Skeleton className="h-80 w-full" />
            </div>
          ))}
        </div>
      ) : images.length ? (
        <div className="mt-20 columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {images.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              onClick={() => setActive(item)}
              className="group relative mb-5 block w-full overflow-hidden rounded-2xl premium-shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-80 w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inkbrown/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-cream opacity-0 transition-all duration-500 group-hover:opacity-100">
                <span className="font-heading text-lg">{item.title}</span>
                <ZoomIn className="h-5 w-5" />
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="mt-20 rounded-2xl border border-golden/20 bg-cream/60 p-10 text-center text-muted-foreground">
          No gallery images are published yet.
        </div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-inkbrown/90 p-6 backdrop-blur-md"
          >
            <button className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream/10" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={active.image}
              alt={active.title}
              className="max-h-[85vh] max-w-5xl rounded-2xl object-contain premium-shadow"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Particles from "@/components/ui/Particles";

// 5-second cinematic unveil before the homepage. Plays once per session.
const SEQUENCE = [
  { at: 0, lines: ["GJ EVENTS", "Professional Event Management"] },
  { at: 2000, line: "Something BIG is Coming..." },
  { at: 3000, line: "Launching India's Next Generation Event Platform" },
  { at: 4200, line: "Coming Soon" }
];

export default function SplashScreen({ onDone }) {
  const [stage, setStage] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timers = SEQUENCE.map((s) =>
      setTimeout(() => setStage(SEQUENCE.indexOf(s)), s.at)
    );
    const exitTimer = setTimeout(() => setExit(true), 4700);
    const doneTimer = setTimeout(() => onDone?.(), 5200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  // Letter reveal helper
  const Words = ({ text, className = "" }) => (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.035 } }
      }}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { y: "110%", opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-heritage-gradient"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* animated silk gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(230,126,34,0.45), transparent 55%), radial-gradient(circle at 70% 70%, rgba(212,175,55,0.35), transparent 55%)",
              backgroundSize: "200% 200%"
            }}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <Particles count={26} />

          {/* Center logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              animate={{ boxShadow: [
                "0 0 30px 4px rgba(212,175,55,0.35)",
                "0 0 70px 14px rgba(212,175,55,0.6)",
                "0 0 30px 4px rgba(212,175,55,0.35)"
              ] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-28 w-28 items-center justify-center rounded-3xl border border-golden/40 bg-inkbrown/40 p-4 backdrop-blur-sm"
            >
              <img
                src="/apple-touch-icon.png"
                alt="GJ Events logo"
                className="h-full w-full object-contain"
                loading="eager"
                onError={(event) => {
                  event.currentTarget.src = "/favicon.svg";
                }}
              />
            </motion.div>

            {/* Sequence text */}
            <div className="mt-10 flex min-h-[5rem] flex-col items-center justify-center text-center px-6">
              {stage === 0 && (
                <>
                  <Words text="GJ EVENTS" className="font-heading text-4xl sm:text-5xl font-bold text-cream" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-3 text-xs uppercase tracking-[0.4em] text-golden/90"
                  >
                    Professional Event Management
                  </motion.span>
                </>
              )}
              {stage === 1 && (
                <Words text="Something BIG is Coming..." className="font-heading text-3xl sm:text-4xl font-semibold text-cream" />
              )}
              {stage === 2 && (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading text-2xl sm:text-3xl font-medium text-cream/90 max-w-xl"
                >
                  Launching India's Next Generation Event Platform
                </motion.span>
              )}
              {stage === 3 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-heading text-4xl sm:text-5xl font-bold text-gradient-gold"
                >
                  Coming Soon
                </motion.span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

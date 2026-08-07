import React from "react";
import { motion } from "framer-motion";

// Frosted glassmorphism card with optional gilded edge and hover glow.
export default function Card({
  children,
  className = "",
  dark = false,
  gilded = true,
  hover = true
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -8 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`relative overflow-hidden rounded-2xl ${
        dark ? "glass-dark" : "glass-card"
      } ${gilded ? "gilded-edge" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
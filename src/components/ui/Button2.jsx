import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Premium magnetic button. Variants: primary, gold, outline, ghost.
const variants = {
  primary: "bg-royal text-cream hover:bg-inkbrown",
  gold: "bg-saffron-gradient text-royal font-semibold hover:shadow-[0_18px_40px_-12px_rgba(212,175,55,0.6)]",
  outline: "border border-golden/60 text-royal hover:bg-golden/10",
  ghost: "text-royal hover:text-heritage"
};

export default function Button({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  external = false,
  className = "",
  type = "button"
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.18em] transition-all duration-500 ease-out";
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  const content = (
    <motion.span
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={classes}
    >
      {children}
    </motion.span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block">
        {content}
      </Link>
    );
  }
  if (href) {
    const props = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} className="inline-block" {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
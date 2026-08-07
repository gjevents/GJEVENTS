import React from "react";

// Minimal luxury loader — thin golden ring with rotating accent.
export default function Loader({ size = 40, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-golden/20"
        style={{ width: size, height: size }}
      />
      <span
        className="absolute rounded-full border-2 border-transparent border-t-golden animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
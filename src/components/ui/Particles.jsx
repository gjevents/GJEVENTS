import React, { useMemo } from "react";

// Floating particle field used in cinematic / premium backgrounds.
export default function Particles({ count = 24, color = "#D4AF37" }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 8,
        opacity: 0.2 + Math.random() * 0.6
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            bottom: 0,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: `0 0 ${p.size * 3}px ${color}`
          }}
        />
      ))}
    </div>
  );
}
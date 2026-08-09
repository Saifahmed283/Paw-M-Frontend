import { motion, useReducedMotion } from "motion/react";

/**
 * Soft drifting aurora "blobs" — a lightweight, dependency-free take on the
 * React Bits Aurora background. Floating translucent gradient discs breathe
 * slowly behind a section (default: hero / CTA bands).
 */
export function AmbientGlobs({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) return null;

  const blobs = [
    {
      className: "blob size-[34rem] bg-[var(--blob-1)]",
      style: { left: "-12%", top: "-22%" },
      drift: { x: [0, 60, 0], y: [0, 40, 0] },
      duration: 26,
    },
    {
      className: "blob size-[38rem] bg-[var(--blob-2)]",
      style: { right: "-14%", top: "-12%" },
      drift: { x: [0, -50, 0], y: [0, 60, 0] },
      duration: 32,
    },
    {
      className: "blob size-[32rem] bg-[var(--blob-3)]",
      style: { left: "28%", top: "38%" },
      drift: { x: [0, 40, 0], y: [0, -30, 0] },
      duration: 38,
    },
    {
      className: "blob size-[26rem] bg-[var(--blob-4)]",
      style: { right: "6%", top: "48%" },
      drift: { x: [0, -30, 0], y: [0, 40, 0] },
      duration: 30,
    },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={b.className}
          style={b.style}
          animate={b.drift}
          transition={{
            duration: b.duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}
    </div>
  );
}

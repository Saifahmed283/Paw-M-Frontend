"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
  decimals?: number;
};

export function CountUp({
  value,
  suffix = "",
  className = "",
  duration = 1.2,
  decimals = 0,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) {
      setCount(value);
      return;
    }

    const start = performance.now();
    startTimeRef.current = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = value * eased;
      setCount(Number(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, decimals]);

  return (
    <span className={className} data-countup="true">
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
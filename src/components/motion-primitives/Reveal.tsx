"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
  distance?: number;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.1,
  rootMargin = "0px 0px -5% 0px",
  triggerOnce = true,
  direction = "top",
  distance = 24,
}: RevealProps) {
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          if (triggerOnce) observer.unobserve(ref.current!);
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, threshold, rootMargin, triggerOnce]);

  if (reduce) {
    return <div className={className} ref={ref}>{children}</div>;
  }

  const getInitialTransform = () => {
    switch (direction) {
      case "top":
        return { opacity: 0, y: 32 };
      case "bottom":
        return { opacity: 0, y: -32 };
      case "left":
        return { opacity: 0, x: 32 };
      case "right":
        return { opacity: 0, x: -32 };
      default:
        return { opacity: 0, y: 32 };
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: mounted && inView ? 1 : 0,
        transform: mounted && inView ? "translate(0, 0)" : "translate(0, 24px)",
        transition: mounted
          ? "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
          : "none",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
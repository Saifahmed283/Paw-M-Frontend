import { motion } from "motion/react";
import { useEffect, useRef, useState, useMemo, type CSSProperties, type ReactNode } from "react";

type BlurTextProps = {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";
};

function buildKeyframes(
  from: Record<string, number | string>,
  steps: Array<Record<string, number | string>>,
): Record<string, Array<number | string>> {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes: Record<string, Array<number | string>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k] ?? "", ...steps.map((s) => s[k] ?? from[k] ?? "")];
  });
  return keyframes;
}

export function BlurText({
  text,
  delay = 160,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px 0px -10% 0px",
  easing,
  onAnimationComplete,
  stepDuration = 0.4,
  as: Tag = "span",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const stepCount = defaultTo.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap" }}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          className="inline-block will-change-[transform,filter,opacity]"
          initial={defaultFrom}
          animate={inView ? buildKeyframes(defaultFrom, defaultTo) : defaultFrom}
          transition={{
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing ?? ((t: number) => t),
          }}
          {...(index === elements.length - 1 && onAnimationComplete ? { onAnimationComplete } : {})}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </Tag>
  );
}

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical";
  pauseOnHover?: boolean;
  async?: boolean;
};

export function GradientText({
  children,
  className = "",
  colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setProgress((p) => (p + (dt / (animationSpeed * 1000)) * 50) % 100);
      raf = requestAnimationFrame(tick);
    };
    if (isPaused) return;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, animationSpeed]);

  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";
  const gradientColors = [colors[0], colors.at(-1), ...colors.slice(0, -1), colors[0]].join(", ");

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === "horizontal" ? "300% 100%" : "100% 300%",
    backgroundRepeat: "repeat",
    backgroundPosition: direction === "horizontal" ? `${progress}% 50%` : `50% ${progress}%`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <span
      className={`${className} ${showBorder ? "rounded-full ring-1 ring-border" : ""}`}
      style={style}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {children}
    </span>
  );
}

type ShinyTextProps = {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
};

export function ShinyText({
  text,
  disabled = false,
  speed = 2.5,
  className = "",
  color = "var(--muted-foreground)",
  shineColor = "var(--primary)",
  spread = 120,
  pauseOnHover = false,
  direction = "left",
}: ShinyTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (disabled || isPaused) return;
    let raf = 0;
    let last = performance.now();
    const cycleDuration = (speed * 1000) / 2;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setProgress((p) => (p + (dt / cycleDuration) * 100) % 200);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [disabled, isPaused, speed]);

  const p = progress <= 100 ? progress : 200 - progress;
  const backgroundPosition =
    direction === "left" ? `${150 - p * 2}% center` : `${-50 + p * 2}% center`;

  const gradientStyle: CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundPosition,
  };

  return (
    <span
      className={`inline-block ${className}`}
      style={gradientStyle}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {text}
    </span>
  );
}

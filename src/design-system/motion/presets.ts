import { useReducedMotion } from "motion/react";

/** Shared easing — no inline cubic-bezier strings scattered across components. */
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;

/** Storybook-adjacent springs: responsive, never bouncy. */
export const SPRINT = { type: "spring", stiffness: 300, damping: 26 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 260, damping: 28 } as const;

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: EASE_ENTRANCE },
} as const;

export const panelIn = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.4, ease: EASE_ENTRANCE },
} as const;

export const tactile = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { scale: 0.985 },
  transition: SPRINT,
} as const;

/**
 * One path for every animated primitive to honour the user's motion setting.
 * Call once at the top of a component and spread the returned props.
 */
export function useStoryMotion() {
  const reduce = !!useReducedMotion();
  return {
    reduce,
    fade: reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
      : fadeUp,
    panel: reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
      : panelIn,
    press: reduce ? {} : tactile,
  };
}

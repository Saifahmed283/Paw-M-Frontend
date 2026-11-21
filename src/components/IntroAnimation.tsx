import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PawMLogoSeal } from "@/components/PawMMark";
import { CrestBackdrop } from "@/design-system/primitives/CrestBackdrop";
import { useI18n } from "@/lib/i18n";

/** Toggle the whole opening off for QA/dev without touching component code. */
export const ENABLE_INTRO_ANIMATION = true;

const STORAGE_KEY = "paw-m:opening-seen";
const DURATION = 2400;

function hasSeenOpening(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markOpeningSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

/**
 * A short first-visit opening: the real logo seal sets on the animated crest
 * field, a gilded rule fills, then the overlay lifts. Once per browser session,
 * skippable by any key or pointer, and honest about the reduced-motion setting.
 */
export function IntroAnimation() {
  const reduce = !!useReducedMotion();
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (!ENABLE_INTRO_ANIMATION || hasSeenOpening()) return;
    setVisible(true);

    const total = reduceRef.current ? 420 : DURATION;
    const start = performance.now();
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      markOpeningSeen();
      setVisible(false);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(1, elapsed / total));
      if (elapsed >= total) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const skipTimer = window.setTimeout(() => setShowSkip(true), reduceRef.current ? 0 : 720);

    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);

    return () => {
      finished = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.12 } }
      : {
          initial: { opacity: 0, y: 14, scale: 0.94 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.45, delay, ease },
        };

  // The badge "sets" like a seal pressing into wax: it drops into place,
  // overshoots a touch, then settles. A separate slow drift keeps it alive
  // without the generic scaling-pulse look.
  const badgeSet = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, scale: 0.68, rotate: -10, y: 24 },
        animate: { opacity: 1, scale: [0.68, 1.06, 1], rotate: [-10, 2, 0], y: [24, -8, 0] },
        transition: { duration: 1.15, times: [0, 0.62, 1], ease },
      };
  const badgeDrift = reduce
    ? {}
    : {
        animate: { y: [0, -7, 0], rotate: [0, 1.25, 0] },
        transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const, delay: 1.1 },
      };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="paw-m-opening"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--navy-950)] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 1.03 }}
          transition={{ duration: reduce ? 0.18 : 0.42, ease }}
          role="status"
          aria-label={t("intro.loadingAria")}
        >
          <CrestBackdrop animated={!reduce} />

          <div className="relative flex flex-col items-center px-6">
            <motion.div {...badgeSet} className="relative">
              <motion.div {...badgeDrift}>
                <PawMLogoSeal size="display" />
              </motion.div>

              {!reduce && (
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[12%] size-[124%] overflow-visible text-[var(--gold-400)]"
                >
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="47"
                    pathLength={1}
                    stroke="currentColor"
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.9, delay: 0.5, ease }}
                  />
                </svg>
              )}
            </motion.div>

            <motion.p
              {...rise(0.72)}
              className="mt-8 font-display text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              Paw-M
            </motion.p>

            <motion.p
              {...rise(0.95)}
              className="mt-2 text-center text-sm text-white/75 sm:text-base"
            >
              {t("intro.tagline")}
            </motion.p>

            <div className="mt-8 h-px w-56 overflow-hidden bg-white/15 sm:w-72">
              <div
                className="h-full bg-[var(--gold-500)] transition-[width] duration-75 ease-linear"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>

          <AnimatePresence>
            {showSkip && !reduce && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
              >
                {t("intro.skip")}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

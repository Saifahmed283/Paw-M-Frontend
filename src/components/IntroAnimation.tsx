import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PawMMark } from "@/components/PawMMark";
import { useI18n } from "@/lib/i18n";

/** Toggle the whole splash off for QA/dev without touching component code. */
export const ENABLE_INTRO_ANIMATION = true;

const MAX_DURATION = 900;
const INTRO_SEEN_KEY = "paw-m:intro-seen";

function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

export function IntroAnimation() {
  const reduceMotion = useReducedMotion();
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (!ENABLE_INTRO_ANIMATION) return;
    // Show the splash on every load (remove sessionStorage check for reloads)
    setVisible(true);

    const start = performance.now();
    const total = reduceRef.current ? 400 : MAX_DURATION;
    let raf = 0;

    // Real load signal: fonts + first paint, capped by the hard duration budget.
    let fontsDone = false;
    document.fonts?.ready.then(() => {
      fontsDone = true;
    });

    const tick = () => {
      const elapsed = performance.now() - start;
      const timed = Math.min(1, elapsed / total);
      const eased = 1 - Math.pow(1 - timed, 3);
      setProgress(fontsDone ? Math.max(eased, Math.min(1, elapsed / (total * 0.75))) : eased);
      if (elapsed >= total) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const skipTimer = window.setTimeout(() => setShowSkip(true), 500);

    function finish() {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      setVisible(false);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    }

    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="paw-m-intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.25, ease }}
          role="status"
          aria-label={t("intro.loadingAria")}
        >
          <div className="hero-gradient absolute inset-0" />

          <div className="relative flex flex-col items-center gap-5 px-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.05 }}
                className="text-primary"
              >
                <IntroMark reduceMotion={!!reduceMotion} />
              </motion.div>

              <motion.span
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: reduceMotion ? 0.05 : 0.5 }}
                className="text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl"
              >
                Paw-M
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: reduceMotion ? 0.1 : 0.62 }}
              className="text-sm text-muted-foreground"
            >
              {t("intro.tagline")}
            </motion.p>

            <div className="mt-2 h-[2px] w-52 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>

          <AnimatePresence>
            {showSkip && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 text-xs tracking-wide text-muted-foreground"
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

function IntroMark({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" fill="none" aria-hidden="true">
      <motion.path
        d="M4 42h9l5-11 6 20 5-15 4 6h6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.g
        fill="currentColor"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "52px 28px" }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <ellipse cx="43.5" cy="20" rx="3.1" ry="4.2" />
        <ellipse cx="52" cy="16.5" rx="3.1" ry="4.4" />
        <ellipse cx="60" cy="21" rx="2.9" ry="4" />
        <path d="M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z" />
      </motion.g>
    </svg>
  );
}

export { PawMMark };

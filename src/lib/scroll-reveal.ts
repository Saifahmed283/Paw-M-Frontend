/**
 * Global scroll-reveal system.
 *
 * Applies a subtle fade + rise to every content section as it enters the
 * viewport. It is deliberately SSR-safe: the "hidden" state is only active
 * once this module (client-side only) adds the `pawm-sr` class to <html>.
 * If JavaScript is disabled or fails, all content stays fully visible.
 */

const STYLE_ID = "pawm-scroll-reveal-styles";

const CSS = `
html.pawm-sr [data-pawm-sr]:not(.is-visible) {
  opacity: 0;
  transform: translate3d(0, 22px, 0);
  transition:
    opacity 0.6s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 0.6s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
  will-change: opacity, transform;
}
html.pawm-sr [data-pawm-sr].is-visible {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.6s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 0.6s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
  will-change: auto;
}
@media (prefers-reduced-motion: reduce) {
  html.pawm-sr [data-pawm-sr] { opacity: 1 !important; transform: none !important; }
}
`;

let observer: IntersectionObserver | null = null;
let styleInjected = false;

function injectStyle() {
  if (styleInjected || typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  styleInjected = true;
}

/**
 * Scan the document and reveal-animate all major content blocks.
 * Safe to call repeatedly (e.g. on every route change) — already-tagged
 * elements are skipped.
 */
export function initScrollReveal(root: ParentNode = document) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  injectStyle();

  const targets = Array.from(
    root.querySelectorAll<HTMLElement>("main section:not([data-pawm-sr-skip]), [data-pawm-sr]"),
  );
  if (targets.length === 0) return;

  document.documentElement.classList.add("pawm-sr");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!observer) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
  }

  for (const el of targets) {
    if (el.hasAttribute("data-pawm-sr-observed")) continue;
    el.setAttribute("data-pawm-sr-observed", "");
    el.setAttribute("data-pawm-sr", "");

    // Sections already on screen at init must stay visible immediately —
    // the page-level fade covers their entrance and hiding them here would
    // cause a one-frame flash. Only off-screen sections animate on scroll.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add("is-visible");
      continue;
    }
    observer.observe(el);
  }
}

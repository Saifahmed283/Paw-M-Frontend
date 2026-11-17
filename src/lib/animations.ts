/**
 * Paw-M Custom Animation System
 * Lightweight, branded animations for a veterinary clinic
 * No external dependencies - pure CSS + tiny JS helpers
 */

// ──────────────────────────────────────────────────────────────
// CSS Keyframes (injected once)
// ──────────────────────────────────────────────────────────────

const KEYFRAMES = `
/* ─── Paw-M Brand Animations ─── */

@keyframes pawm-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(2deg); }
  50% { transform: translateY(-4px) rotate(-1deg); }
  75% { transform: translateY(-10px) rotate(1deg); }
}

@keyframes pawm-paw-drift {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.15; }
  25% { transform: translate(30px, -20px) rotate(90deg); opacity: 0.25; }
  50% { transform: translate(10px, -40px) rotate(180deg); opacity: 0.2; }
  75% { transform: translate(-20px, -30px) rotate(270deg); opacity: 0.15; }
  100% { transform: translate(0, 0) rotate(360deg); opacity: 0.15; }
}

@keyframes pawm-heartbeat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.08); }
  30% { transform: scale(1); }
  45% { transform: scale(1.05); }
  60% { transform: scale(1); }
}

@keyframes pawm-breathe {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.03); opacity: 0.9; }
}

@keyframes pawm-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes pawm-slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pawm-slide-down {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pawm-scale-in {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pawm-rotate-in {
  from { opacity: 0; transform: rotate(-6deg) scale(0.9); }
  to { opacity: 1; transform: rotate(0) scale(1); }
}

@keyframes pawm-stagger-reveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pawm-text-reveal {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pawm-border-draw {
  from { stroke-dashoffset: 100%; }
  to { stroke-dashoffset: 0%; }
}

@keyframes pawm-paw-bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-12px) rotate(-5deg); }
  60% { transform: translateY(-6px) rotate(3deg); }
}

/* ─── Utility Classes ─── */

.pawm-float {
  animation: pawm-float 6s ease-in-out infinite;
}

.pawm-paw-drift {
  animation: pawm-paw-drift 12s ease-in-out infinite;
}

.pawm-heartbeat {
  animation: pawm-heartbeat 2s ease-in-out infinite;
}

.pawm-breathe {
  animation: pawm-breathe 4s ease-in-out infinite;
}

.pawm-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: pawm-shimmer 2s infinite;
}

.pawm-slide-up {
  animation: pawm-slide-up 0.6s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
  opacity: 0;
}

.pawm-slide-down {
  animation: pawm-slide-down 0.5s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
  opacity: 0;
}

.pawm-scale-in {
  animation: pawm-scale-in 0.5s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
  opacity: 0;
}

.pawm-rotate-in {
  animation: pawm-rotate-in 0.5s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
  opacity: 0;
}

.pawm-stagger > * {
  animation: pawm-stagger-reveal 0.5s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
  opacity: 0;
}

.pawm-stagger > *:nth-child(1) { animation-delay: 0ms; }
.pawm-stagger > *:nth-child(2) { animation-delay: 60ms; }
.pawm-stagger > *:nth-child(3) { animation-delay: 120ms; }
.pawm-stagger > *:nth-child(4) { animation-delay: 180ms; }
.pawm-stagger > *:nth-child(5) { animation-delay: 240ms; }
.pawm-stagger > *:nth-child(6) { animation-delay: 300ms; }
.pawm-stagger > *:nth-child(7) { animation-delay: 360ms; }
.pawm-stagger > *:nth-child(8) { animation-delay: 420ms; }

.pawm-text-reveal {
  overflow: hidden;
}
.pawm-text-reveal > * {
  display: inline-block;
  animation: pawm-text-reveal 0.6s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
  opacity: 0;
}

.pawm-border-draw {
  stroke-dasharray: 100%;
  stroke-dashoffset: 100%;
  animation: pawm-border-draw 1.2s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards;
}

.pawm-paw-bounce {
  animation: pawm-paw-bounce 1.2s ease-in-out;
  transform-origin: center bottom;
}

/* ─── Delay Utilities ─── */
.pawm-delay-0 { animation-delay: 0ms; }
.pawm-delay-1 { animation-delay: 60ms; }
.pawm-delay-2 { animation-delay: 120ms; }
.pawm-delay-3 { animation-delay: 180ms; }
.pawm-delay-4 { animation-delay: 240ms; }
.pawm-delay-5 { animation-delay: 300ms; }
.pawm-delay-6 { animation-delay: 360ms; }
.pawm-delay-7 { animation-delay: 420ms; }
.pawm-delay-8 { animation-delay: 480ms; }

/* ─── Respect Reduced Motion ─── */
@media (prefers-reduced-motion: reduce) {
  .pawm-float,
  .pawm-paw-drift,
  .pawm-heartbeat,
  .pawm-breathe,
  .pawm-shimmer,
  .pawm-slide-up,
  .pawm-slide-down,
  .pawm-scale-in,
  .pawm-rotate-in,
  .pawm-stagger > *,
  .pawm-text-reveal > *,
  .pawm-border-draw,
  .pawm-paw-bounce {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .pawm-stagger > * {
    opacity: 1 !important;
  }
  .pawm-text-reveal > * {
    opacity: 1 !important;
  }
}

/* ─── Print ─── */
@media print {
  .pawm-float,
  .pawm-paw-drift,
  .pawm-heartbeat,
  .pawm-breathe,
  .pawm-shimmer,
  .pawm-slide-up,
  .pawm-slide-down,
  .pawm-scale-in,
  .pawm-rotate-in,
  .pawm-stagger > *,
  .pawm-text-reveal > *,
  .pawm-border-draw,
  .pawm-paw-bounce {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

// ──────────────────────────────────────────────────────────────
// JS Helpers
// ──────────────────────────────────────────────────────────────

let stylesInjected = false;

export function injectPawMAnimations() {
  if (stylesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.id = 'pawm-animations';
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  stylesInjected = true;
}

export function createPawPrints(count: number = 8): HTMLDivElement[] {
  const container = document.createElement('div');
  container.className = 'fixed inset-0 pointer-events-none overflow-hidden -z-10';
  container.setAttribute('aria-hidden', 'true');

  const colors = [
    'var(--color-primary)',
    'var(--color-brass)',
    'var(--color-primary-glow)',
  ];

  for (let i = 0; i < count; i++) {
    const paw = document.createElement('div');
    const size = Math.random() * 16 + 8; // 8-24px
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 8 + Math.random() * 8;

    paw.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237BA882' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='4' r='2'/%3E%3Ccircle cx='18' cy='8' r='2'/%3E%3Ccircle cx='20' cy='16' r='2'/%3E%3Cpath d='M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      opacity: ${0.05 + Math.random() * 0.1};
      animation: pawm-paw-drift ${duration}s ease-in-out infinite;
      animation-delay: -${delay}s;
      will-change: transform, opacity;
    `;
    container.appendChild(paw);
  }

  return [container];
}

/**
 * Auto-stagger children of an element
 * Usage: staggerChildren(container, '.card', { baseDelay: 60 })
 */
export function staggerChildren(
  container: HTMLElement,
  selector: string = '> *',
  options: { baseDelay?: number; maxDelay?: number; startFrom?: number } = {}
) {
  const { baseDelay = 60, maxDelay = 480, startFrom = 0 } = options;
  const children = Array.from(container.querySelectorAll(selector)) as HTMLElement[];

  children.forEach((child, index) => {
    const delay = Math.min(startFrom + index * baseDelay, maxDelay);
    child.style.animationDelay = `${delay}ms`;
    child.classList.add('pawm-stagger-item');
  });
}

/**
 * Trigger text reveal on element
 */
export function revealText(element: HTMLElement, delay = 0) {
  const text = element.textContent || '';
  element.innerHTML = '';
  element.classList.add('pawm-text-reveal');
  element.style.setProperty('--reveal-delay', `${delay}ms`);

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${delay + i * 30}ms`;
    element.appendChild(span);
  });
}

/**
 * Draw SVG path on scroll into view
 */
export function drawOnScroll(svg: SVGElement, threshold = 0.3) {
  const paths = svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          paths.forEach((path) => {
            path.style.strokeDashoffset = '0';
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );
  observer.observe(svg);
}

/**
 * Parallax scroll effect (subtle)
 */
export function parallax(element: HTMLElement, speed = 0.15) {
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const distance = (elementCenter - viewportCenter) * speed;
        element.style.transform = `translateY(${distance}px)`;
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

/**
 * Magnetic hover effect (subtle attraction)
 */
export function magnetic(element: HTMLElement, strength = 0.15) {
  const handleMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };
  const handleLeave = () => {
    element.style.transform = 'translate(0, 0)';
    element.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  };
  element.addEventListener('mousemove', handleMove);
  element.addEventListener('mouseleave', handleLeave);
  return () => {
    element.removeEventListener('mousemove', handleMove);
    element.removeEventListener('mouseleave', handleLeave);
  };
}

// ──────────────────────────────────────────────────────────────
// React Hooks (if using React)
// ──────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';

export function usePawMAnimations() {
  useEffect(() => {
    injectPawMAnimations();
  }, []);
}

export function useStagger(selector = '> *', baseDelay = 60) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) staggerChildren(ref.current, selector, { baseDelay });
  }, [selector, baseDelay]);
  return ref;
}

export function useDrawOnScroll(threshold = 0.3) {
  const ref = useRef<SVGElement>(null);
  useEffect(() => {
    if (ref.current) return drawOnScroll(ref.current, threshold);
  }, [threshold]);
  return ref;
}

export function useParallax(speed = 0.15) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) return parallax(ref.current, speed);
  }, [speed]);
  return ref;
}

export function useMagnetic(strength = 0.15) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) return magnetic(ref.current, strength);
  }, [strength]);
  return ref;
}

export function usePawPrints(count = 8) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const paws = createPawPrints(count);
      paws.forEach((p) => ref.current?.appendChild(p));
      return () => paws.forEach((p) => p.remove());
    }
  }, [count]);
  return ref;
}

// ──────────────────────────────────────────────────────────────
// CSS Custom Properties (add to your global CSS)
// ──────────────────────────────────────────────────────────────

/*
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

.pawm-stagger-item {
  animation: pawm-stagger-reveal 0.5s var(--ease-out) forwards;
  opacity: 0;
}
*/

export default {
  injectPawMAnimations,
  createPawPrints,
  staggerChildren,
  revealText,
  drawOnScroll,
  parallax,
  magnetic,
  // React hooks
  usePawMAnimations,
  useStagger,
  useDrawOnScroll,
  useParallax,
  useMagnetic,
  usePawPrints,
};
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";

export type RotatingTextHandle = {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
};

type RotatingTextProps = {
  texts: string[];
  className?: string;
  transition?: Transition;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random";
  loop?: boolean;
  auto?: boolean;
  splitBy?: "characters" | "words" | "lines";
  onNext?: (index: number) => void;
  elementClassName?: string;
};

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }
  return Array.from(text);
};

export const RotatingText = forwardRef<RotatingTextHandle, RotatingTextProps>(
  (
    {
      texts,
      className = "",
      transition = { type: "spring", damping: 25, stiffness: 300 },
      rotationInterval = 3000,
      staggerDuration = 0.04,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      elementClassName = "",
    },
    ref,
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex] ?? "";
      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      if (splitBy === "words") {
        const words = currentText.split(" ");
        return words.map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1,
        }));
      }
      if (splitBy === "lines") {
        const lines = currentText.split("\n");
        return lines.map((line, i, arr) => ({
          characters: [line],
          needsSpace: i !== arr.length - 1,
        }));
      }
      return [];
    }, [texts, currentTextIndex, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(totalChars / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * totalChars);
          return Math.abs(randomIndex - index) * staggerDuration;
        }
        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [staggerFrom, staggerDuration],
    );

    const next = useCallback(() => {
      setCurrentTextIndex((current) => {
        const total = texts.length;
        if (total === 0) return current;
        const nextIndex = current === total - 1 ? (loop ? 0 : current) : current + 1;
        onNext?.(nextIndex);
        return nextIndex;
      });
    }, [texts.length, loop, onNext]);

    const previous = useCallback(() => {
      setCurrentTextIndex((current) => {
        const total = texts.length;
        if (total === 0) return current;
        const prevIndex = current === 0 ? (loop ? total - 1 : current) : current - 1;
        onNext?.(prevIndex);
        return prevIndex;
      });
    }, [texts.length, loop, onNext]);

    const jumpTo = useCallback(
      (index: number) => {
        const total = texts.length;
        if (total === 0) return;
        const validIndex = Math.max(0, Math.min(index, total - 1));
        setCurrentTextIndex(validIndex);
        onNext?.(validIndex);
      },
      [texts.length, onNext],
    );

    const reset = useCallback(() => setCurrentTextIndex(0), []);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
      next,
      previous,
      jumpTo,
      reset,
    ]);

    useEffect(() => {
      if (!auto) return;
      const id = window.setInterval(next, rotationInterval);
      return () => window.clearInterval(id);
    }, [next, rotationInterval, auto]);

    return (
      <span className={`text-rotate ${className}`}>
        <span className="text-rotate-sr-only" aria-live="polite">
          {texts[currentTextIndex]}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={currentTextIndex} aria-hidden="true" className="inline-flex flex-wrap">
            {elements.map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
              return (
                <span key={wordIndex} className="text-rotate-word">
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-120%", opacity: 0 }}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          array.reduce((sum, word) => sum + word.characters.length, 0),
                        ),
                      }}
                      className={`text-rotate-element ${elementClassName}`}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  },
);

RotatingText.displayName = "RotatingText";

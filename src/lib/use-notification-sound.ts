import { useCallback, useEffect, useRef } from "react";

/**
 * Play a short two-tone chime on a reusable AudioContext. A fresh oscillator
 * and gain node are created per chime (they are one-shot by design), but the
 * context itself is shared so we never exhaust the browser's context limit.
 */
function playChime(context: AudioContext) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  const now = context.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, now);
  oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);
  oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.3);

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  oscillator.start(now);
  oscillator.stop(now + 0.4);
  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
}

function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  return new AudioContextCtor();
}

export function useNotificationSound({
  enabled = true,
  interval = 30_000,
  getCount,
  onNewItems,
}: {
  enabled?: boolean;
  interval?: number;
  getCount: () => number;
  onNewItems?: (newCount: number, prevCount: number) => void;
}) {
  // Callbacks are stored in refs so a new inline closure on every render does
  // not tear down and recreate the polling interval.
  const getCountRef = useRef(getCount);
  const onNewItemsRef = useRef(onNewItems);
  getCountRef.current = getCount;
  onNewItemsRef.current = onNewItems;

  const prevCountRef = useRef(getCount());
  const isFirstCheck = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    try {
      if (!audioContextRef.current) audioContextRef.current = createAudioContext();
      const context = audioContextRef.current;
      if (!context) return;
      // Browsers start the context suspended until a user gesture.
      if (context.state === "suspended") void context.resume();
      playChime(context);
    } catch {
      // Audio is a nice-to-have; never let it break the dashboard.
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const checkForUpdates = () => {
      const currentCount = getCountRef.current();
      if (!isFirstCheck.current && currentCount > prevCountRef.current) {
        playSound();
        onNewItemsRef.current?.(currentCount, prevCountRef.current);
      }
      prevCountRef.current = currentCount;
      isFirstCheck.current = false;
    };

    checkForUpdates();
    const id = window.setInterval(checkForUpdates, interval);

    return () => {
      window.clearInterval(id);
      void audioContextRef.current?.close().catch(() => {});
      audioContextRef.current = null;
    };
  }, [enabled, interval, playSound]);

  return { play: playSound };
}

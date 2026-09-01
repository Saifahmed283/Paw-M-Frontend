import { useEffect, useRef, useCallback } from "react";

function createNotificationSound() {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.4);

  return audioContext;
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
  const prevCountRef = useRef(getCount());
  const isFirstCheck = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    try {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      createNotificationSound();
    } catch {
      // Ignore audio errors
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const checkForUpdates = () => {
      if (!enabled) return;
      const currentCount = getCount();
      if (!isFirstCheck.current && currentCount > prevCountRef.current) {
        playSound();
        onNewItems?.(currentCount, prevCountRef.current);
      }
      prevCountRef.current = currentCount;
      isFirstCheck.current = false;
    };

    checkForUpdates();
    const id = setInterval(checkForUpdates, interval);
    return () => {
      clearInterval(id);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [enabled, interval, getCount, onNewItems, playSound]);

  return { play: playSound };
}
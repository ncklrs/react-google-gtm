// src/components/ScrollTracker.tsx
import React, { useEffect, useRef } from "react";
import { useGTM } from "../hooks/useGTM";

export interface ScrollTrackerProps {
  thresholds?: number[];
  eventName?: string;
  onThreshold?: (percent: number) => void;
  debounceMs?: number;
}

/**
 * Component to track scroll depth
 *
 * @example
 * ```tsx
 * <ScrollTracker
 *   thresholds={[25, 50, 75, 100]}
 *   eventName="scroll_depth"
 * />
 *
 * // With custom callback
 * <ScrollTracker
 *   thresholds={[25, 50, 75, 100]}
 *   onThreshold={(percent) => console.log('Scrolled to', percent, '%')}
 * />
 * ```
 */
export const ScrollTracker: React.FC<ScrollTrackerProps> = ({
  thresholds = [25, 50, 75, 100],
  eventName = "scroll_depth",
  onThreshold,
  debounceMs = 100,
}) => {
  const { sendEvent } = useGTM();
  const trackedThresholds = useRef<Set<number>>(new Set());
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const percentScrolled = (scrolled / scrollHeight) * 100;

        thresholds.forEach((threshold) => {
          if (
            percentScrolled >= threshold &&
            !trackedThresholds.current.has(threshold)
          ) {
            trackedThresholds.current.add(threshold);

            sendEvent({
              event: eventName,
              scroll_depth: threshold,
              scroll_percent: Math.round(percentScrolled),
            });

            if (onThreshold) {
              onThreshold(threshold);
            }
          }
        });
      }, debounceMs);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [thresholds, eventName, onThreshold, sendEvent, debounceMs]);

  return null;
};

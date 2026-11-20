import { createContext, useContext } from "react";
import type { MotionValue } from "motion/react";

export type ScrollClock = {
  scrollY: MotionValue<number>;
  progress: MotionValue<number>;
};

export const ScrollClockContext = createContext<ScrollClock | null>(null);

export function useScrollClock() {
  const clock = useContext(ScrollClockContext);
  if (!clock) {
    throw new Error("useScrollClock must be used inside SmoothScroll");
  }
  return clock;
}

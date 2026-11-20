import { cancelFrame, frame } from "motion-dom";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useMemo, type ReactNode } from "react";
import "lenis/dist/lenis.css";
import { ScrollClockContext, useScrollClock } from "../lib/scrollClock";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const scrollY = useMotionValue(0);
  const progress = useMotionValue(0);
  const clock = useMemo(() => ({ scrollY, progress }), [progress, scrollY]);

  return (
    <ScrollClockContext.Provider value={clock}>
      {reduce ? (
        <>
          <NativeClock />
          <ScrollRail />
          {children}
        </>
      ) : (
        <ReactLenis
          root
          options={{
            autoRaf: false,
            lerp: 0.085,
            anchors: true,
            stopInertiaOnNavigate: true,
            respectReducedMotion: true,
          }}
        >
          <LenisClock />
          <ScrollRail />
          {children}
        </ReactLenis>
      )}
    </ScrollClockContext.Provider>
  );
}

function LenisClock() {
  const lenis = useLenis();
  const { scrollY, progress } = useScrollClock();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => {
      scrollY.set(lenis.scroll);
      progress.set(lenis.progress);
    };
    lenis.on("scroll", onScroll);

    const step = ({ timestamp }: { timestamp: number }) => {
      lenis.raf(timestamp);
    };
    frame.read(step, true);

    return () => {
      lenis.off("scroll", onScroll);
      cancelFrame(step);
    };
  }, [lenis, progress, scrollY]);

  return null;
}

function NativeClock() {
  const { scrollY, progress } = useScrollClock();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      scrollY.set(y);
      progress.set(max > 0 ? y / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progress, scrollY]);

  return null;
}

function ScrollRail() {
  const { progress } = useScrollClock();

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: progress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-primary"
    />
  );
}

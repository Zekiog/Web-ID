import { useMotionValue, type MotionValue } from "motion/react";
import { useLayoutEffect, type RefObject } from "react";
import { useScrollClock } from "./scrollClock";

type Edge = { element: "start" | "end"; viewport: number };

function parseEdge(token: string): Edge {
  const [element, viewport = "start"] = token.split(" ");
  let ratio = 0;
  if (viewport === "end") ratio = 1;
  else if (viewport === "center") ratio = 0.5;
  else if (viewport.endsWith("%")) ratio = Number.parseFloat(viewport) / 100;
  return { element: element === "end" ? "end" : "start", viewport: ratio };
}

function anchor(docTop: number, height: number, edge: Edge, view: number) {
  const at = edge.element === "start" ? docTop : docTop + height;
  return at - edge.viewport * view;
}

export function useScrub(
  ref: RefObject<HTMLElement | null>,
  offset: readonly [string, string],
): MotionValue<number> {
  const { scrollY } = useScrollClock();
  const progress = useMotionValue(0);
  const startToken = offset[0];
  const endToken = offset[1];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startEdge = parseEdge(startToken);
    const endEdge = parseEdge(endToken);
    let from = 0;
    let span = 1;

    const measure = () => {
      const view = window.innerHeight;
      const y = window.scrollY;
      const docTop = y + el.getBoundingClientRect().top;
      from = anchor(docTop, el.offsetHeight, startEdge, view);
      const to = anchor(docTop, el.offsetHeight, endEdge, view);
      span = to - from || 1;
      progress.set(Math.min(1, Math.max(0, (y - from) / span)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    const unsub = scrollY.on("change", (y) => {
      progress.set(Math.min(1, Math.max(0, (y - from) / span)));
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      unsub();
    };
  }, [endToken, progress, ref, scrollY, startToken]);

  return progress;
}

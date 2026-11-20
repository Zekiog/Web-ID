import { cancelFrame, frame } from "motion-dom";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { container, h2, kicker as kickerClass, lede as ledeClass } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useScrub } from "../lib/useScrub";

export type HingeItem = {
  index: string;
  title: string;
  body: string;
};

type HingeStackProps = {
  id: string;
  kicker: string;
  title: string;
  lede: string;
  items: HingeItem[];
  columns?: 1 | 2;
};

const FOLD_VH = 32;

export default function HingeStack(props: HingeStackProps) {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");

  if (reduce || narrow) return <HingeList {...props} />;
  return <HingePin {...props} />;
}

function HingeList({ id, kicker, title, lede, items, columns = 2 }: HingeStackProps) {
  return (
    <section id={id} className="border-t border-outline-variant py-24 md:py-32">
      <div className={container}>
        <p className={kickerClass}>{kicker}</p>
        <h2 className={`${h2} mt-4 max-w-xl`}>{title}</h2>
        <p className={`${ledeClass} mt-5`}>{lede}</p>
        <ul className={`mt-12 grid gap-4 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
          {items.map((item) => (
            <li key={item.index} className="border border-outline-variant bg-surface-container-low p-6 md:p-8">
              <p className="font-display text-3xl text-primary">{item.index}</p>
              <h3 className="mt-6 font-display text-3xl tracking-tight text-on-surface">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-on-surface-variant">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HingePin({ id, kicker, title, lede, items }: HingeStackProps) {
  const ref = useRef<HTMLElement>(null);
  const target = useScrub(ref, ["start start", "end end"]);
  const progress = useFollowScroll(target);
  const folds = Math.max(1, items.length - 1);
  const active = useTransform(progress, (value) => items[activeSlot(value, items.length)].index);
  const rule = useTransform(progress, [0, 1], [0.08, 1]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative border-t border-outline-variant"
      style={{ height: `calc(100svh + ${folds * FOLD_VH}vh)` }}
    >
      <div className="sticky top-0 flex h-svh items-center">
        <div className={`${container} grid w-full items-center gap-10 md:grid-cols-12`}>
          <div className="md:col-span-5">
            <p className={kickerClass}>{kicker}</p>
            <h2 className={`${h2} mt-4`}>{title}</h2>
            <p className={`${ledeClass} mt-5`}>{lede}</p>
            <motion.p className="mt-8 font-display text-5xl text-primary">{active}</motion.p>
            <div className="mt-4 flex gap-2" aria-hidden="true">
              {items.map((item, index) => (
                <HingeTick key={item.index} index={index} total={items.length} progress={progress} />
              ))}
            </div>
            <motion.div style={{ scaleX: rule }} className="mt-6 h-px w-28 origin-left bg-primary" />
          </div>
          <div className="md:col-span-7">
            <div className="relative h-[min(32rem,64vh)] overflow-hidden">
              <div className="absolute inset-x-10 bottom-8 top-3" style={{ perspective: "2100px" }}>
                <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                  {items.map((item, index) => (
                    <HingeCard
                      key={item.index}
                      item={item}
                      index={index}
                      total={items.length}
                      progress={progress}
                    />
                  ))}
                </div>
              </div>
              <div
                className="pointer-events-none absolute inset-x-10 top-3 z-30 flex -translate-y-1/2 items-center"
                aria-hidden="true"
              >
                <span className="size-1.5 bg-primary" />
                <span className="h-px flex-1 bg-primary/80" />
                <span className="size-1.5 bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useFollowScroll(target: MotionValue<number>) {
  const smooth = useMotionValue(0);

  useLayoutEffect(() => {
    smooth.set(target.get());
    const step = () => {
      const goal = target.get();
      const current = smooth.get();
      const delta = goal - current;
      if (Math.abs(delta) < 0.0012) {
        if (current !== goal) smooth.set(goal);
        return;
      }
      smooth.set(current + delta * 0.22);
    };
    frame.update(step, true);
    return () => cancelFrame(step);
  }, [smooth, target]);

  return smooth;
}

function HingeTick({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (value) => (activeSlot(value, total) === index ? 1 : 0.28));
  const scaleX = useTransform(progress, (value) => (activeSlot(value, total) === index ? 1 : 0.45));

  return <motion.span style={{ opacity, scaleX }} className="h-px w-8 origin-left bg-primary" />;
}

function HingeCard({
  item,
  index,
  total,
  progress,
}: {
  item: HingeItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const rotateX = useTransform(progress, (value) => hingePose(value, index, total).rotateX);
  const opacity = useTransform(progress, (value) => hingePose(value, index, total).opacity);
  const shade = useTransform(rotateX, (deg) => {
    const angle = Math.abs(deg);
    if (angle <= 45) return (angle / 45) * 0.08;
    return 0.08 + ((angle - 45) / 41) * 0.5;
  });

  return (
    <motion.article
      style={{
        rotateX,
        opacity,
        zIndex: total - index,
        transformOrigin: "top center",
        pointerEvents: "none",
      }}
      className={`absolute inset-0 flex flex-col justify-between border border-outline-variant px-8 py-8 [backface-visibility:hidden] md:px-10 ${
        index % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container"
      }`}
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: shade }}
        className="pointer-events-none absolute inset-0 bg-black"
      />
      <p className="relative font-display text-4xl text-primary">{item.index}</p>
      <div className="relative">
        <h3 className="font-display text-4xl tracking-tight text-on-surface">{item.title}</h3>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-on-surface-variant md:text-lg">{item.body}</p>
      </div>
    </motion.article>
  );
}

function activeSlot(progress: number, total: number) {
  const folds = Math.max(1, total - 1);
  return Math.min(total - 1, Math.max(0, Math.floor(progress * folds + 0.12)));
}

function hingePose(progress: number, index: number, total: number) {
  const folds = Math.max(1, total - 1);
  const local = progress * folds - index;

  if (index === total - 1) {
    if (local <= -0.1) return { rotateX: 0, opacity: 0 };
    if (local >= 0) return { rotateX: 0, opacity: 1 };
    return { rotateX: 0, opacity: (local + 0.1) / 0.1 };
  }

  if (local <= -0.1) return { rotateX: 0, opacity: 0 };
  if (local < 0) return { rotateX: 0, opacity: (local + 0.1) / 0.1 };
  if (local >= 1) return { rotateX: 86, opacity: 0 };

  const rotateX = 86 * Math.min(1, local / 0.84);
  const opacity = local < 0.7 ? 1 : Math.max(0, 1 - (local - 0.7) / 0.22);
  return { rotateX, opacity };
}

import { useRef } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { container, h2, kicker as kickerClass, lede } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useScrub } from "../lib/useScrub";

export type Step = {
  n: string;
  title: string;
  body: string;
};

type ProcessProps = {
  id?: string;
  kicker: string;
  title: string;
  lede?: string;
  steps: Step[];
};

export default function Process({ id = "process", kicker, title, lede: intro, steps }: ProcessProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");
  const motionOn = reduce !== true && !narrow;
  const scrollYProgress = useScrub(ref, ["start 72%", "end 55%"]);
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id={id} ref={ref} className="relative z-0 overflow-x-clip border-t border-outline-variant py-24 md:py-32">
      <div className={`${container} grid gap-12 md:grid-cols-12 md:gap-16`}>
        <div className="md:col-span-4 md:sticky md:top-28 md:self-start">
          <p className={kickerClass}>{kicker}</p>
          <h2 className={`${h2} mt-4`}>{title}</h2>
          {intro ? <p className={`${lede} mt-5`}>{intro}</p> : null}
        </div>
        <ol className="relative md:col-span-8" style={motionOn ? { perspective: "900px" } : undefined}>
          <div
            className="absolute bottom-3 left-3 top-3 w-px bg-outline-variant"
            aria-hidden="true"
          />
          {motionOn ? (
            <motion.div
              style={{ scaleY, transformOrigin: "top center" }}
              className="absolute bottom-3 left-3 top-3 w-px bg-primary"
              aria-hidden="true"
            />
          ) : (
            <div className="absolute bottom-3 left-3 top-3 w-px bg-primary" aria-hidden="true" />
          )}
          {steps.map((step, index) => (
            <ProcessStep
              key={step.n}
              step={step}
              index={index}
              total={steps.length}
              progress={scrollYProgress}
              motionOn={motionOn}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
  total,
  progress,
  motionOn,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
  motionOn: boolean;
}) {
  const start = index / total;
  const y = useTransform(
    progress,
    [Math.max(0, start - 0.04), Math.min(1, start + 0.14)],
    [index === 0 ? 0 : 14, 0],
  );
  const rotateX = useTransform(progress, (value) => {
    if (index === 0) return 0;
    const from = Math.max(0, start - 0.02);
    const to = Math.min(1, start + 0.2);
    if (value <= from) return 8;
    if (value >= to) return 0;
    return 8 * (1 - (value - from) / (to - from));
  });
  const opacity = useTransform(rotateX, [8, 0], [0.72, 1]);

  return (
    <li className="relative grid grid-cols-[4.5rem_1fr] gap-4 py-7 first:pt-1 last:pb-1 md:gap-6 md:py-9 [&:last-child>div:last-child]:border-b-0 [&:last-child>div:last-child]:pb-0">
      <div className="overflow-hidden pl-6 pt-1">
        {motionOn ? (
          <motion.span style={{ y }} className="block font-display text-3xl leading-none text-primary">
            {step.n}
          </motion.span>
        ) : (
          <span className="block font-display text-3xl leading-none text-primary">{step.n}</span>
        )}
      </div>
      {motionOn ? (
        <motion.div
          style={{ rotateX, opacity, transformOrigin: "top center" }}
          className="border-b border-outline-variant pb-7 last:border-b-0 md:pb-9"
        >
          <StepCopy step={step} />
        </motion.div>
      ) : (
        <div className="border-b border-outline-variant pb-7 last:border-b-0 md:pb-9">
          <StepCopy step={step} />
        </div>
      )}
    </li>
  );
}

function StepCopy({ step }: { step: Step }) {
  return (
    <>
      <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-on-surface">
        {step.title}
      </h3>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-on-surface-variant">{step.body}</p>
    </>
  );
}

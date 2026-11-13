import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { container, display, kicker as kickerClass } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { useScrub } from "../lib/useScrub";

const SEEDS = [
  0.35, 0.72, 0.48, 0.9, 0.55, 0.28, 0.8, 0.42, 0.66, 0.33, 0.77, 0.5, 0.22, 0.84,
  0.58, 0.4, 0.93, 0.31, 0.7, 0.46, 0.62, 0.25, 0.88, 0.52,
];

const scrim =
  "linear-gradient(to top, var(--color-background) 0%, color-mix(in oklab, var(--color-background) 92%, transparent) 26%, color-mix(in oklab, var(--color-background) 62%, transparent) 58%, color-mix(in oklab, var(--color-background) 28%, transparent) 100%)";

type HeroProps = {
  kicker: string;
  title: ReactNode;
  showSignal?: boolean;
  children: ReactNode;
};

export default function CinematicHero({ kicker, title, showSignal = false, children }: HeroProps) {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");

  if (reduce || narrow) {
    return (
      <StaticHero kicker={kicker} title={title} showSignal={showSignal}>
        {children}
      </StaticHero>
    );
  }

  return (
    <PinnedHero kicker={kicker} title={title} showSignal={showSignal}>
      {children}
    </PinnedHero>
  );
}

function StaticHero({ kicker, title, showSignal, children }: HeroProps) {
  return (
    <section className="relative flex min-h-svh items-end">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: scrim }} />
      </div>
      <div className={`${container} relative z-10 pb-14 pt-28`}>
        <p className={kickerClass}>{kicker}</p>
        <h1 className={`${display} mt-4`}>{title}</h1>
        {showSignal ? <SignalStatic /> : null}
        <div className="mt-6 max-w-2xl">{children}</div>
      </div>
    </section>
  );
}

function PinnedHero({ kicker, title, showSignal, children }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useScrub(ref, ["start start", "end end"]);
  const clip = useTransform(scrollYProgress, [0, 1], [
    "inset(0% 0% 0% 0% round 0px)",
    "inset(11% 6% 18% 6% round 28px)",
  ]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const rule = useTransform(scrollYProgress, [0.04, 0.55], [0.08, 1]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-svh">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/hero-bg.jpg"
            alt=""
            width={1024}
            height={1024}
            decoding="async"
            fetchPriority="high"
            style={{ y: imgY, scale: imgScale }}
            className="absolute inset-[-8%] h-[116%] w-[116%] max-w-none object-cover"
          />
          <div className="absolute inset-0" style={{ background: scrim }} />
        </motion.div>
        <div className={`${container} relative z-10 flex h-full flex-col justify-end pb-12 pt-28`}>
          <p className={kickerClass}>{kicker}</p>
          <motion.div style={{ y: titleY }}>
            <h1 className={`${display} mt-4`}>{title}</h1>
            {showSignal ? <Signal progress={scrollYProgress} /> : null}
          </motion.div>
          <motion.div style={{ scaleX: rule }} className="mt-6 h-px w-36 origin-left bg-primary" />
          <motion.div style={{ y: copyY }} className="mt-6 max-w-2xl">
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Signal({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="mt-6 flex h-10 items-end gap-[3px]" aria-hidden="true">
      {SEEDS.map((seed, index) => (
        <SignalBar key={index} seed={seed} index={index} progress={progress} />
      ))}
    </div>
  );
}

function SignalBar({
  seed,
  index,
  progress,
}: {
  seed: number;
  index: number;
  progress: MotionValue<number>;
}) {
  const scaleY = useTransform(progress, (value) => {
    return 0.16 + 0.84 * Math.abs(Math.sin(seed * 6.2 + value * Math.PI * 3 + index * 0.18));
  });

  return (
    <motion.span
      style={{ scaleY, transformOrigin: "bottom center" }}
      className="block h-full w-[3px] bg-primary/85"
    />
  );
}

function SignalStatic() {
  return (
    <div className="mt-6 flex h-10 items-end gap-[3px]" aria-hidden="true">
      {SEEDS.map((seed, index) => (
        <span
          key={index}
          className="block w-[3px] bg-primary/80"
          style={{ height: `${18 + seed * 82}%` }}
        />
      ))}
    </div>
  );
}

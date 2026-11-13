/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import CinematicHero from "../components/CinematicHero";
import Process, { type Step } from "../components/Process";
import { btnPrimary, btnSecondary, container, h2, kicker, lede } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { usePageTitle } from "../lib/usePageTitle";

const checks = [
  {
    index: "01",
    title: "Accuracy",
    body: "Does the answer match the source text, or the facts you supplied with the job?",
  },
  {
    index: "02",
    title: "Instruction",
    body: "Does it do the task you asked for, and stop there?",
  },
  {
    index: "03",
    title: "Terminology",
    body: "Does it use the names you specified for the same concepts?",
  },
  {
    index: "04",
    title: "Wording",
    body: "Is it fluent in Norwegian, Turkish, or English, and is any phrase misleading or unsafe to publish?",
  },
];

const steps: Step[] = [
  {
    n: "01",
    title: "Send the output",
    body: "Include the model answer and the instruction that produced it.",
  },
  {
    n: "02",
    title: "Name the checks",
    body: "Accuracy, instruction fit, terminology, and wording are written down before the read.",
  },
  {
    n: "03",
    title: "Mark the text",
    body: "Each issue is marked on the output, with a short reason.",
  },
  {
    n: "04",
    title: "Take the notes",
    body: "You receive the marked text and a summary you can pass on.",
  },
];

export default function AIQAService() {
  usePageTitle("Web-ID | Review of AI-written text");

  return (
    <main>
      <CinematicHero
        kicker="AI evaluation"
        title={
          <>
            A review of
            <span className="mt-1 block italic text-primary">model output.</span>
          </>
        }
      >
        <p className="text-lg leading-relaxed text-on-surface-variant">
          The text is read in Norwegian, Turkish, or English. Notes say where an answer is wrong,
          off the instruction, inconsistent in its terms, or unsafe to show.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/request-services" className={btnPrimary}>
            Request a review
          </Link>
          <a href="#checks" className={btnSecondary}>
            What is checked
          </a>
        </div>
      </CinematicHero>
      <Checks />
      <Process
        id="ai-process"
        kicker="Process"
        title="How a review runs."
        lede="No dashboard. The result is a marked text and a short summary."
        steps={steps}
      />
      <section className="border-t border-outline-variant py-24">
        <div className={`${container} flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between`}>
          <div>
            <h2 className={h2}>Send a sample.</h2>
            <p className={`${lede} mt-4`}>
              Describe the output and the language in the request form, or write to{" "}
              <a className="text-primary underline" href="mailto:contact@multilingual.no">
                contact@multilingual.no
              </a>
              .
            </p>
          </div>
          <Link to="/request-services" className={btnPrimary}>
            Request a review
          </Link>
        </div>
      </section>
    </main>
  );
}

function Checks() {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");

  return (
    <section id="checks" className="border-t border-outline-variant">
      {reduce || narrow ? <CheckList /> : <PinnedChecks />}
    </section>
  );
}

function CheckList() {
  return (
    <div className={`${container} py-24 md:py-32`}>
      <p className={kicker}>Checks</p>
      <h2 className={`${h2} mt-4 max-w-xl`}>Four questions for every answer.</h2>
      <ul className="mt-12 grid gap-4">
        {checks.map((item) => (
          <li key={item.index} className="border border-outline-variant bg-surface-container-low p-6 md:p-8">
            <p className="font-display text-3xl text-primary">{item.index}</p>
            <h3 className="mt-4 font-display text-3xl text-on-surface">{item.title}</h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PinnedChecks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className={`${container} grid w-full items-center gap-10 md:grid-cols-12`}>
          <div className="md:col-span-5">
            <p className={kicker}>Checks</p>
            <h2 className={`${h2} mt-4`}>Four questions for every answer.</h2>
            <p className={`${lede} mt-5`}>
              The same four, applied to the output you send.
            </p>
          </div>
          <div className="relative h-[min(24rem,58vh)] md:col-span-7">
            {checks.map((item, index) => (
              <CheckCard
                key={item.index}
                item={item}
                index={index}
                total={checks.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCard({
  item,
  index,
  total,
  progress,
}: {
  item: (typeof checks)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (value) => {
    const local = value * total - index;
    let amount = 0;
    if (local < -0.25) amount = 0;
    else if (local < 0.08) amount = (local + 0.25) / 0.33;
    else if (local < 0.72 || index === total - 1) amount = 1;
    else if (local < 1) amount = 1 - (local - 0.72) / 0.28;
    else amount = 0;
    if (index === 0 && value < 0.02) amount = 1;
    return Math.min(1, Math.max(0, amount));
  });
  const scale = useTransform(opacity, [0, 1], [0.96, 1]);
  const y = useTransform(opacity, [0, 1], [24, 0]);
  const pointerEvents = useTransform(opacity, (value) => (value > 0.45 ? "auto" : "none"));

  return (
    <motion.article
      style={{ opacity, scale, y, pointerEvents }}
      className="absolute inset-0 flex flex-col justify-between border border-outline-variant bg-surface-container-low p-8 md:p-10"
    >
      <p className="font-display text-4xl text-primary">{item.index}</p>
      <div>
        <h3 className="font-display text-4xl tracking-tight text-on-surface">{item.title}</h3>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-on-surface-variant">{item.body}</p>
      </div>
    </motion.article>
  );
}

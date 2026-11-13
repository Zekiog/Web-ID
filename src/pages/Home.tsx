import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useTransform } from "motion/react";
import CinematicHero from "../components/CinematicHero";
import HingeStack from "../components/HingeStack";
import Process, { type Step } from "../components/Process";
import { btnPrimary, btnSecondary, container, h2, kicker, lede } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { usePageTitle } from "../lib/usePageTitle";
import { useScrub } from "../lib/useScrub";

const services = [
  {
    index: "01",
    title: "Localisation",
    body: "A text is adapted into Norwegian, Turkish, or English so the meaning, the tone, and the names survive the move.",
  },
  {
    index: "02",
    title: "Language quality",
    body: "A translation is read against checks agreed up front: accuracy, terminology, style, and anything left out.",
  },
  {
    index: "03",
    title: "Terminology",
    body: "A term list for the job, so one concept keeps one name from the first file to the last.",
  },
  {
    index: "04",
    title: "AI evaluation",
    body: "Model output is read for factual fit, whether it followed the instruction, and whether the wording is safe to show.",
  },
  {
    index: "05",
    title: "Interpretation",
    body: "Spoken transfer between Norwegian, Turkish, and English.",
  },
];

const steps: Step[] = [
  {
    n: "01",
    title: "Brief",
    body: "You send the text, the languages, and what the text is for.",
  },
  {
    n: "02",
    title: "Criteria",
    body: "The checks are named before the read: accuracy, terms, tone, completeness.",
  },
  {
    n: "03",
    title: "Review",
    body: "The text, or the model output, is read against those checks.",
  },
  {
    n: "04",
    title: "Notes",
    body: "You receive the issues, marked on the text, and a short summary.",
  },
];

export default function Home() {
  usePageTitle("Web-ID | Language quality in Norwegian, Turkish, and English");

  return (
    <main>
      <CinematicHero
        kicker="Oslo"
        showSignal
        title={
          <>
            Language quality
            <span className="mt-1 block italic text-primary">for three languages.</span>
          </>
        }
      >
        <p className="text-lg leading-relaxed text-on-surface-variant">
          Localisation, terminology, review of AI-written text, and interpretation. Norwegian,
          Turkish, and English.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/request-services" className={btnPrimary}>
            Request a review
          </Link>
          <a href="#services" className={btnSecondary}>
            See the work
          </a>
        </div>
      </CinematicHero>

      <HingeStack
        id="services"
        kicker="Services"
        title="Five kinds of work."
        lede="Say which ones you need in the request. A job can be one of them, or several."
        items={services}
      />
      <Process
        kicker="Process"
        title="How a job runs."
        lede="The same sequence, whether the text was written by a person or a model."
        steps={steps}
      />
      <About />
      <AiBand />
    </main>
  );
}

const languages = [
  { label: "Norsk", lang: "nb" },
  { label: "Türkçe", lang: "tr" },
  { label: "English", lang: "en" },
];

function About() {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");
  const motionOn = reduce !== true && !narrow;
  const ref = useRef<HTMLElement>(null);
  const progress = useScrub(ref, ["start end", "end start"]);
  const y = useTransform(progress, [0, 1], ["8%", "-8%"]);

  return (
    <section id="about" ref={ref} className="border-t border-outline-variant py-24 md:py-32">
      <div className={`${container} grid items-center gap-12 md:grid-cols-12`}>
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden border border-outline-variant bg-surface-container">
            {motionOn ? (
              <motion.img
                src="/founder.jpg"
                alt="Portrait of Mehmet Zeki Oguz"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                style={{ y }}
                className="h-[116%] w-full max-w-none object-cover object-[center_18%]"
              />
            ) : (
              <img
                src="/founder.jpg"
                alt="Portrait of Mehmet Zeki Oguz"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[center_18%]"
              />
            )}
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className={kicker}>About</p>
          <h2 className={`${h2} mt-4`}>Mehmet Zeki Oguz</h2>
          <p className="mt-4 text-lg text-primary">Multilingual quality specialist</p>
          <p className={`${lede} mt-5`}>
            Based in Oslo. The work covers localisation, language quality, terminology, evaluation
            of AI-written text, and interpretation, in Norwegian, Turkish, and English.
          </p>
          <ul className="mt-10 space-y-2">
            {languages.map((language, index) => (
              <LanguageLine
                key={language.lang}
                label={language.label}
                lang={language.lang}
                index={index}
                progress={progress}
                motionOn={motionOn}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LanguageLine({
  label,
  lang,
  index,
  progress,
  motionOn,
}: {
  label: string;
  lang: string;
  index: number;
  progress: ReturnType<typeof useScrub>;
  motionOn: boolean;
}) {
  const y = useTransform(progress, [0.18 + index * 0.08, 0.46 + index * 0.08], [18, 0]);
  const opacity = useTransform(progress, [0.18 + index * 0.08, 0.42 + index * 0.08], [0.55, 1]);

  if (!motionOn) {
    return (
      <li className="font-display text-4xl text-on-surface" lang={lang}>
        {label}
      </li>
    );
  }

  return (
    <motion.li style={{ y, opacity }} className="font-display text-4xl text-on-surface" lang={lang}>
      {label}
    </motion.li>
  );
}

function AiBand() {
  return (
    <section className="border-t border-outline-variant py-24 md:py-28">
      <div className={`${container} grid gap-8 md:grid-cols-12 md:items-end`}>
        <div className="md:col-span-7">
          <p className={kicker}>AI-written text</p>
          <h2 className={`${h2} mt-4`}>A separate read for model output.</h2>
          <p className={`${lede} mt-5`}>
            The notes cover accuracy, the instruction, terminology, and wording. The marked text
            can be passed to the people who maintain the system.
          </p>
        </div>
        <div className="md:col-span-5 md:text-right">
          <Link to="/ai-qa-service" className={btnSecondary}>
            How a review works
          </Link>
        </div>
      </div>
    </section>
  );
}

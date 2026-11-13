import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import CinematicHero from "../components/CinematicHero";
import Process, { type Step } from "../components/Process";
import { btnPrimary, btnSecondary, container, h2, kicker, lede } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { usePageTitle } from "../lib/usePageTitle";

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

      <Services />
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

function Services() {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");

  if (reduce || narrow) return <ServiceStack />;
  return <ServiceReel />;
}

function ServiceStack() {
  return (
    <section id="services" className="border-t border-outline-variant py-24 md:py-32">
      <div className={container}>
        <p className={kicker}>Services</p>
        <h2 className={`${h2} mt-4 max-w-xl`}>Five kinds of work.</h2>
        <p className={`${lede} mt-5`}>
          Say which ones you need in the request. A job can be one of them, or several.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <li key={service.index} className="border border-outline-variant bg-surface-container-low p-6 md:p-8">
              <p className="font-display text-3xl text-primary">{service.index}</p>
              <h3 className="mt-6 font-display text-3xl tracking-tight text-on-surface">{service.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-on-surface-variant">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const distanceRef = useRef(0);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (value) => -distanceRef.current * value);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const indexLabel = useTransform(scrollYProgress, (value) => {
    const next = Math.min(services.length, Math.max(1, Math.ceil(value * services.length)));
    return String(next).padStart(2, "0");
  });

  useLayoutEffect(() => {
    const measure = () => {
      const view = viewportRef.current;
      const track = trackRef.current;
      if (!view || !track) return;
      const next = Math.max(0, track.scrollWidth - view.clientWidth);
      distanceRef.current = next;
      setDistance(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative border-t border-outline-variant"
      style={
        distance > 0
          ? { height: `calc(100svh + ${Math.round(distance * 1.45)}px)` }
          : { minHeight: "100svh" }
      }
    >
      <div className="sticky top-0 flex h-svh items-stretch overflow-hidden">
        <div className="flex w-[min(34vw,22rem)] shrink-0 flex-col justify-between py-24 pl-[max(1.25rem,calc((100vw-72rem)/2))] pr-8">
          <div>
            <p className={kicker}>Services</p>
            <h2 className={`${h2} mt-4`}>Five kinds of work.</h2>
            <p className="mt-5 max-w-xs text-base leading-relaxed text-on-surface-variant">
              Say which ones you need in the request. A job can be one of them, or several.
            </p>
          </div>
          <div>
            <motion.div style={{ scaleX }} className="mb-4 h-px origin-left bg-primary" />
            <motion.p aria-hidden="true" className="font-display text-5xl text-primary">
              {indexLabel}
            </motion.p>
          </div>
        </div>
        <div ref={viewportRef} className="min-w-0 flex-1 overflow-hidden">
          <motion.ul ref={trackRef} style={{ x }} className="flex h-full items-center gap-5 pr-[8vw]">
            {services.map((service) => (
              <li
                key={service.index}
                className="flex h-[min(68vh,32rem)] w-[min(70vw,26rem)] shrink-0 flex-col justify-between border border-outline-variant bg-surface-container-low p-8"
              >
                <p className="font-display text-4xl text-primary">{service.index}</p>
                <div>
                  <h3 className="font-display text-4xl tracking-tight text-on-surface">{service.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-on-surface-variant">{service.body}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t border-outline-variant py-24 md:py-32">
      <div className={`${container} grid items-center gap-12 md:grid-cols-12`}>
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden border border-outline-variant bg-surface-container">
            <img
              src="/founder.jpg"
              alt="Portrait of Mehmet Zeki Oguz"
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[center_18%]"
            />
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
            <li className="font-display text-4xl text-on-surface" lang="nb">
              Norsk
            </li>
            <li className="font-display text-4xl text-on-surface" lang="tr">
              Türkçe
            </li>
            <li className="font-display text-4xl text-on-surface" lang="en">
              English
            </li>
          </ul>
        </div>
      </div>
    </section>
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

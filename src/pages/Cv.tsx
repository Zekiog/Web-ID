import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { container, h2, kicker, lede, panel } from "../lib/classes";
import { useMediaQuery } from "../lib/useMediaQuery";
import { usePageTitle } from "../lib/usePageTitle";

type Language = "en" | "no" | "tr";
type CapabilityTab = "aiqa" | "localization" | "systems";

const site = "https://www.multilingual.no";

const copy = {
  en: {
    kicker: "Trondheim · Oslo & Remote",
    role: "Multilingual quality specialist",
    intro: "Localisation, terminology, review of model output, and interpretation. Norwegian, Turkish, and English, with further languages below. Open to remote work.",
    profile: "Profile",
    profileTitle: "What the work is.",
    experience: "Experience",
    experienceTitle: "Roles and dates.",
    skills: "Skills",
    skillsTitle: "What I use on a job.",
    languages: "Languages",
    languagesTitle: "Seven, with a level on each.",
    credentials: "Credentials",
    credentialsTitle: "Named checks already passed.",
    projects: "Projects",
    projectsTitle: "Three pieces of work.",
    contact: "Contact",
    contactTitle: "Write, or go back to the site.",
    aiqa: "AI QA",
    localization: "Localisation",
    systems: "Systems",
  },
  no: {
    kicker: "Trondheim · Oslo & Remote",
    role: "Fler språklig kvalitetsspesialist",
    intro: "Lokalisering, terminologi, gjennomgang av modellresultater og tolking. Norsk, tyrkisk og engelsk, med flere språk nedenfor. Åpen for remote arbeid.",
    profile: "Profil",
    profileTitle: "Hva arbeidet består av.",
    experience: "Arbeidserfaring",
    experienceTitle: "Roller og datoer.",
    skills: "Nøkkelkompetanse",
    skillsTitle: "Det jeg bruker i arbeidet.",
    languages: "Språkkompetanse",
    languagesTitle: "Sju språk, med nivå på hvert.",
    credentials: "Kvalifikasjoner",
    credentialsTitle: "Navngitte kvalitetskontroller allerede bestått.",
    projects: "Prosjekter",
    projectsTitle: "Tre arbeidsområder.",
    contact: "Kontakt",
    contactTitle: "Skriv, eller gå tilbake til nettstedet.",
    aiqa: "AI-kvalitet",
    localization: "Lokalisering",
    systems: "Systemer",
  },
  tr: {
    kicker: "Trondheim · Oslo & Remote",
    role: "Çok dilli kalite uzmanı",
    intro: "Yerelleştirme, terminoloji, model çıktı değerlendirme ve çeviri. Norveççe, Türkçe ve İngilizce; diğer diller aşağıda. Uzaktan çalışmaya açığım.",
    profile: "Profil",
    profileTitle: "İşin kapsamı.",
    experience: "Deneyim",
    experienceTitle: "Görevler ve tarihler.",
    skills: "Nitelikler",
    skillsTitle: "İşlerde kullandıklarım.",
    languages: "Diller",
    languagesTitle: "Yedi dil, her biri için seviye.",
    credentials: "Sertifikalar",
    credentialsTitle: "Tamamlanan kalite kontrolleri.",
    projects: "Projeler",
    projectsTitle: "Üç çalışma alanı.",
    contact: "İletişim",
    contactTitle: "Yazın ya da siteye dönün.",
    aiqa: "Yapay Zeka Kalitesi",
    localization: "Yerelleştirme",
    systems: "Sistemler",
  },
} as const;

const roles = [
  {
    role: "AI Quality Rater",
    company: "Mindy-Support",
    meta: "Freelance · Remote",
    period: "Dec 2024 — Present",
    points: [
      "Reads model answers against written checks: safety, factual fit, coherence, policy, whether the answer matches the request, and overall quality. The work covers more than 15 domains.",
      "Ranks several answers against each other and writes the reason, for training and quality review.",
      "Marks issues in the evaluation tools, with the category, the guideline, and a trace back to the text.",
      "Covers safety and moderation, content understanding, visual tasks, translation, and domain-specific checks.",
      "Works remotely, in set project blocks, to the stated quality bar.",
    ],
  },
  {
    role: "Independent AI Systems Research",
    company: "Self-directed projects",
    meta: "Prototyping · Workflow design",
    period: "2024 — Present",
    points: [
      "Designed a platform concept where a person can set up, run, and watch a workflow from written instructions.",
      "Split the setup into reusable steps, with a view of whether a run is ready to use.",
      "Compared models and tools on free and low-cost plans: whether they followed the prompt, how often they failed, and where they stopped being practical.",
      "Keeps recent project work on GitHub so decisions and changes can be reviewed.",
      "Treats the experiments as research into how those workflows should be configured and improved.",
    ],
  },
  {
    role: "Turkish Translator & Interpreter",
    company: "Tolkenett",
    meta: "Freelance · Norway",
    period: "Nov 2021 — Present",
    points: [
      "Norwegian–Turkish interpretation and translation in legal, medical, and corporate settings.",
      "Checks terms, facts, and the source meaning, including under time pressure.",
      "Keeps structured notes, and asks when a line is unclear.",
    ],
  },
];

const capabilities = [
  {
    title: "Review of model output",
    body: "Rubric-based checks, edge cases, multi-turn behaviour, ranking answers, and naming the failure.",
    tags: ["Rubrics", "Pass/fail", "Traces", "Edge cases"],
    tab: "aiqa" as CapabilityTab,
  },
  {
    title: "Technical evaluation",
    body: "Modular workflows, whether a prompt reaches the tool, trace review, and the limits of a deployment.",
    tags: ["Workflows", "Reliability", "Prompts", "Architecture"],
    tab: "systems" as CapabilityTab,
  },
  {
    title: "Delivery",
    body: "Remote asynchronous work, a written record of each change, and GitHub as the place that record is kept.",
    tags: ["Async", "Docs first", "GitHub", "Self-led"],
    tab: "systems" as CapabilityTab,
  },
  {
    title: "Languages",
    body: "Turkish and Kurdish as native languages, professional Norwegian and English, fluent Swedish, intermediate German, and basic Arabic.",
    tags: ["7 languages", "Localisation"],
    tab: "localization" as CapabilityTab,
  },
];

const stack = [
  "Model-output review",
  "Rubric design",
  "Failure patterns",
  "Multi-turn analysis",
  "Structured feedback",
  "Preference ranking",
  "Safety review",
  "Factuality checks",
  "Localisation QA",
  "JavaScript",
  "React",
  "HTML and CSS",
  "Git and GitHub",
  "VS Code",
  "Azure Fundamentals",
  "AWS Fundamentals",
];

const credentials = [
  { name: "Safety and moderation", items: ["AFM v3", "GM Safety"] },
  { name: "Content understanding", items: ["CYU", "CYU News Topic"] },
  { name: "Visual content", items: ["VCG TTI", "VCG Message", "VCG ADM", "VCG Genmoji"] },
  { name: "Translation and proofreading", items: ["TA IP", "TA Proofreading"] },
  { name: "Domain-specific", items: ["DE", "LE", "Ogma PR", "Modules still in progress"] },
];

const training = [
  "Front-end web development certificate (self-paced)",
  "Generative AI fundamentals",
  "Azure Fundamentals",
  "AWS Cloud Practitioner",
];

const languages = [
  { name: "Turkish", level: "Native", lang: "tr" },
  { name: "Kurdish", level: "Native", lang: "ku" },
  { name: "Norwegian", level: "Professional", lang: "nb" },
  { name: "English", level: "Professional", lang: "en" },
  { name: "Swedish", level: "Fluent", lang: "sv" },
  { name: "German", level: "Intermediate", lang: "de" },
  { name: "Arabic", level: "Basic conversational", lang: "ar" },
];

const projects = [
  {
    name: "Workflow platform (concept)",
    status: "Prototype · Ongoing",
    body: "A concept for setting up and running multi-step workflows from written instructions, with a view of the run.",
    href: "https://github.com/ZeZilly",
  },
  {
    name: "Multi-model evaluation harness",
    status: "Research · 2025",
    body: "Compared prompt fit, reliability, and failure modes across models on free and low-cost plans.",
    href: "https://github.com/ZeZilly",
  },
  {
    name: "multilingual.no",
    status: "Live",
    body: "The public site for the language work: localisation, terminology, review, and interpretation.",
    href: site,
  },
];

const metrics = [
  ["15+", "Evaluation domains"],
  ["7", "Languages"],
  ["4+", "Years in review"],
  ["100%", "Remote"],
] as const;

export default function Cv() {
  const [lang, setLang] = useState<Language>("en");
  const [tab, setTab] = useState<CapabilityTab>("aiqa");
  const t = copy[lang];

  usePageTitle("Web-ID | Mehmet Zeki Oguz");

  useEffect(() => {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://cv.multilingual.no/";
    document.head.appendChild(canonical);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "Mehmet Zeki Oguz",
        "url": "https://cv.multilingual.no/",
        "jobTitle": "Multilingual Quality Specialist",
        "email": "mailto:zeki@multilingual.no",
        "knowsLanguage": ["tr", "ku", "nb", "en", "sv", "de", "ar"],
        "knowsAbout": [
          "LLM Output Evaluation",
          "RLHF",
          "Multilingual Localization QA",
          "Language Quality",
          "Terminology",
          "Interpretation",
        ],
      },
    });
    document.head.appendChild(script);

    return () => {
      canonical.remove();
      script.remove();
    };
  }, []);

  return (
    <main>
      <header className="border-b border-outline-variant pt-28 pb-16 md:pt-36 md:pb-24">
        <div className={`${container} grid items-end gap-12 md:grid-cols-12`}>
          <div className="md:col-span-7">
            <p className={kicker}>{t.kicker}</p>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.94] tracking-[-0.035em] text-on-surface">
              Mehmet Zeki Oguz
            </h1>
            <p className="mt-4 text-lg text-primary">{t.role}</p>
            <p className={`${lede} mt-5`}>{t.intro}</p>

            <div className="mt-6 flex gap-2">
              {(["en", "no", "tr"] as Language[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`min-h-10 border px-3 text-sm uppercase ${
                    lang === code
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a className="text-primary underline" href={site}>
                multilingual.no
              </a>
              <a className="text-on-surface hover:text-primary" href="mailto:zeki@multilingual.no">
                zeki@multilingual.no
              </a>
              <a className="text-on-surface hover:text-primary" href="tel:+4745546080">
                +47 455 46 080
              </a>
              <a className="text-on-surface hover:text-primary" href="https://www.linkedin.com/in/zekiogz/">
                LinkedIn
              </a>
              <a className="text-on-surface hover:text-primary" href="https://github.com/ZeZilly">
                GitHub
              </a>
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="aspect-[4/5] overflow-hidden border border-outline-variant bg-surface-container">
              <img
                src="/founder.jpg"
                alt="Portrait of Mehmet Zeki Oguz"
                width={1024}
                height={1024}
                fetchPriority="high"
                className="h-full w-full object-cover object-[center_18%]"
              />
            </div>
          </div>
        </div>
      </header>

      <Section id="profile" kicker={t.profile} title={t.profileTitle}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 text-lg leading-relaxed text-on-surface-variant md:col-span-7">
            <p>
              The work sits between language and review of model output. Over the last year the
              reviews have covered more than fifteen domains, from safety and moderation to
              translation and ranking one answer against another.
            </p>
            <p>
              Alongside that, I test workflows that use more than one model, on real budgets: how
              they should be set up, where they fail, and what is worth keeping.
            </p>
            <p>
              Before that, more than ten years of translation and interpretation in Norwegian,
              Turkish, English, and Swedish. That work is mostly about ambiguity, a shift in
              context, and a record someone else can check.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-6 md:col-span-5">
            {metrics.map(([value, label]) => (
              <div key={label} className="border-t border-outline-variant pt-3">
                <dt className="font-display text-3xl text-on-surface">{value}</dt>
                <dd className="mt-1 text-sm text-on-surface-variant">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="experience" kicker={t.experience} title={t.experienceTitle}>
        <ol className="space-y-12">
          {roles.map((item) => (
            <li key={item.role} className="grid gap-4 border-t border-outline-variant pt-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-display text-2xl text-on-surface">{item.role}</p>
                <p className="mt-2 text-primary">{item.company}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.meta}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.period}</p>
              </div>
              <ul className="space-y-3 text-on-surface-variant md:col-span-8">
                {item.points.map((point) => (
                  <li key={point} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" kicker={t.skills} title={t.skillsTitle}>
        <div className="flex flex-wrap gap-2">
          {(["aiqa", "localization", "systems"] as CapabilityTab[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className={`min-h-10 border px-4 text-sm ${
                tab === key
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant text-on-surface-variant"
              }`}
            >
              {t[key]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {capabilities
            .filter((item) => item.tab === tab)
            .map((item) => (
              <article key={item.title} className={panel}>
                <h3 className="font-display text-2xl text-on-surface">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-on-surface-variant">{item.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-outline-variant px-2 py-1 text-xs uppercase tracking-[0.14em] text-on-surface-variant"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
        </div>

        <h3 className="mt-12 font-display text-2xl text-on-surface">Tools and checks</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {stack.map((item) => (
            <li key={item} className="bg-surface-container px-3 py-2 text-sm text-on-surface">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="languages" kicker={t.languages} title={t.languagesTitle}>
        <ul className="divide-y divide-outline-variant border-y border-outline-variant">
          {languages.map((language) => (
            <li key={language.lang} className="flex items-baseline justify-between gap-6 py-4">
              <span className="font-display text-3xl text-on-surface" lang={language.lang}>
                {language.name}
              </span>
              <span className="text-sm text-on-surface-variant">{language.level}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="credentials" kicker={t.credentials} title={t.credentialsTitle}>
        <div className="grid gap-8 md:grid-cols-2">
          {credentials.map((group) => (
            <div key={group.name}>
              <h3 className="text-sm uppercase tracking-[0.16em] text-primary">{group.name}</h3>
              <ul className="mt-3 space-y-1 text-on-surface">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-12 font-display text-2xl text-on-surface">Training</h3>
        <ul className="mt-4 space-y-2 text-on-surface-variant">
          {training.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="projects" kicker={t.projects} title={t.projectsTitle}>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article key={project.name} className={panel}>
              <p className="text-xs uppercase tracking-[0.16em] text-primary">{project.status}</p>
              <h3 className="mt-3 font-display text-2xl text-on-surface">{project.name}</h3>
              <p className="mt-3 leading-relaxed text-on-surface-variant">{project.body}</p>
              <a className="mt-5 inline-block text-sm text-primary underline" href={project.href}>
                {project.href.replace(/^https:\/\//, "")}
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section id="contact" kicker={t.contact} title={t.contactTitle}>
        <p className={lede}>
          For a language job, use the request form on{" "}
          <a className="text-primary underline" href={site}>
            multilingual.no
          </a>
          . For this CV, write to{" "}
          <a className="text-primary underline" href="mailto:zeki@multilingual.no">
            zeki@multilingual.no
          </a>
          .
        </p>
        <p className="mt-6 text-sm text-on-surface-variant">Trondheim, Norway · +47 455 46 080</p>
      </Section>
    </main>
  );
}

function Section({
  id,
  kicker: label,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-b border-outline-variant py-20 md:py-28">
      <Reveal>
        <div className={container}>
          <p className={kicker}>{label}</p>
          <h2 className={`${h2} mt-4 max-w-3xl`}>{title}</h2>
          <div className="mt-10">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

function Reveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 767px)");

  if (reduce || narrow) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

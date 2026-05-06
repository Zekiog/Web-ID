/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Link } from "react-router-dom";
import {
  Bot,
  Languages,
  GitBranch,
  ShieldCheck,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function AIQAService() {
  return (
    <main className="pt-[80px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt=""
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background"></div>
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-xl md:py-[120px] flex flex-col items-center text-center gap-md">
          <span className="inline-flex items-center gap-2 bg-surface-container-low border border-surface-container-highest rounded-full px-sm py-xs font-label-caps text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold">
            AI QA Testing / AI Kvalitetstesting
          </span>
          <h1 className="font-h1 text-[48px] leading-[1.1] tracking-[-0.02em] font-semibold text-on-background max-w-4xl">
            Automatiserte AI-kvalitetstester
            <br />
            <span className="text-primary">for dine chatbots og agenter</span>
          </h1>
          <p className="font-body-lg text-[18px] leading-[1.6] text-on-surface-variant max-w-2xl">
            Automated multilingual AI quality testing for enterprise chatbots
            and agents — designed for the Nordics, built for the world.
          </p>
          <p className="font-body-md text-[16px] text-on-surface-variant max-w-2xl -mt-sm">
            Vi sikrer at dine AI-assistenter leverer presise, trygge og
            kulturelt tilpassede svar på alle språk — i samsvar med EUs AI Act.
          </p>
          <div className="flex flex-col sm:flex-row gap-sm mt-xs">
            <Link
              to="/request-services"
              className="bg-primary text-on-primary font-button text-[14px] font-medium px-md py-sm rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Få et tilbud — Get a Quote
              <ChevronRight size={16} />
            </Link>
            <a
              href="#features"
              className="bg-transparent text-on-background border border-surface-container-highest font-button text-[14px] font-medium px-md py-sm rounded-DEFAULT hover:bg-surface-container-low transition-colors inline-flex items-center justify-center"
            >
              Se tjenester — View Services
            </a>
          </div>
        </div>
      </section>

      {/* Key Metrics Strip */}
      <section className="bg-surface-container-low border-y border-surface-container-highest">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-md py-lg">
          {[
            {
              value: "10+",
              label: "Språk dekket",
              sub: "Languages covered",
            },
            {
              value: "99.7%",
              label: "Presisjonsrate",
              sub: "Precision rate",
            },
            {
              value: "<2s",
              label: "Responstid",
              sub: "Avg. response time",
            },
            {
              value: "24/7",
              label: "Kontinuerlig testing",
              sub: "Continuous testing",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-h2 text-[30px] font-semibold text-primary">
                {stat.value}
              </div>
              <div className="font-label-caps text-[12px] uppercase font-semibold text-on-surface">
                {stat.label}
              </div>
              <div className="font-body-sm text-[14px] text-on-surface-variant">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What We Solve */}
      <section className="max-w-[1200px] mx-auto px-6 py-xl" id="features">
        <div className="text-center mb-xl">
          <h2 className="font-h2 text-[30px] font-semibold text-on-background mb-sm">
            Hvorfor din bedrift trenger AI QA-testing
            <br />
            <span className="text-on-surface-variant font-body-lg text-[18px] font-normal">
              Why your enterprise needs AI QA testing
            </span>
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">
            KI-drevne kundesamtaler og agenter blir stadig mer avanserte. Uten
            robust kvalitetssikring risikerer du inkonsistente svar,
            språkblundere og brudd på regelverk.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-gutter">
          {/* Feature 1: Automated Multilingual QA */}
          <div className="bg-surface border border-surface-container-highest rounded-lg p-md hover:-translate-y-1 transition-transform duration-200">
            <div className="w-12 h-12 bg-primary-container/20 rounded-DEFAULT flex items-center justify-center mb-md">
              <Bot className="text-primary" size={24} />
            </div>
            <h3 className="font-h3 text-[24px] font-semibold text-on-background mb-xs">
              Automatisert flerspråklig QA
            </h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant font-medium mb-sm">
              Automated multilingual AI quality testing
            </p>
            <p className="font-body-sm text-[14px] text-on-surface-variant">
              Våre AI-agenter tester chatbot-responser automatisk på tvers av
              språk og scenarioer. Vi avdekker inkonsekvenser, feilaktige
              antagelser og brudd på retningslinjer før de når sluttbrukerne.
              Helt uten manuell innsats.
            </p>
            <div className="flex gap-2 mt-md">
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                Automatisering
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                Kvalitetssikring
              </span>
            </div>
          </div>

          {/* Feature 2: 10+ Language Coverage */}
          <div className="bg-surface border border-surface-container-highest rounded-lg p-md hover:-translate-y-1 transition-transform duration-200">
            <div className="w-12 h-12 bg-primary-container/20 rounded-DEFAULT flex items-center justify-center mb-md">
              <Languages className="text-primary" size={24} />
            </div>
            <h3 className="font-h3 text-[24px] font-semibold text-on-background mb-xs">
              10+ språk — inkludert norsk
            </h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant font-medium mb-sm">
              10+ language coverage including Nordic languages
            </p>
            <p className="font-body-sm text-[14px] text-on-surface-variant">
              Full dekning av nordiske språk (norsk bokmål, nynorsk, svensk,
              dansk, finsk) samt engelsk, tysk, fransk, spansk, nederlandsk og
              japansk. Vi tester både språklig kvalitet og kulturell relevans i
              alle markeder.
            </p>
            <div className="flex gap-2 mt-md flex-wrap">
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                NO — Norsk
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                SV — Svenska
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                DA — Dansk
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                FI — Suomi
              </span>
            </div>
          </div>

          {/* Feature 3: CI/CD Integration */}
          <div className="bg-surface border border-surface-container-highest rounded-lg p-md hover:-translate-y-1 transition-transform duration-200">
            <div className="w-12 h-12 bg-primary-container/20 rounded-DEFAULT flex items-center justify-center mb-md">
              <GitBranch className="text-primary" size={24} />
            </div>
            <h3 className="font-h3 text-[24px] font-semibold text-on-background mb-xs">
              CI/CD-integrasjon
            </h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant font-medium mb-sm">
              Seamless CI/CD pipeline integration
            </p>
            <p className="font-body-sm text-[14px] text-on-surface-variant">
              Integrer QA-testene direkte i din utviklingspipeline — GitHub
              Actions, GitLab CI, Jenkins eller Azure DevOps. Automatiserte
              tester kjøres ved hver deploy, og eventuelle kvalitetsavvik
              rapporteres umiddelbart før de når produksjon.
            </p>
            <div className="flex gap-2 mt-md">
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                GitHub Actions
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                GitLab CI
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                Jenkins
              </span>
            </div>
          </div>

          {/* Feature 4: EU AI Act Compliance */}
          <div className="bg-surface border border-surface-container-highest rounded-lg p-md hover:-translate-y-1 transition-transform duration-200">
            <div className="w-12 h-12 bg-primary-container/20 rounded-DEFAULT flex items-center justify-center mb-md">
              <ShieldCheck className="text-primary" size={24} />
            </div>
            <h3 className="font-h3 text-[24px] font-semibold text-on-background mb-xs">
              EU AI Act — Samsvarsjekker
            </h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant font-medium mb-sm">
              EU AI Act compliance checks
            </p>
            <p className="font-body-sm text-[14px] text-on-surface-variant">
              Norsk næringsliv må forholde seg til EUs AI Act. Våre
              samsvarsjekker sikrer at dine AI-systemer oppfyller kravene til
              åpenhet, dokumentasjon, risikostyring og menneskelig tilsyn — slik
              at du unngår bøter og omdømmetap.
            </p>
            <div className="flex gap-2 mt-md">
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                Risikostyring
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                Dokumentasjon
              </span>
              <span className="inline-block bg-surface-container px-2 py-1 rounded-DEFAULT font-label-caps text-[10px] uppercase font-semibold text-on-surface-variant">
                Åpenhet
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-on-background text-surface py-xl">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-xl">
            <h2 className="font-h2 text-[30px] font-semibold text-surface mb-sm">
              Slik fungerer det
            </h2>
            <p className="font-body-md text-outline-variant max-w-2xl mx-auto">
              How the AI QA testing pipeline works — from setup to production
              monitoring.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-gutter relative">
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-tint/20 border border-surface-tint flex items-center justify-center font-button text-[14px] font-medium text-surface-tint mb-xs">
                1
              </div>
              <h3 className="font-button text-[14px] font-medium text-surface">
                Konfigurer / Configure
              </h3>
              <p className="font-body-sm text-[14px] text-outline-variant">
                Vi definerer testrammeverk, språk, målgrupper og akseptkriterier
                basert på dine AI-systemer og forretningsbehov.
              </p>
            </div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-tint/20 border border-surface-tint flex items-center justify-center font-button text-[14px] font-medium text-surface-tint mb-xs">
                2
              </div>
              <h3 className="font-button text-[14px] font-medium text-surface">
                Test automatisk / Auto-test
              </h3>
              <p className="font-body-sm text-[14px] text-outline-variant">
                Våre AI-agenter kjører tusenvis av testsenarioer på tvers av
                språk — døgnet rundt, integrert i din pipeline.
              </p>
            </div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-tint/20 border border-surface-tint flex items-center justify-center font-button text-[14px] font-medium text-surface-tint mb-xs">
                3
              </div>
              <h3 className="font-button text-[14px] font-medium text-surface">
                Analyser &amp; Rapporter
              </h3>
              <p className="font-body-sm text-[14px] text-outline-variant">
                Detaljerte rapporter med poengsummer, feilkategorisering og
                forbedringsforslag — klare for utviklerteamet ditt.
              </p>
            </div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-tint/20 border border-surface-tint flex items-center justify-center font-button text-[14px] font-medium text-surface-tint mb-xs">
                4
              </div>
              <h3 className="font-button text-[14px] font-medium text-surface">
                Overvåk &amp; Forbedre
              </h3>
              <p className="font-body-sm text-[14px] text-outline-variant">
                Kontinuerlig overvåking i produksjon. Ved kvalitetsavvik
                varsles teamet ditt umiddelbart for rask korrigering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Details */}
      <section className="bg-surface border-y border-surface-container-highest py-xl">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div>
              <h2 className="font-h2 text-[30px] font-semibold text-on-background mb-sm">
                EU AI Act-beredskap for norske bedrifter
              </h2>
              <p className="font-body-md text-on-surface-variant mb-md">
                EU AI Act readiness for Norwegian enterprises.
              </p>
              <p className="font-body-sm text-[14px] text-on-surface-variant mb-md">
                EUs AI-forordning trer i kraft i løpet av 2025–2026 og stiller
                strenge krav til høyrisiko KI-systemer — inkludert
                kundesamtaleagenter og chatbots. Vår QA-testing hjelper deg
                med:
              </p>
              <ul className="space-y-sm">
                {[
                  {
                    label: "Risikostyring / Risk management",
                    desc: "Identifisere og dokumentere risiko i dine AI-systemer",
                  },
                  {
                    label: "Data governance",
                    desc: "Sikre at treningsdata er relevant og feilfri",
                  },
                  {
                    label: "Teknisk dokumentasjon",
                    desc: "Automatisk generert dokumentasjon for myndighetene",
                  },
                  {
                    label: "Menneskelig tilsyn",
                    desc: "Verifisere at sluttbrukere kan overstyre AI-avgjørelser",
                  },
                  {
                    label: "Nøyaktighet & åpenhet",
                    desc: "Dokumentere feilrater og tydeliggjøre AI-bruk",
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-sm p-sm bg-surface-container-low rounded-DEFAULT border border-surface-container-highest"
                  >
                    <CheckCircle2
                      className="text-primary mt-0.5 shrink-0"
                      size={18}
                    />
                    <div>
                      <span className="font-button text-[14px] font-medium text-on-background">
                        {item.label}
                      </span>
                      <p className="font-body-sm text-[14px] text-on-surface-variant">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-low border border-surface-container-highest rounded-lg p-lg">
              <div className="flex items-center gap-2 text-primary font-label-caps text-[12px] uppercase tracking-wider font-semibold mb-sm">
                <BarChart3 size={16} />
                Testing Dashboard
              </div>
              <h3 className="font-h3 text-[24px] font-semibold text-on-background mb-sm">
                Se kvalitetsdata i sanntid
              </h3>
              <p className="font-body-sm text-[14px] text-on-surface-variant mb-md">
                Vårt dashboard gir deg full oversikt over alle tester, resultater
                og compliance-status — på tvers av alle språk og modeller.
              </p>
              <div className="space-y-sm">
                {[
                  "Bestått / Passed: 1,847 tester",
                  "Feilet / Failed: 12 tester",
                  "Compliance-status: 96% oppfylt",
                  "Siste testkjøring: 2 min siden",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-on-surface-variant border-b border-surface-container-highest pb-sm last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-xl">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-xl text-center">
          <h2 className="font-h2 text-[30px] font-semibold text-on-background mb-sm">
            Klar for å kvalitetssikre dine AI-systemer?
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto mb-md">
            Ready to ensure your AI agents deliver flawless, compliant responses
            across every language? La oss ta en uforpliktende prat.
          </p>
          <div className="flex flex-col sm:flex-row gap-sm justify-center">
            <Link
              to="/request-services"
              className="bg-primary text-on-primary font-button text-[14px] font-medium px-md py-sm rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Be om tilbud — Request a Quote
              <ArrowUpRight size={16} />
            </Link>
            <a
              href="mailto:contact@multilingual.no"
              className="bg-transparent text-on-background border border-surface-container-highest font-button text-[14px] font-medium px-md py-sm rounded-DEFAULT hover:bg-surface-container-low transition-colors inline-flex items-center justify-center gap-2"
            >
              Kontakt oss — Contact Us
            </a>
          </div>
          <p className="font-body-sm text-[14px] text-on-surface-variant mt-md">
            🇳🇴 Basert i Norge — Vi forstår nordisk regelverk og språknyanser
          </p>
        </div>
      </section>
    </main>
  );
}

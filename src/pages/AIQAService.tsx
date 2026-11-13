/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Link } from "react-router-dom";
import CinematicHero from "../components/CinematicHero";
import HingeStack from "../components/HingeStack";
import Process, { type Step } from "../components/Process";
import { btnPrimary, btnSecondary, container, h2, lede } from "../lib/classes";
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
      <HingeStack
        id="checks"
        kicker="Checks"
        title="Four questions for every answer."
        lede="The same four, applied to the output you send."
        items={checks}
        columns={1}
      />
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


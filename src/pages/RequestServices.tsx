import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { checkRateLimit, incrementRateLimit, getRemainingRequests } from "../lib/rateLimit";
import { btnPrimary, container, field, fieldError, fieldLabel, h2, kicker, lede, panel } from "../lib/classes";
import { usePageTitle } from "../lib/usePageTitle";

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  company: z.string().trim().max(150),
  email: z.string().trim().email("Invalid email address").max(200),
  projectTitle: z.string().trim().min(2, "Project title is required").max(200),
  description: z.string().trim().max(5000),
  budget: z.string().max(50),
  contentType: z.string().max(50),
  estimatedWords: z.coerce.number().optional().default(0),
  sourceLanguage: z.string().max(50),
  targetLanguages: z.string().trim().max(500),
  services: z.array(z.string()).max(10),
  preferredStartDate: z.string().max(50),
  deliveryDeadline: z.string().max(50),
  // Honeypot field: bots tend to autofill; legitimate users leave it empty.
  // This field is validated client-side only and stripped before submission
  // (the Firestore security rules require exactly 14 payload keys).
  website: z.string().max(0, "Bot detected").optional().default(""),
});

type FormValues = z.input<typeof formSchema>;
type FormData = z.output<typeof formSchema>;

const serviceOptions = [
  {
    value: "standard",
    title: "Localisation",
    body: "Translation with context and the terms you specify.",
  },
  {
    value: "transcreation",
    title: "Transcreation",
    body: "A rewrite when a direct translation would miss the point.",
  },
  {
    value: "seo",
    title: "Search wording",
    body: "Headings and phrases adapted to how people search.",
  },
  {
    value: "cultural",
    title: "Cultural review",
    body: "Notes on references that do not travel.",
  },
  {
    value: "interpretation",
    title: "Interpretation",
    body: "Spoken transfer between Norwegian, Turkish, and English.",
  },
];

export default function RequestServices() {
  usePageTitle("Web-ID | Request a review");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);
  const remaining = getRemainingRequests();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues, unknown, FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      projectTitle: "",
      description: "",
      budget: "",
      contentType: "web",
      estimatedWords: 0,
      sourceLanguage: "en",
      targetLanguages: "",
      services: [],
      preferredStartDate: "",
      deliveryDeadline: "",
      website: "",
    },
  });

  useEffect(() => {
    if (submitSuccess) successRef.current?.focus();
  }, [submitSuccess]);

  const onSubmit = async (data: FormData) => {
    // Silent drop on honeypot hit to avoid signaling detection to bots.
    if (data.website && data.website.length > 0) {
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    // Client-side rate limit check
    if (!checkRateLimit()) {
      setSubmitError("You have reached the daily submission limit of 100 requests. Please try again tomorrow.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Strip the honeypot; Firestore rules require exactly 14 keys.
      const { website: _honeypot, ...payload } = data;
      await addDoc(collection(db, "quoteRequests"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
      // Increment only after successful submission
      incrementRateLimit();
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Firebase Error: ", err);
      setSubmitError(
        "The request was not submitted. Check the connection and try again, or email support@multilingual.no.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <main className={`${container} flex min-h-[70vh] items-center pt-28 pb-16`}>
        <div className="max-w-lg">
          <p className={kicker}>Request</p>
          <h1
            ref={successRef}
            tabIndex={-1}
            className={`${h2} mt-4 outline-none`}
          >
            Request received
          </h1>
          <p className={`${lede} mt-5`}>
            It is saved. You will get a reply at the email address you entered.
          </p>
          <Link to="/" className={`${btnPrimary} mt-8`}>
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`${container} pt-28 pb-20`}>
      <div className="max-w-3xl">
        <p className={kicker}>Request</p>
        <h1 className={`${h2} mt-4`}>Request a review</h1>
        <p className={`${lede} mt-5`}>
          Say what the text is, which languages are involved, and when you need it. The form is
          stored so it can be answered. It is not published.
        </p>
        {remaining <= 10 && (
          <p className="mt-5 border border-outline-variant px-4 py-3 text-sm text-on-surface" role="status">
            You have {remaining} submission{remaining === 1 ? "" : "s"} left today.
          </p>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {submitError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {submitError}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-10000px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
            >
              <label htmlFor="website-url">Leave this field empty</label>
              <input
                {...register("website")}
                id="website-url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <section className={panel}>
              <h2 className="font-display text-3xl text-on-surface">Client details</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className={fieldLabel}>
                    Full name *
                  </label>
                  <input
                    {...register("fullName")}
                    id="fullName"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    autoComplete="name"
                    required
                    className={field}
                    placeholder="Ada Nordmann"
                    type="text"
                  />
                  {errors.fullName && (
                    <span id="fullName-error" role="alert" className={fieldError}>
                      {errors.fullName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="company" className={fieldLabel}>
                    Company
                  </label>
                  <input
                    {...register("company")}
                    id="company"
                    autoComplete="organization"
                    className={field}
                    type="text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className={fieldLabel}>
                    Work email *
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    inputMode="email"
                    required
                    className={field}
                    placeholder="ada@example.com"
                    type="email"
                  />
                  {errors.email && (
                    <span id="email-error" role="alert" className={fieldError}>
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className={panel}>
              <h2 className="font-display text-3xl text-on-surface">Project</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="projectTitle" className={fieldLabel}>
                    Project title *
                  </label>
                  <input
                    {...register("projectTitle")}
                    id="projectTitle"
                    aria-invalid={errors.projectTitle ? "true" : "false"}
                    aria-describedby={errors.projectTitle ? "projectTitle-error" : undefined}
                    required
                    className={field}
                    placeholder="Product UI into Norwegian"
                    type="text"
                  />
                  {errors.projectTitle && (
                    <span id="projectTitle-error" role="alert" className={fieldError}>
                      {errors.projectTitle.message}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="description" className={fieldLabel}>
                    Brief description
                  </label>
                  <textarea
                    {...register("description")}
                    id="description"
                    className={`${field} resize-y`}
                    placeholder="What the text is for, and what must not change."
                    rows={4}
                  />
                </div>
                <div>
                  <label htmlFor="budget" className={fieldLabel}>
                    Estimated budget (USD)
                  </label>
                  <select {...register("budget")} id="budget" className={field}>
                    <option value="">Select a range</option>
                    <option value="under_5k">Under $5,000</option>
                    <option value="5k_15k">$5,000 - $15,000</option>
                    <option value="15k_50k">$15,000 - $50,000</option>
                    <option value="over_50k">$50,000+</option>
                  </select>
                </div>
              </div>
            </section>

            <section className={panel}>
              <h2 className="font-display text-3xl text-on-surface">Languages</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="contentType" className={fieldLabel}>
                    Content type
                  </label>
                  <select {...register("contentType")} id="contentType" className={field}>
                    <option value="web">Web application</option>
                    <option value="mobile">Mobile app</option>
                    <option value="marketing">Marketing material</option>
                    <option value="technical">Technical documentation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estimatedWords" className={fieldLabel}>
                    Estimated word count
                  </label>
                  <input
                    {...register("estimatedWords")}
                    id="estimatedWords"
                    className={field}
                    placeholder="10000"
                    type="number"
                    min={0}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label htmlFor="sourceLanguage" className={fieldLabel}>
                    Source language
                  </label>
                  <select {...register("sourceLanguage")} id="sourceLanguage" className={field}>
                    <option value="en">English (US)</option>
                    <option value="en-gb">English (UK)</option>
                    <option value="no">Norwegian</option>
                    <option value="tr">Turkish</option>
                    <option value="sv">Swedish</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="targetLanguages" className={fieldLabel}>
                    Target languages
                  </label>
                  <input
                    {...register("targetLanguages")}
                    id="targetLanguages"
                    aria-describedby="targetLanguages-hint"
                    className={field}
                    placeholder="Norwegian, Turkish"
                    type="text"
                  />
                  <p id="targetLanguages-hint" className="mt-2 text-sm text-on-surface-variant">
                    Separate multiple languages with commas.
                  </p>
                </div>
              </div>
            </section>

            <section className={panel}>
              <h2 className="font-display text-3xl text-on-surface">Services and dates</h2>
              <fieldset className="mt-6">
                <legend className={fieldLabel}>Required services</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {serviceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 border border-outline-variant p-3 hover:bg-surface-container"
                    >
                      <input
                        {...register("services")}
                        value={option.value}
                        className="mt-1 h-4 w-4 accent-primary"
                        type="checkbox"
                      />
                      <span>
                        <span className="block text-base text-on-surface">{option.title}</span>
                        <span className="mt-1 block text-sm text-on-surface-variant">{option.body}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="preferredStartDate" className={fieldLabel}>
                    Preferred start date
                  </label>
                  <input
                    {...register("preferredStartDate")}
                    id="preferredStartDate"
                    className={field}
                    type="date"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryDeadline" className={fieldLabel}>
                    Delivery deadline
                  </label>
                  <input
                    {...register("deliveryDeadline")}
                    id="deliveryDeadline"
                    className={field}
                    type="date"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button className={`${btnPrimary} min-w-40`} type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? "Sending" : "Submit request"}
              </button>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-4">
          <div className={`${panel} lg:sticky lg:top-28`}>
            <h2 className="font-display text-3xl text-on-surface">What happens next</h2>
            <ol className="mt-6 space-y-5">
              <li>
                <h3 className="text-base font-medium text-on-surface">1. Read</h3>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  The request is read as you sent it.
                </p>
              </li>
              <li>
                <h3 className="text-base font-medium text-on-surface">2. Reply</h3>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  You get an email about scope and fee.
                </p>
              </li>
              <li>
                <h3 className="text-base font-medium text-on-surface">3. Start</h3>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  Work begins after you agree.
                </p>
              </li>
            </ol>
            <p className="mt-8 border-t border-outline-variant pt-5 text-sm text-on-surface-variant">
              Or write to{" "}
              <a className="text-primary hover:underline" href="mailto:contact@multilingual.no">
                contact@multilingual.no
              </a>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

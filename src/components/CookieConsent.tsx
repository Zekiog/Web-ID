import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const STORAGE_KEY = "cookie_consent";
const EXPIRY_DAYS = 365;

const copy = {
  title: "We use cookies",
  body: "This site uses cookies to remember your preferences and to understand how the site is used. We do not collect personal data for that without your consent. You can change this later by clearing site data in your browser settings. Read the",
  privacy: "Privacy Policy",
  accept: "Accept",
  reject: "Reject",
  close: "Close cookie notice",
};

export default function CookieConsent() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
  }, []);

  const save = (choice: "accept" | "reject") => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + EXPIRY_DAYS);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        choice,
        timestamp: new Date().toISOString(),
        expiry: expiry.toISOString(),
      }),
    );
    setOpen(false);
  };

  if (!open) return null;

  const panel = (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      lang="en"
      className="border border-outline-variant bg-surface-container p-5 text-on-surface shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="cookie-title" className="font-display text-2xl tracking-tight">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 text-sm text-on-surface-variant hover:text-on-surface"
          aria-label={copy.close}
        >
          Close
        </button>
      </div>
      <p id="cookie-body" className="mt-3 text-sm leading-relaxed text-on-surface-variant">
        {copy.body}{" "}
        <Link to="/privacy-policy" className="whitespace-nowrap text-primary underline">
          {copy.privacy}
        </Link>
        .
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => save("accept")} className="inline-flex min-h-11 items-center justify-center bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary-container">
          {copy.accept}
        </button>
        <button type="button" onClick={() => save("reject")} className="inline-flex min-h-11 items-center justify-center border border-outline px-5 text-sm font-medium text-on-surface hover:bg-surface-container-high">
          {copy.reject}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-xl">
        {reduce ? (
          panel
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {panel}
          </motion.div>
        )}
      </div>
    </div>
  );
}

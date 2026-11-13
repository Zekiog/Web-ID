/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Link } from "react-router-dom";
import { btnPrimary, btnSecondary } from "../lib/classes";
import { usePageTitle } from "../lib/usePageTitle";

export default function NotFound() {
  usePageTitle("Web-ID | Page not found");

  return (
    <main className="flex min-h-[70vh] items-center px-5 pt-28 pb-16 md:px-8">
      <div className="mx-auto w-full max-w-xl">
        <p className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.22em] text-primary">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight text-on-surface">Page not found</h1>
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
          That address is not on this site.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className={btnPrimary}>
            Back to home
          </Link>
          <Link to="/request-services" className={btnSecondary}>
            Request a review
          </Link>
        </div>
      </div>
    </main>
  );
}

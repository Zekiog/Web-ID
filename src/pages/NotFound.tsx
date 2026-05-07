/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 404 Not Found Page — displayed when the user navigates to a route
 * that doesn't exist. Provides helpful navigation links.
 */
import { Link } from "react-router-dom";
import { SearchX, Home, ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bright px-6 text-center">
      <div className="max-w-md mx-auto w-full flex flex-col items-center gap-md">
        <SearchX size={64} className="text-on-surface-variant" />
        <h1 className="font-h2 text-[32px] font-semibold text-on-surface">Page not found</h1>
        <p className="font-body-md text-on-surface-variant">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-sm mt-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-sm py-xs rounded-md bg-primary text-on-primary font-button hover:bg-primary-container transition-colors"
          >
            <Home size={16} /> Return to Home
          </Link>
          <Link
            to="/request-services"
            className="inline-flex items-center gap-2 px-sm py-xs rounded-md bg-surface-container text-on-surface font-button hover:bg-surface-container-high transition-colors"
          >
            Request Services <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

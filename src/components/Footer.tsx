import { Link } from "react-router-dom";
import { container, kicker } from "../lib/classes";
import { isCvDomain, resolveCrossDomainHref } from "../lib/domain";

const pageLinks = [
  { to: "/", label: "Home" },
  { to: "/ai-qa-service", label: "AI review" },
  { to: "/cv", label: "CV" },
  { to: "/request-services", label: "Request a review" },
];

const legalLinks = [
  { to: "/terms-of-service", label: "Terms of Service" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/impressum", label: "Impressum" },
];

export default function Footer() {
  const cvHost = isCvDomain();

  return (
    <footer className="border-t border-outline-variant bg-background">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-12`}>
        <div className="md:col-span-5">
          <p className="font-display text-4xl text-on-surface">Web-ID</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-surface-variant">
            Language quality in Norwegian, Turkish, and English. Trondheim · Oslo & Remote.
          </p>
        </div>
        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 md:col-span-7">
          <div>
            <p className={kicker}>Pages</p>
            <ul className="mt-4 space-y-2">
              {pageLinks.map((link) => {
                const href = resolveCrossDomainHref(link.to);

                return (
                  <li key={link.to}>
                    {href.startsWith("http") ? (
                      <a href={href} className="text-sm text-on-surface hover:text-primary">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={href} className="text-sm text-on-surface hover:text-primary">
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className={kicker}>Legal</p>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => {
                const href = resolveCrossDomainHref(link.to);

                return (
                  <li key={link.to}>
                    {href.startsWith("http") ? (
                      <a href={href} className="text-sm text-on-surface hover:text-primary">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={href} className="text-sm text-on-surface hover:text-primary">
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <a
              href="mailto:zeki@multilingual.no"
              className="mt-5 inline-block text-sm text-primary hover:underline"
            >
              zeki@multilingual.no
            </a>
          </div>
        </nav>
      </div>
      <div className={`${container} border-t border-outline-variant py-5 text-sm text-on-surface-variant`}>
        © 2026 multilingual.no
      </div>
    </footer>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/#services", label: "Services" },
  { to: "/ai-qa-service", label: "AI review", path: "/ai-qa-service" },
  { to: "/#process", label: "Process" },
  { to: "/#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const content = document.getElementById("content");
    const footer = document.querySelector("footer");
    content?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      content?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/80 bg-background/95 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Web-ID, home">
          <img src="/logo.webp" alt="" width={192} height={192} className="h-9 w-9" />
          <span className="font-display text-2xl tracking-tight text-on-surface">Web-ID</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={link.path && pathname === link.path ? "page" : undefined}
              className={`px-3 py-2 text-sm hover:text-on-surface ${
                link.path && pathname === link.path ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/request-services"
            className="inline-flex min-h-11 items-center justify-center bg-primary px-3 text-sm font-medium text-on-primary hover:bg-primary-container sm:px-5"
          >
            Request
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-on-surface md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-background px-5 py-6 md:hidden"
        >
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="border-b border-outline-variant py-4 font-display text-3xl text-on-surface"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/request-services"
              className="py-4 font-display text-3xl text-primary"
              onClick={() => setOpen(false)}
            >
              Request a review
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

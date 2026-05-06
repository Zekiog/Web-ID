import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-bright/90 backdrop-blur-md border-b border-surface-container-highest shadow-sm font-['Inter'] antialiased text-on-surface transition-all duration-200 ease-out">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="multilingual.no Logo" className="h-8 w-auto" />
        </Link>
        <div className="hidden md:flex items-center space-x-sm">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-sm px-3 py-2 font-button text-button inline-flex items-center gap-1"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              Services / Tjenester
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-surface-bright border border-surface-container-highest rounded-lg shadow-lg py-1 z-50">
                <Link
                  to="/#services"
                  className="block px-4 py-3 hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setServicesOpen(false)}
                >
                  <div className="font-button text-[14px] font-medium text-on-surface">Localization Services</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant">
                    Oversettelse, transcreation, SEO
                  </div>
                </Link>
                <Link
                  to="/ai-qa-service"
                  className="block px-4 py-3 hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors border-t border-surface-container-highest"
                  onClick={() => setServicesOpen(false)}
                >
                  <div className="font-button text-[14px] font-medium text-on-surface">AI QA Testing</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant">
                    Flerspråklig kvalitetstesting for KI-agenter
                  </div>
                </Link>
              </div>
            )}
          </div>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-sm px-3 py-2 font-button text-button"
            href="/#how-it-works"
          >
            How it Works
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-sm px-3 py-2 font-button text-button"
            href="/#about"
          >
            About
          </a>
        </div>
        <Link
          to="/request-services"
          className="bg-primary text-on-primary font-button text-button px-sm py-xs rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

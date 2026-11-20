/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsent from "./components/CookieConsent";
import SmoothScroll from "./components/SmoothScroll";
import Home from "./pages/Home";

const RequestServices = lazy(() => import("./pages/RequestServices"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Impressum = lazy(() => import("./pages/Impressum"));
const AIQAService = lazy(() => import("./pages/AIQAService"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };

    if (!id) {
      toTop();
      return;
    }

    const started = performance.now();
    let frame = 0;
    const tick = () => {
      const target = document.getElementById(id);
      if (target) {
        if (lenis) lenis.scrollTo(target, { immediate: true, offset: -88 });
        else target.scrollIntoView();
        return;
      }
      if (performance.now() - started > 2000) {
        toTop();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hash, lenis, pathname]);

  return null;
}

function RouteFallback() {
  return (
    <main className="min-h-svh" aria-busy="true">
      <p className="sr-only">Loading</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-background">
          <a href="#content" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <div className="min-h-svh flex-grow" id="content">
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/request-services" element={<RequestServices />} />
                  <Route path="/ai-qa-service" element={<AIQAService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/impressum" element={<Impressum />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
          <Footer />
          <CookieConsent />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}

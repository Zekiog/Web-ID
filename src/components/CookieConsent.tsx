/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cookie Consent Banner — GDPR (Art. 6, 7) uyumlu çerez rızası.
 * Kullanıcı seçimleri localStorage'da saklanır.
 */
import { useEffect, useState } from "react";
import { Cookie, X, Info } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_CONSENT_EXPIRY_DAYS = 365;

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // localStorage'dan mevcut rızayı yükle
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      setConsent(savedConsent);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice: "accept" | "reject") => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_CONSENT_EXPIRY_DAYS);
    
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        choice,
        timestamp: new Date().toISOString(),
        expiry: expiryDate.toISOString(),
      })
    );
    setConsent(choice);
    setIsVisible(false);
  };

  if (!isVisible || consent) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-surface-container p-md rounded-lg shadow-lg border border-outline-variant">
      <div className="flex items-start gap-sm">
        <Cookie size={24} className="text-primary flex-shrink-0 mt-xs" />
        <div className="flex-1">
          <h3 className="font-button text-on-surface flex items-center gap-2">
            Çerezleri Kullanıyoruz
            <Link
              to="/privacy-policy"
              className="text-primary hover:underline flex items-center gap-1 text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Info size={12} /> Detaylar
            </Link>
          </h3>
          <p className="font-body-xs text-on-surface-variant mt-xs">
            Bu web sitesi, deneyiminizi kişiselleştirmek ve analizler yapmak için çerezleri kullanır.
            Rızanız olmadan hiçbir kişisel veri toplanmaz.
          </p>
          <div className="flex flex-col sm:flex-row gap-sm mt-sm">
            <button
              onClick={() => handleConsent("accept")}
              className="inline-flex items-center justify-center gap-2 px-sm py-xs rounded-md bg-primary text-on-primary font-button hover:bg-primary-container transition-colors"
            >
              Kabul Et
            </button>
            <button
              onClick={() => handleConsent("reject")}
              className="inline-flex items-center justify-center gap-2 px-sm py-xs rounded-md bg-surface-container-high text-on-surface font-button hover:bg-surface-container-highest transition-colors"
            >
              Reddet
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-on-surface-variant hover:text-on-surface transition-colors p-xs -mt-xs -mr-xs"
          aria-label="Banner'ı kapat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "cookie-consent-accepted";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      data-testid="banner-cookie-consent"
    >
      <div className="bg-black/95 backdrop-blur border-t border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <p className="text-sm text-white/80 flex-1 leading-relaxed">
            We use cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.
            {" "}
            <Link href="/privacy-policy" className="underline text-white hover:text-white/70 transition-colors" data-testid="link-privacy-policy">
              Privacy Policy
            </Link>
            {" "}
            <Link href="/cookie-choices" className="underline text-white hover:text-white/70 transition-colors" data-testid="link-cookie-choices">
              Cookie Choices
            </Link>
          </p>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-none px-5 py-2.5 text-sm font-semibold text-white border border-white/30 rounded hover:border-white/60 transition-colors"
              data-testid="button-decline-cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-5 py-2.5 text-sm font-bold text-black bg-white rounded hover:bg-white/90 transition-colors"
              data-testid="button-accept-cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

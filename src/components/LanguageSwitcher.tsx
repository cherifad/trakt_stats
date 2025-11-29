"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageSwitcherProps {
  currentLocale?: "en" | "fr";
  onLocaleChange?: (locale: "en" | "fr") => void;
}

export function LanguageSwitcher({
  currentLocale: propLocale,
  onLocaleChange,
}: LanguageSwitcherProps = {}) {
  const [currentLocale, setCurrentLocale] = useState(() => {
    if (propLocale) return propLocale;
    if (typeof window !== "undefined") {
      // Check localStorage first, then cookie
      const localStorageLocale = localStorage.getItem("locale");
      if (localStorageLocale === "en" || localStorageLocale === "fr") {
        return localStorageLocale;
      }
      return (
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("locale="))
          ?.split("=")[1] || "en"
      );
    }
    return "en";
  });
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const handleLanguageChange = (locale: "en" | "fr") => {
    if (onLocaleChange) {
      // Use provided callback (for pages managing their own locale)
      onLocaleChange(locale);
    } else {
      // Update state first, side effects will be handled in useEffect
      setCurrentLocale(locale);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!onLocaleChange && typeof window !== "undefined") {
      // Sync localStorage and cookie with current locale
      localStorage.setItem("locale", currentLocale);
      document.cookie = `locale=${currentLocale}; path=/; max-age=31536000`;

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("localeChange"));
    }
  }, [currentLocale, onLocaleChange]);

  const displayLocale = propLocale || currentLocale;
  const currentLanguage =
    languages.find((lang) => lang.code === displayLocale) || languages[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 glass border border-white/10"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  onClick={() =>
                    handleLanguageChange(language.code as "en" | "fr")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    displayLocale === language.code ? "bg-white/10" : ""
                  }`}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <span className="text-sm font-medium">{language.name}</span>
                  {displayLocale === language.code && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

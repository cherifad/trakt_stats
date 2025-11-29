"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export function useLocale() {
  const searchParams = useSearchParams();

  // Initialize locale from URL or localStorage
  const [locale, setLocaleState] = useState<"en" | "fr">(() => {
    if (typeof window === "undefined") return "en";

    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");

    if (urlLang === "fr") {
      return "fr";
    }

    const savedLocale = localStorage.getItem("locale");
    return savedLocale === "fr" ? "fr" : "en";
  });

  const updateURL = useCallback(
    (newLocale: "en" | "fr", push: boolean = true) => {
      const url = new URL(window.location.href);

      if (newLocale === "fr") {
        url.searchParams.set("lang", "fr");
      } else {
        // Remove lang param for English (default)
        url.searchParams.delete("lang");
      }

      if (push) {
        window.history.pushState({}, "", url);
      } else {
        window.history.replaceState({}, "", url);
      }
    },
    []
  );

  useEffect(() => {
    // Sync URL with current locale state on mount
    const urlLang = searchParams.get("lang");
    const expectedUrlState = locale === "fr" ? "fr" : null;

    if ((urlLang === "fr") !== (expectedUrlState === "fr")) {
      updateURL(locale, false);
    }

    // Store in localStorage
    localStorage.setItem("locale", locale);
  }, [locale, searchParams, updateURL]);

  const setLocale = useCallback(
    (newLocale: "en" | "fr") => {
      setLocaleState(newLocale);
      localStorage.setItem("locale", newLocale);

      // Update URL
      updateURL(newLocale, true);

      // Dispatch events for other components
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("localeChange"));
    },
    [updateURL]
  );

  return { locale, setLocale };
}

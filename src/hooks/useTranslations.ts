"use client";

import { useState, useEffect } from "react";
import enMessages from "@/../messages/en.json";
import frMessages from "@/../messages/fr.json";

type Messages = typeof enMessages;

// Helper to get locale from localStorage or cookie
function getLocale(): string {
  if (typeof window === "undefined") return "en";

  // Check localStorage first (priority)
  const localStorageLocale = localStorage.getItem("locale");
  if (localStorageLocale === "en" || localStorageLocale === "fr") {
    return localStorageLocale;
  }

  // Fallback to cookie
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1] || "en"
  );
}

export function useTranslations() {
  // Initialize with the correct locale immediately
  const [messages, setMessages] = useState<Messages>(() => {
    if (typeof window === "undefined") return enMessages;
    const locale = getLocale();
    return locale === "fr" ? frMessages : enMessages;
  });

  useEffect(() => {
    // Update messages when locale changes
    const updateLocale = () => {
      const locale = getLocale();
      setMessages(locale === "fr" ? frMessages : enMessages);
    };

    // Initial update
    updateLocale();

    // Listen for custom locale change event
    const handleLocaleChange = () => {
      updateLocale();
    };

    // Listen for storage events (when localStorage changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "locale" || e.key === null) {
        updateLocale();
      }
    };

    window.addEventListener("localeChange", handleLocaleChange);
    window.addEventListener("storage", handleStorageChange);

    // Fallback: check for changes periodically (but less frequently)
    const interval = setInterval(updateLocale, 500);

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split(".");
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== "string") {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return t;
}

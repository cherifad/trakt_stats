import { useTranslations } from "@/hooks/useTranslations";

// Simple pluralization helper that uses translation keys for singular/plural.
export function formatCount(
  t: (key: string, params?: Record<string, any>) => string,
  count: number,
  singularKey: string,
  pluralKey: string
) {
  const key = count === 1 ? singularKey : pluralKey;
  return t(key, { count });
}

// Hook helper to get translations and format counts easily in components
export function useI18n() {
  const t = useTranslations();
  return {
    t,
    formatCount: (count: number, singularKey: string, pluralKey: string) =>
      formatCount(t, count, singularKey, pluralKey),
  };
}

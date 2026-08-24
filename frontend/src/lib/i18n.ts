// Client-side i18n hook that loads messages/*.json based on a locale cookie.
// Lightweight implementation used while not using an external i18n library.
import { useEffect, useState, useCallback } from "react";
import { defaultLocale } from "../i18n/config";

type Messages = Record<string, unknown>;

const cache: Record<string, Messages | null> = {};

function getLocaleFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function lookup(messages: Messages, key: string, namespace?: string): string | undefined {
  const full = namespace ? `${namespace}.${key}` : key;
  const parts = full.split(".");
  let cur: unknown = messages;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    const asRecord = cur as Record<string, unknown>;
    cur = asRecord[p];
  }
  if (typeof cur === "string") return cur;
  return undefined;
}

export function useTranslations(namespace?: string) {
  const [messages, setMessages] = useState<Messages | null>(() => {
    // Prefer server-hydrated global when available (set in Providers)
    const initial =
      typeof window !== "undefined"
        ? (window as Window & { __INITIAL_I18N?: { locale?: string; messages?: Messages } }).__INITIAL_I18N
        : null;
    if (initial && initial.messages) {
      const locale = initial.locale || defaultLocale;
      cache[locale] = initial.messages;
      return cache[locale];
    }
    const locale = getLocaleFromCookie() || defaultLocale;
    return cache[locale] ?? null;
  });

  useEffect(() => {
    let mounted = true;
    const initial =
      typeof window !== "undefined"
        ? (window as Window & { __INITIAL_I18N?: { locale?: string; messages?: Messages } }).__INITIAL_I18N
        : null;
    const locale = initial?.locale || getLocaleFromCookie() || defaultLocale;
    if (initial && initial.messages) {
      cache[locale] = initial.messages;
      setMessages(cache[locale]);
      return;
    }

    if (cache[locale]) {
      setMessages(cache[locale]);
      return;
    }

    import(`../../messages/${locale}.json`)
      .then((m) => (m && (m.default || m)))
      .then((msgs) => {
        cache[locale] = msgs || {};
        if (mounted) setMessages(cache[locale]);
      })
      .catch(() => {
        cache[locale] = {};
        if (mounted) setMessages(cache[locale]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      if (!messages) return key;
      const v = lookup(messages, key, namespace);
      let result = (v as string) ?? key;
      if (vars && typeof result === "string") {
        for (const [k, val] of Object.entries(vars)) {
          result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(val));
        }
      }
      return result;
    },
    [messages, namespace]
  );

  return t;
}

export function useLocale(): string {
  return getLocaleFromCookie() || defaultLocale;
}
// Client-side i18n hook that loads messages/*.json based on a locale cookie.
// This avoids requiring `next-intl` and ensures a language switch (cookie + reload)
// will load the correct messages for client components.

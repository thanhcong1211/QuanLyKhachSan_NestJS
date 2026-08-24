// Client-side i18n hook backed by React Context. Messages are provided
// synchronously by the server (see app/layout.tsx -> Providers), avoiding
// any client-side fetch/import race and hydration mismatch.
"use client";

import { createContext, useContext, useCallback } from "react";
import { defaultLocale } from "../i18n/config";

type Messages = Record<string, unknown>;

type I18nContextValue = {
  locale: string;
  messages: Messages;
};

export const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  messages: {},
});

export const I18nProvider = I18nContext.Provider;

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
  const { messages } = useContext(I18nContext);

  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const v = lookup(messages, key, namespace);
      let result = v ?? key;
      if (vars) {
        for (const [k, val] of Object.entries(vars)) {
          result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(val));
        }
      }
      return result;
    },
    [messages, namespace]
  );
}

export function useLocale(): string {
  return useContext(I18nContext).locale;
}

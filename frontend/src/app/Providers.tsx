"use client";

import React from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/redux/store";
import { queryClient } from "@/api/queryClient";
import { I18nProvider } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: Record<string, unknown>;
};

export default function Providers({ children, initialLocale, initialMessages }: Props) {
  return (
    <I18nProvider value={{ locale: initialLocale, messages: initialMessages }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    </I18nProvider>
  );
}

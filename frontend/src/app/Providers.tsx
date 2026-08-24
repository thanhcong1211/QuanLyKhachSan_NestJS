"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/redux/store";
import { queryClient } from "@/api/queryClient";

type Props = {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: Record<string, unknown>;
};

export default function Providers({ children, initialLocale, initialMessages }: Props) {
  useEffect(() => {
    // Hydrate a global that client lib can read to avoid an extra fetch on first render
    type I18nWindow = Window & {
      __INITIAL_I18N?: { locale: string; messages: Record<string, unknown> };
    };
    const w = window as I18nWindow;
    w.__INITIAL_I18N = {
      locale: initialLocale,
      messages: initialMessages,
    };
  }, [initialLocale, initialMessages]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}

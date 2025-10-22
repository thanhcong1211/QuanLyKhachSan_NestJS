"use client";

// Apply Ant Design v5 patch for React 19 compatibility globally
import '@ant-design/v5-patch-for-react-19';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import MainLayout from "@/layouts/MainLayout";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <MainLayout>{children}</MainLayout>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}

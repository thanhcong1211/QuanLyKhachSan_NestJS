"use client";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // không auto refetch khi đổi tab
      retry: 1,                    // thử lại 1 lần khi lỗi
      staleTime: 1000 * 60 * 2,    // cache 2 phút
    },
  },
});

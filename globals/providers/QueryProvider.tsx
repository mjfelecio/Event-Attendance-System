"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Metadata (events, students, stats) rarely changes second to
            // second; a short stale window prevents redundant refetches while
            // mutations still invalidate precisely for freshness where needed.
            staleTime: 60_000,
            // Refetching every time the tab regains focus is wasteful here and
            // caused visible reloads; rely on staleTime + explicit invalidation.
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;

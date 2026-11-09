"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";
import { validate as isUUID } from "uuid";

import { Toaster } from "@web/components/common/Toaster";
import { LayoutSelector } from "@web/components/Layouts/LayoutSelector";
import { DisabledButtonsCacheProvider } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import "@web/i18n/config";
import { AuthSessionProvider } from "@web/provider/AuthSessionProvider";
import { LightThemeProvider } from "@web/provider/LightThemeProvider";
import { SessionLoader } from "@web/provider/SessionLoader";
import "@web/public/globals.css";
import { newMenuItems } from "@web/utils/updatedRoutes";

if (process.env.NEXT_PUBLIC_MOCKING_ENABLED === "true") {
  require("../mocks");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export function RootLayout({ children }: Readonly<PropsWithChildren>) {
  const currentPathname = usePathname();

  const formatTitleFromPath = (path: string) => {
    return path
      .replace(/^\//, "")
      .split("/")
      .filter((segment) => segment && !isUUID(segment))
      .map((segment: string) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" | ");
  };

  const newPathName = newMenuItems[currentPathname];

  const pathName = newPathName ? `/${newPathName}` : currentPathname;

  const pageTitle = pathName === "/" ? "Home" : formatTitleFromPath(pathName);

  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/globals.css" as="style" />

        <title>{pageTitle ?? "gurukul.work"}</title>
      </head>

      <body>
        <AuthSessionProvider>
          <SessionLoader>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider
                dateAdapter={AdapterLuxon}
                adapterLocale="en-us"
              >
                <LightThemeProvider>
                  <NuqsAdapter>
                    <DisabledButtonsCacheProvider>
                      <LayoutSelector>{children}</LayoutSelector>
                      <Toaster />
                      <ReactQueryDevtools initialIsOpen={false} />
                    </DisabledButtonsCacheProvider>
                  </NuqsAdapter>
                </LightThemeProvider>
              </LocalizationProvider>
            </QueryClientProvider>
          </SessionLoader>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

// eslint-disable-next-line import/no-default-export
export default RootLayout;

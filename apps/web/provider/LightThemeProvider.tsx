"use client";

import { Theme, appTheme } from "@codezee/sixtify-brahma";
import { ThemeProvider, createTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

export function LightThemeProvider({ children }: Readonly<PropsWithChildren>) {
  const createdAppTheme = createTheme(appTheme(Theme.light));

  return <ThemeProvider theme={createdAppTheme}>{children}</ThemeProvider>;
}

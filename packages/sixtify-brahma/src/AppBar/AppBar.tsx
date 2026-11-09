"use client";

import { Stack } from "@mui/material";
import type { PropsWithChildren } from "react";
import { PadBox } from "../PadBox";
import { StyledAppBar } from "./AppBar.styled";

export type AppBarProps = {
  drawerOpen: boolean;
};

export const AppBar = ({
  drawerOpen,
  children,
}: PropsWithChildren<AppBarProps>) => {
  return (
    <StyledAppBar position="fixed" open={drawerOpen}>
      <Stack
        direction="row"
        alignItems="center"
        minHeight={{ xs: "58px", lg: "64px" }}
      >
        <PadBox
          padding={{
            padding: { lg: "0 20px", md: "0 16px", xs: "0 8px" },
          }}
        >
          {children}
        </PadBox>
      </Stack>
    </StyledAppBar>
  );
};

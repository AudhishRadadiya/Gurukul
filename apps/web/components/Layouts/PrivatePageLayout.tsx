"use client";

import { PadBox, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import { useState, type PropsWithChildren } from "react";

import { Drawer } from "@web/components/Drawer/Drawer";
import { Header } from "@web/components/Header";
import { BranchProvider } from "@web/context/BranchContext";

export function PrivatePageLayout({ children }: Readonly<PropsWithChildren>) {
  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const [isDrawerOpen, setIsDrawerOpen] = useState(
    layout === "mobile" ? false : true
  );

  return (
    <BranchProvider>
      <Stack direction={isMobile ? "column" : "row"}>
        <Drawer open={isDrawerOpen} />

        <Stack spacing="64px" flexGrow={1} sx={{ overflow: "hidden" }}>
          <Header
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <PadBox padding={{ padding: "15px 30px" }}>{children}</PadBox>
          </Box>
        </Stack>
      </Stack>
    </BranchProvider>
  );
}

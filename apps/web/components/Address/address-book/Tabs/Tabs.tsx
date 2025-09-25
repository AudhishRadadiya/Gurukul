"use client";

import { Tabs as BrahmaTabs } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { AddressBook } from "@web/components/Address/address-book/AddressBook/AddressBook";
import { BusinessDetail } from "@web/components/Address/address-book/BusinessDetail/BusinessDetail";
import { FamilyMember } from "@web/components/Address/address-book/FamilyMember/FamilyMember";
import type { OptionKey } from "@web/components/Address/address-book/Tabs/hooks/useTabsOptions";
import {
  addressBookOptionTabs,
  categories,
  useTabOptions,
} from "@web/components/Address/address-book/Tabs/hooks/useTabsOptions";

export function Tabs() {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { menuItems } = useTabOptions();

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    "address-list": <AddressBook />,
    "business-detail": <BusinessDetail />,
    "family-member": <FamilyMember />,
  };

  const [tab] = useQueryState(
    "tab",
    parseAsStringEnum<OptionKey>(addressBookOptionTabs).withDefault(
      "address-list"
    )
  );

  const router = useRouter();

  if (!tab || !Object.keys(categories).includes(tab)) {
    router.replace("/address/address-book?tab=address-list");
  }

  return (
    <Stack gap="10px">
      <Stack bgcolor={lightBlue[50]} borderRadius="5px">
        <BrahmaTabs value={tab} tabs={menuItems} />
      </Stack>

      <Box bgcolor={lightBlue[50]} sx={{ borderRadius: "5px" }}>
        {tab && categoryRenderer[tab]}
      </Box>
    </Stack>
  );
}

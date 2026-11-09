"use client";

import {
  PadBox,
  Tabs as BrahmaTabs,
  ContentBox,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { ActiveEventMasterList } from "@web/components/settings/event-master/EventMasterList/ActiveEventMasterList";
import { InActiveEventMasterList } from "@web/components/settings/event-master/EventMasterList/InActiveEventMasterList";
import type { OptionKey } from "@web/components/settings/event-master/Tabs/hooks/useTabsOptions";
import {
  categories,
  eventMasterOptionTabs,
  useTabOptions,
} from "@web/components/settings/event-master/Tabs/hooks/useTabsOptions";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

export function EventMasterTabs() {
  const { isMobile } = useGetDeviceType();

  const theme = useTheme();

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const { menuItems } = useTabOptions();

  const { lightBlue } = theme.palette.app.color;

  const categoryRenderer: Record<OptionKey, ReactNode> = {
    active: <ActiveEventMasterList />,
    inactive: <InActiveEventMasterList />,
  };

  const [tab] = useQueryState(
    "tab",
    parseAsStringEnum<OptionKey>(eventMasterOptionTabs).withDefault("active")
  );

  if (!tab || !Object.keys(categories).includes(tab)) {
    router.replace("/settings/event-master?tab=active");
  }

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <Stack bgcolor={lightBlue[50]} borderRadius="5px">
        <BrahmaTabs value={tab} tabs={menuItems} />
      </Stack>

      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
            >
              {t("common.master.label", {
                label: t("common.event.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(EVENT_MASTER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  router.push("/settings/event-master?page=add-event-master");
                }}
                label={t("common.button.add", {
                  label: t("common.event.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box
          bgcolor={lightBlue[50]}
          sx={{ borderRadius: "5px", overflow: "hidden", width: "100%" }}
        >
          {tab && categoryRenderer[tab]}
        </Box>
      </ContentBox>
    </Stack>
  );
}

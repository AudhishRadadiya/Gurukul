"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  PadBox,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddDonationModeDialog } from "@web/components/settings/DonationMode/Dialogs/AddDonationModeDialog";
import { DonationModeList } from "@web/components/settings/DonationMode/DonationModeList/DonationModeList";
import { DONATION_MODE_PERMISSION } from "@web/constants/permission/settings/donationMode/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddDonationModeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: donationModeKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
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
              {t("common.mode.label", {
                label: t("donation.menu.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(DONATION_MODE_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("common.mode.label", {
                    label: t("donation.menu.label"),
                  }),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <DonationModeList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddDonationModeDialog } from "@web/components/settings/DonationMode/Dialogs/AddDonationModeDialog";
import { DonationModeBreadcrumbs } from "@web/components/settings/DonationMode/DonationModeBreadcrumbs";
import { DonationModeList } from "@web/components/settings/DonationMode/DonationModeList/DonationModeList";
import { DONATION_MODE_PERMISSION } from "@web/constants/permission/settings/donationMode/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";

// eslint-disable-next-line import/no-default-export
export default function Page() {
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
    <Stack gap="10px">
      <DonationModeBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
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

        <DonationModeList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

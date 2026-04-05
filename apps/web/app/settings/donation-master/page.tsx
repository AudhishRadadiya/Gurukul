"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddDonationMasterDialog } from "@web/components/settings/DonationMaster/Dialogs/AddDonationMasterDialog";
import { DonationMasterBreadcrumbs } from "@web/components/settings/DonationMaster/DonationMasterBreadcrumbs";
import { DonationMasterList } from "@web/components/settings/DonationMaster/DonationMasterList/DonationMasterList";
import { DONATION_MASTER_PERMISSION } from "@web/constants/permission/settings/donationMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddDonationMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: donationMasterKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <DonationMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.master.label", {
                label: t("donation.menu.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(DONATION_MASTER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("common.master.label", {
                    label: t("donation.menu.label"),
                  }),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <DonationMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

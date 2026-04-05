"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddWhatsappSettingDialog } from "@web/components/settings/whatsappSetting/dialogs/AddWhatsappSettingDialog";
import { WhatsappSettingBreadcrumbs } from "@web/components/settings/whatsappSetting/WhatsappSettingBreadcrumbs";
import { WhatsappSettingList } from "@web/components/settings/whatsappSetting/WhatsappSettingList/WhatsappSettingList";
import { WHATSAPP_SETTINGS_PERMISSION } from "@web/constants/permission/settings/whatsappSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddWhatsappSettingDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: whatsappSettingKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <WhatsappSettingBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("whatsappSetting.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(WHATSAPP_SETTINGS_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("whatsappSetting.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <WhatsappSettingList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

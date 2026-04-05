"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddMailSettingDialog } from "@web/components/settings/mailSetting/dialogs/AddMailSettingDialog";
import { MailSettingBreadcrumbs } from "@web/components/settings/mailSetting/MailSettingBreadcrumbs";
import { MailSettingList } from "@web/components/settings/mailSetting/MailSettingList/MailSettingList";
import { EMAIL_SETTINGS_PERMISSION } from "@web/constants/permission/settings/emailSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddMailSettingDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: mailSettingKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <MailSettingBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("mailSetting.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(EMAIL_SETTINGS_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("mailSetting.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <MailSettingList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

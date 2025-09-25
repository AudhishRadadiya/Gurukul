"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  ContentBox,
  PadBox,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { AddSmsSettingsDialog } from "@web/components/settings/smsSettings/dialog/AddSmsSettingsDialog";
import { SmsSettingsBreadcrumbs } from "@web/components/settings/smsSettings/SmsSettingsBreadcrumbs";
import { SmsSettingsList } from "@web/components/settings/smsSettings/smsSettingsList/SmsSettingsList";
import { SMS_SETTINGS_PERMISSION } from "@web/constants/permission/settings/smsSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSmsSettingsDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: suvicharMasterKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <SmsSettingsBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.sms.label", {
                label: t("setting.menu.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(SMS_SETTINGS_PERMISSION.CREATE)}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                startIcon={<Add />}
              >
                {t("common.button.add", {
                  label: t("sms.settings.menu.label"),
                })}
              </Button>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <SmsSettingsList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  PadBox,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import SyncIcon from "@mui/icons-material/Sync";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddSmsSettingsDialog } from "@web/components/settings/smsSettings/dialog/AddSmsSettingsDialog";
import { SmsSettingsList } from "@web/components/settings/smsSettings/smsSettingsList/SmsSettingsList";
import { SMS_SETTINGS_PERMISSION } from "@web/constants/permission/settings/smsSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { smsSettingKeys } from "@web/queryKeysFactories/smsSetting";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const invalidateSmsSettingsList = () => {
    queryClient.invalidateQueries({
      queryKey: smsSettingKeys.listing(),
    });
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSmsSettingsDialog
        open
        onClose={onDialogClose}
        onAddSuccess={invalidateSmsSettingsList}
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
              {t("common.sms.label", {
                label: t("setting.menu.label"),
              })}
            </Typography>

            <Stack direction="row" gap={1} alignItems="center">
              <PermissionGuard
                canAccess={validateAccess(SMS_SETTINGS_PERMISSION.CREATE)}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                  label={t("common.button.add", {
                    label: t("sms.settings.menu.label"),
                  })}
                />
              </PermissionGuard>

              <ButtonLayoutProvider
                variant="outlined"
                onClick={invalidateSmsSettingsList}
                startIcon={<SyncIcon />}
                label={t("sync.label")}
              />
            </Stack>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <SmsSettingsList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

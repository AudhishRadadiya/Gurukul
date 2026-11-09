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
import { AddWhatsappSettingDialog } from "@web/components/settings/whatsappSetting/dialogs/AddWhatsappSettingDialog";
import { WhatsappSettingList } from "@web/components/settings/whatsappSetting/WhatsappSettingList/WhatsappSettingList";
import { WHATSAPP_SETTINGS_PERMISSION } from "@web/constants/permission/settings/whatsappSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

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

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <WhatsappSettingList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

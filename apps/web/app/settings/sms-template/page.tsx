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
import { AddSmsTemplateDialog } from "@web/components/settings/sms-template/dialogs/AddSmsTemplateDialog";
import { SmsTemplateList } from "@web/components/settings/sms-template/smsTemplateList/SmsTemplateList";
import { SMS_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/smsTemplate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSmsTemplateDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: smsTemplateKeys.listing(),
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
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
            >
              {t("sms.template.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(SMS_TEMPLATE_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("sms.template.menu.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <SmsTemplateList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

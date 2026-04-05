"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddSmsTemplateDialog } from "@web/components/settings/sms-template/dialogs/AddSmsTemplateDialog";
import { SmsTemplateBreadcrumbs } from "@web/components/settings/sms-template/SmsTemplateBreadcrumbs";
import { SmsTemplateList } from "@web/components/settings/sms-template/smsTemplateList/SmsTemplateList";
import { SMS_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/smsTemplate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";

// eslint-disable-next-line import/no-default-export
export default function Page() {
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
    <Stack gap="10px">
      <SmsTemplateBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("sms.template.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(SMS_TEMPLATE_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
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

        <SmsTemplateList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

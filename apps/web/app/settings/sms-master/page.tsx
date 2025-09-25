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
import { t } from "i18next";
import { useRef } from "react";

import { AddSMSMasterDialog } from "@web/components/settings/sms-master/dialogs/AddSMSMasterDialog";
import { SMSMasterBreadcrumbs } from "@web/components/settings/sms-master/SMSMasterBreadcrumbs";
import { SMSMasterList } from "@web/components/settings/sms-master/smsMasterList/SMSMasterList";
import { SMS_MASTER_PERMISSION } from "@web/constants/permission/settings/smsMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

export type SMSMasterListRef = {
  refreshSMSMasterList: () => void;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const smsMasterListRef = useRef<SMSMasterListRef>(null);

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSMSMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => smsMasterListRef.current?.refreshSMSMasterList()}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <SMSMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.master.label", {
                label: t("sms.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(SMS_MASTER_PERMISSION.CREATE)}
            >
              <Stack direction="row" gap="5px">
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                >
                  {t("common.button.add", {
                    label: t("common.master.label", {
                      label: t("sms.label"),
                    }),
                  })}
                </Button>
              </Stack>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <SMSMasterList ref={smsMasterListRef} />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

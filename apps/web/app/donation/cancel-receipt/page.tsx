"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { CancelReceiptBreadcrumbs } from "@web/components/Donation/cancelReceipt/CancelReceiptBreadcrumbs";
import { CancelReceiptList } from "@web/components/Donation/cancelReceipt/cancelReceiptList/CancelReceiptList";
import { AddCancelReceiptDialog } from "@web/components/Donation/cancelReceipt/dialogs/AddCancelReceiptDialog";
import { CANCEL_RECEIPT_PERMISSION } from "@web/constants/permission/donation/cancelReceipt/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

export type CancelReceiptListRef = {
  refreshCancelReceiptList: () => void;
};
// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { validateAccess } = useUserPermissions();

  const cancelReceiptListRef = useRef<CancelReceiptListRef>(null);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddCancelReceiptDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          cancelReceiptListRef.current?.refreshCancelReceiptList()
        }
      />
    ),
  };

  return (
    <Stack gap="10px">
      <CancelReceiptBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("cancelReceipt.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(CANCEL_RECEIPT_PERMISSION.CREATE)}
            >
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  onDialogOpen("add");
                }}
              >
                {t("common.button.add", {
                  label: t("cancelReceipt.menu.label"),
                })}
              </Button>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <CancelReceiptList ref={cancelReceiptListRef} />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

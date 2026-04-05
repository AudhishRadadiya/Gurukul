"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  DatePicker,
  PadBox,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useRef } from "react";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { CancelReceiptBreadcrumbs } from "@web/components/Donation/cancelReceipt/CancelReceiptBreadcrumbs";
import { CancelReceiptList } from "@web/components/Donation/cancelReceipt/cancelReceiptList/CancelReceiptList";
import { AddCancelReceiptDialog } from "@web/components/Donation/cancelReceipt/dialogs/AddCancelReceiptDialog";
import { CANCEL_RECEIPT_PERMISSION } from "@web/constants/permission/donation/cancelReceipt/permission";
import { useDateFilters } from "@web/hooks/useDateFilters";
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

  const { control, fromDate, toDate } = useDateFilters();

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

            <Stack direction="row" gap="10px" alignItems="center">
              <DateFilterPeriodAutocomplete
                name="date_filter_period"
                control={control}
                clearIcon
                sx={{ width: "160px" }}
              />

              <DatePicker
                control={control}
                name="from_date"
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <DatePicker
                control={control}
                name="to_date"
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <PermissionGuard
                canAccess={validateAccess(CANCEL_RECEIPT_PERMISSION.CREATE)}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                  label={t("common.button.add", {
                    label: t("cancelReceipt.menu.label"),
                  })}
                />
              </PermissionGuard>
            </Stack>
          </Stack>
        </PadBox>

        <CancelReceiptList
          ref={cancelReceiptListRef}
          externalFilter={{
            from_date: fromDate,
            to_date: toDate,
          }}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

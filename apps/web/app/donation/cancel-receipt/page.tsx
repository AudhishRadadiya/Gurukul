"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { CancelReceiptList } from "@web/components/Donation/cancelReceipt/cancelReceiptList/CancelReceiptList";
import { AddCancelReceiptDialog } from "@web/components/Donation/cancelReceipt/dialogs/AddCancelReceiptDialog";
import { CANCEL_RECEIPT_PERMISSION } from "@web/constants/permission/donation/cancelReceipt/permission";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { Debounce_Delay } from "@web/utils/helper";

export type CancelReceiptListRef = {
  refreshCancelReceiptList: () => void;
};
// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const { validateAccess } = useUserPermissions();

  const cancelReceiptListRef = useRef<CancelReceiptListRef>(null);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const {
    control,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const { control: saveFiltersControl, setValue: setSaveFiltersValue } =
    useForm({
      defaultValues: {
        is_save_filter: false,
      },
    });

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "donation",
  });

  const handleSaveFilters = (checked: boolean) => {
    const payload = checked
      ? {
          from_date: dateRange[0],
          to_date: dateRange[1],
        }
      : {};

    saveFiltersAction({
      filters: payload,
      is_save_filter: checked,
    });
  };

  const onSaveFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setSaveFiltersValue("is_save_filter", checked);

    handleSaveFilters(checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { from_date, to_date } = filters as Record<string, string>;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }
    }
  }, [filters]);

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
      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
            gap="10px"
          >
            <Stack direction="row" gap="12px" alignItems="center">
              <Typography variant="subtitle1">
                {t("cancelReceipt.menu.label")}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              gap="10px"
              alignItems="center"
              flexWrap="wrap"
              justifyContent={{ md: "flex-end", xs: "flex-start" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap="10px"
                flexWrap="wrap"
                sx={{
                  "& > *:not(:first-of-type)": {
                    flex: { md: "0 0 auto", xs: "1 1 160px" },
                    maxWidth: { md: "none", xs: "100%" },
                    minWidth: { md: "auto", xs: "140px" },
                  },
                  flex: { md: "0 1 auto", xs: "1 1 auto" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <SaveFiltersCheckbox
                  name="is_save_filter"
                  control={saveFiltersControl}
                  disabled={isFetchingSavedFilters || isPendingSaveFilters}
                  onChange={onSaveFiltersChange}
                />

                <SearchField
                  name="search"
                  characterType="any-character"
                  letterCase="mixed"
                  control={control}
                />

                <DateRangePickerField
                  name="date_range"
                  control={control}
                  showPresets
                  size="large"
                  placeholder="Select Date Range"
                />
              </Stack>

              <PermissionGuard
                canAccess={validateAccess(CANCEL_RECEIPT_PERMISSION.CREATE)}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  size={isMobile ? "small" : "large"}
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
          search={searchInput}
          externalFilter={{
            from_date: dateRange[0],
            to_date: dateRange[1],
          }}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}

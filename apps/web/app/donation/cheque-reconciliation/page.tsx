"use client";

import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import { ChequeReconciliationFilter } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/ChequeReconciliationFilter";
import { ChequeReconciliationList } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/ChequeReconciliationList";
import type { GetChequeReconciliationExportApiSuccessResponse } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliationExport";
import { useGetChequeReconciliationExport } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliationExport";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { Debounce_Delay, filterSearchParams } from "@web/utils/helper";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { allowPrintExport } = useUserPermissions();

  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { branchIds } = useBranch();

  const {
    control,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const { mutate } = useGetChequeReconciliationExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetChequeReconciliationExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        endRow: 0,
        externalFilter: {
          ...filterListData,
          branch_id: [branchIds],
          from_date: dateRange[0] ?? "",
          to_date: dateRange[1] ?? "",
        },
        quickFilter: filterSearchParams(searchInput),
        startRow: 0,
      },
      fileType,
    });
  };

  const {
    control: saveFiltersControl,
    setValue: setSaveFiltersValue,
    watch,
  } = useForm({
    defaultValues: {
      is_save_filter: false,
    },
  });

  const is_save_filter = watch("is_save_filter");

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "donation",
  });

  const handleSaveFilters = (filtersData: FieldValues, checked: boolean) => {
    const { trust_id, ...rest } = filtersData;

    const payload = checked
      ? {
          ...rest,
          from_date: dateRange[0],
          to_date: dateRange[1],
          ...(trust_id && { trust_id: [trust_id] }),
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

    handleSaveFilters(filterListData, checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { bank_id, from_date, status, to_date, trust_id } =
        filters as Record<string, string>;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      setFilterListData({
        bank_id,
        status,
        trust_id: trust_id?.[0],
      });
    }
  }, [filters]);

  const handleApplyFilter = (data: FieldValues) => {
    setFilterListData(data);

    if (is_save_filter) {
      handleSaveFilters(data, is_save_filter);
    }
  };

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            gap="10px"
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              sx={{ flexShrink: 0 }}
            >
              {t("chequeReconciliation.label")}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              gap="10px"
              flexWrap="wrap"
              justifyContent={{ md: "flex-end", xs: "flex-start" }}
              sx={{
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
                containerProps={{
                  flex: { md: "0 0 auto", xs: "1 1 160px" },
                  maxWidth: { md: "none", xs: "100%" },
                  minWidth: { md: "auto", xs: "140px" },
                  width: { md: "auto", xs: "100%" },
                }}
              />

              <Box
                sx={{
                  flex: { md: "0 0 auto", xs: "1 1 200px" },
                  maxWidth: { md: "none", xs: "100%" },
                  minWidth: { md: "auto", xs: 0 },
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <DateRangePickerField
                  name="date_range"
                  control={control}
                  showPresets
                  size={isMobile ? "small" : "large"}
                  placeholder="Select Date Range"
                />
              </Box>
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            gap="10px"
            alignItems="center"
            flexWrap="wrap"
            justifyContent={{ md: "flex-start", xs: "flex-start" }}
            sx={{
              "& .MuiButton-root": {
                flexGrow: { md: 0, xs: 1 },
                minWidth: { md: "auto", xs: "calc(50% - 10px)" },
                whiteSpace: "nowrap",
              },
            }}
          >
            <ChequeReconciliationFilter
              filterListData={filterListData}
              handleApplyFilter={handleApplyFilter}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <Box sx={{ flexShrink: 0 }}>
                <DataExport onExport={onExport} />
              </Box>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <ChequeReconciliationList
            search={searchInput}
            externalFilter={{
              ...filterListData,
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}

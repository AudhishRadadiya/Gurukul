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
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import type { GetUpdateDonorAddressExportApiSuccessResponse } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddressExport";
import { useGetUpdateDonorAddressExport } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddressExport";
import { UpdateDonorAddressList } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/UpdateDonorAddressList";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
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
  const { allowPrintExport } = useUserPermissions();

  const { isMobile } = useGetDeviceType();

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const {
    control,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const { control: saveFiltersControl, setValue: setSaveFiltersValue } =
    useForm({
      defaultValues: {
        is_save_filter: false,
      },
    });

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "address",
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

  const { mutate } = useGetUpdateDonorAddressExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetUpdateDonorAddressExportApiSuccessResponse) => {
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
          branch_id: [branchIds],
          from_date: dateRange[0],
          to_date: dateRange[1],
        },
        filterModel: agGridState.filterModel,
        quickFilter: filterSearchParams(searchInput),
        sortModel: agGridState.sortModel,
        startRow: 0,
      },
      fileType,
    });
  };

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            gap={3}
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              whiteSpace="nowrap"
            >
              {`${t("common.update.label")} ${t("common.donor.label", {
                label: t("address.label"),
              })}`}
            </Typography>

            <Stack
              direction={{ sm: "row", xs: "column" }}
              alignItems={{ sm: "center", xs: "stretch" }}
              gap={1.25}
              width={{ md: "auto", xs: "100%" }}
            >
              <SaveFiltersCheckbox
                name="is_save_filter"
                control={saveFiltersControl}
                disabled={isFetchingSavedFilters || isPendingSaveFilters}
                onChange={onSaveFiltersChange}
              />

              <Box width={{ sm: 220, xs: "100%" }}>
                <SearchField
                  name="search"
                  characterType="any-character"
                  letterCase="mixed"
                  control={control}
                  containerProps={{ width: "100%" }}
                />
              </Box>

              <Box width={{ sm: "auto", xs: "100%" }}>
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
          <Stack direction="row" justifyContent="flex-end">
            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <UpdateDonorAddressList
            search={searchInput}
            externalFilter={{
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
            agGridState={agGridState}
            setAgGridState={setAgGridState}
            page={page}
            rowsPerPage={rowsPerPage}
            startRow={startRow}
            endRow={endRow}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}

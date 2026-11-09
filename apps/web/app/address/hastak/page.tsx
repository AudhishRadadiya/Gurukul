"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ActionButtons,
  Button,
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { HastakList } from "@web/components/Address/Hastak/HastakList/HastakList";
import { useCreateHastak } from "@web/components/Address/Hastak/HastakList/hooks/useCreateHastak";
import { useEditAllInActiveHastak } from "@web/components/Address/Hastak/HastakList/hooks/useEditAllInActiveHastak";
import {
  type GetHastakExportApiSuccessResponse,
  useGetHastakExport,
} from "@web/components/Address/Hastak/HastakList/hooks/useGetHastakExport";
import {
  type Status,
  StatusTypeSchema,
} from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { StatusAutocomplete } from "@web/components/common/Autocomplete/StatusAutocomplete";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import { ALL } from "@web/components/common/hooks/constant";
import { ExportModule } from "@web/constants/export";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { hastakKeys } from "@web/queryKeysFactories/hastak";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { Debounce_Delay, filterSearchParams } from "@web/utils/helper";

type HastakValues = {
  is_save_filter: boolean;
  status: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { isMobile, isNarrowMobile, isTablet } = useGetDeviceType();

  const { branchIds } = useBranch();

  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const formMethods = useForm<HastakValues>({
    defaultValues: {
      is_save_filter: false,
      status: ALL,
    },
  });

  const { control, setValue, watch } = formMethods;

  const status = watch("status");

  const {
    control: dateControl,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({ moduleKey: "address" });

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setDateValue("date_range", [urlFromDate, urlToDate]);
    }
  }, [searchParams, setDateValue]);

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { from_date, status, to_date } = filters as Record<string, string>;

      setValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      const parsedStatus = StatusTypeSchema.safeParse(status);

      if (parsedStatus.success) {
        setValue("status", parsedStatus.data);
      }
    }
  }, [filters]);

  const handleSaveFilters = (checked: boolean) => {
    const payload = checked
      ? {
          from_date: dateRange[0],
          to_date: dateRange[1],
          ...(status && { status }),
        }
      : {};

    saveFiltersAction({
      filters: payload,
      is_save_filter: checked,
    });
  };

  const onSaveFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setValue("is_save_filter", checked);

    handleSaveFilters(checked);
  };

  const { isPending: isPendingExportHastak, mutate: exportHastak } =
    useGetHastakExport({
      options: {
        onError: (error) => onError(error),
        onSuccess: ({ data, message }: GetHastakExportApiSuccessResponse) => {
          resetExportStateRef.current?.();
          onDialogClose();

          window.open(data.url, "_blank");
          toasts.success({ title: message });
        },
      },
    });

  const {
    handleExport,
    handleMaskSelect,
    handleOriginalSelect,
    handleOtpSubmit,
    isPendingSendExportOtp,
    otpError,
    resetExportState,
    showOtpForm,
  } = useExportDialog({
    exportModule: ExportModule.HASTAK,
    onExport: (data) => {
      exportHastak(data);
    },
  });

  resetExportStateRef.current = resetExportState;

  const getExportBody = (): GetListArgsAg2 => ({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
      from_date: dateRange[0],
      status,
      to_date: dateRange[1],
    },
    filterModel: {},
    quickFilter: filterSearchParams(searchInput),
    startRow: 0,
  });

  const getHastakExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { isPending: isCreatingHastak, mutate: createHastak } = useCreateHastak(
    {
      options: {
        onError: (error) => onError(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: hastakKeys.all });

          setSelectedRows([]);

          toasts.success({ title: data.message });
        },
      },
    }
  );

  const {
    isPending: isEditingAllInActiveHastak,
    mutate: editAllInActiveHastak,
  } = useEditAllInActiveHastak({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: hastakKeys.all });

        setSelectedRows([]);

        toasts.success({ title: data.message });
      },
    },
  });

  const buttonSize = isMobile || isTablet ? "small" : "medium";

  const getDatePickerWidth = () => {
    if (isMobile) {
      return "100%";
    }

    if (isTablet) {
      return "230px";
    }

    return "270px";
  };

  const datePickerWidth = getDatePickerWidth();

  const dialogRenderer: DialogRenderer = {
    exportOptions: (
      <ExportDialog
        error={otpError}
        open
        showOtpForm={showOtpForm}
        onClose={onDialogClose}
        onMaskSelect={handleMaskSelect}
        onOriginalSelect={handleOriginalSelect}
        onSubmit={handleOtpSubmit}
        isLoading={isPendingExportHastak}
        isPendingSendExportOtp={isPendingSendExportOtp}
      />
    ),
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <Stack gap={{ md: "10px", xs: "8px" }}>
          <ContentBox>
            <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
              <Stack
                direction={{ md: "row", xs: "column" }}
                gap={1.25}
                justifyContent="space-between"
                alignItems={{ md: "center", xs: "stretch" }}
              >
                <Typography
                  variant="subtitle1"
                  fontSize={isMobile ? "16px" : "18px"}
                  sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  {t("hastak.list.label")}
                </Typography>

                <Stack
                  direction="row"
                  gap={1}
                  alignItems="center"
                  flexWrap="wrap"
                  justifyContent={{ sm: "flex-end", xs: "flex-start" }}
                  sx={{ minWidth: 0, width: { md: "auto", xs: "100%" } }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <SaveFiltersCheckbox
                      name="is_save_filter"
                      control={control}
                      disabled={isFetchingSavedFilters || isPendingSaveFilters}
                      onChange={onSaveFiltersChange}
                    />
                  </Box>

                  <Box
                    sx={{
                      flex: { sm: "0 1 160px", xs: "1 1 100%" },
                      maxWidth: "100%",
                      minWidth: { sm: 140, xs: 0 },
                    }}
                  >
                    <SearchField
                      name="search"
                      characterType="any-character"
                      letterCase="mixed"
                      control={dateControl}
                      containerProps={{ width: "100%" }}
                    />
                  </Box>

                  <Box
                    sx={{
                      flex: { sm: "0 1 auto", xs: "1 1 100%" },
                      maxWidth: "100%",
                      minWidth: 0,
                    }}
                  >
                    <DateRangePickerField
                      name="date_range"
                      control={dateControl}
                      showPresets
                      size={isMobile || isTablet ? "small" : "large"}
                      placeholder="Select Date Range"
                      TextFieldProps={{
                        inputProps: {
                          style: { minWidth: isMobile || isTablet ? 140 : 205 },
                        },
                        style: { width: datePickerWidth },
                      }}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{
                      flex: isNarrowMobile ? "1 1 100%" : "0 1 auto",
                      justifyContent: "flex-start",
                      maxWidth: "100%",
                      width: isNarrowMobile ? "100%" : "auto",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size={buttonSize}
                      loading={isCreatingHastak}
                      onClick={() => {
                        createHastak({ web_user_id: selectedRows });
                      }}
                      disabled={!selectedRows.length}
                      sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      {`${t("common.create")} ${t("hastak.list.label")}`}
                    </Button>

                    <Button
                      variant="outlined"
                      size={buttonSize}
                      loading={isEditingAllInActiveHastak}
                      onClick={() =>
                        editAllInActiveHastak({ web_user_ids: selectedRows })
                      }
                      disabled={!selectedRows.length}
                      sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      {t("allInactive.label")}
                    </Button>

                    <PermissionGuard canAccess={allowPrintExport}>
                      <Box sx={{ flexShrink: 0 }}>
                        <ActionButtons
                          justifyContent="flex-start"
                          buttons={[
                            {
                              dataCy: "export",
                              dataPTag: "export",
                              endIcon: <ExpandMoreIcon />,
                              key: "right",
                              label: t("export.label"),
                              menuItems: [
                                {
                                  dataCy: "xls",
                                  dataPTag: "xls",
                                  key: "xls",
                                  label: t("common.file.label", {
                                    label: t("excel.label"),
                                  }),
                                  onClick: () => getHastakExport("excel"),
                                },
                                {
                                  dataCy: "pfd",
                                  dataPTag: "pfd",
                                  key: "pdf",
                                  label: t("common.file.label", {
                                    label: t("pdf.label"),
                                  }),
                                  onClick: () => getHastakExport("pdf"),
                                },
                              ],
                              menuPlacement: "left",
                              size: "small",
                              variant: "outlined",
                            },
                          ]}
                        />
                      </Box>
                    </PermissionGuard>

                    <Box
                      sx={{
                        "& > *": { width: "100%" },
                        flex: isNarrowMobile ? "1 1 100%" : "0 1 120px",
                        maxWidth: "100%",
                        minWidth: isNarrowMobile ? 0 : 100,
                        width: isNarrowMobile ? "100%" : 120,
                      }}
                    >
                      <StatusAutocomplete
                        name="status"
                        control={control}
                        closeText="Close"
                      />
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </PadBox>

            <Box sx={{ overflow: "hidden", width: "100%" }}>
              <HastakList
                search={searchInput}
                setSelectedRows={setSelectedRows}
                status={status}
                externalDateFilter={{
                  from_date: dateRange[0],
                  to_date: dateRange[1],
                }}
              />
            </Box>
          </ContentBox>
        </Stack>
      </FormProvider>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}

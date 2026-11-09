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

import { CreateContactDialog } from "@web/components/Address/DonorAddress/DonorAddressList/dialogs/CreateContactDialog";
import { DonorAddressList } from "@web/components/Address/DonorAddress/DonorAddressList/DonorAddressList";
import { useEditAllInActiveDonorAddress } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useEditAllInActiveDonorAddress";
import {
  type GetDonorAddressPDFApiSuccessResponse,
  useGetDonorAddressExport,
} from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddressExport";
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
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { Debounce_Delay, filterSearchParams } from "@web/utils/helper";

export type DonorAddressValues = {
  is_save_filter: boolean;
  status: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { isMobile, isNarrowMobile, isTablet } = useGetDeviceType();

  const { branchIds } = useBranch();

  const searchParams = useSearchParams();

  const formMethods = useForm<DonorAddressValues>({
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

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setDateValue("date_range", [urlFromDate, urlToDate]);
    }
  }, [searchParams, setDateValue]);

  const queryClient = useQueryClient();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const resetExportStateRef = useRef<(() => void) | null>(null);

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

  const { isPending: isPendingExportDonorAddress, mutate: exportDonorAddress } =
    useGetDonorAddressExport({
      options: {
        onError: (error) => onError(error),
        onSuccess: ({
          data,
          message,
        }: GetDonorAddressPDFApiSuccessResponse) => {
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
    exportModule: ExportModule.DONATION_ADDRESS,
    onExport: (data) => {
      exportDonorAddress(data);
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

  const getDonorAddressExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { mutate: editAllInActiveDonorAddress } =
    useEditAllInActiveDonorAddress({
      options: {
        onError: (error) => onError(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: donorAddressKeys.all,
          });

          toasts.success({ title: data.message });
        },
      },
    });

  const dialogRenderer: DialogRenderer = {
    createContact: (
      <CreateContactDialog
        open
        donorAddressIds={selectedRows}
        onClose={onDialogClose}
        onSaveSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: donorAddressKeys.all,
          });
          setSelectedRows([]);
        }}
      />
    ),
    exportOptions: (
      <ExportDialog
        error={otpError}
        open
        showOtpForm={showOtpForm}
        onClose={onDialogClose}
        onMaskSelect={handleMaskSelect}
        onOriginalSelect={handleOriginalSelect}
        onSubmit={handleOtpSubmit}
        isLoading={isPendingExportDonorAddress}
        isPendingSendExportOtp={isPendingSendExportOtp}
      />
    ),
  };

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
                  {t("common.donor.label", {
                    label: t("address.label"),
                  })}
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
                          style: {
                            minWidth: isMobile || isTablet ? 140 : 205,
                          },
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
                      onClick={() => {
                        onDialogOpen("createContact");
                      }}
                      disabled={!selectedRows.length}
                      sx={{
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${t("common.create")} ${t("contact.label")}`}
                    </Button>

                    <Button
                      variant="outlined"
                      size={buttonSize}
                      onClick={() => {
                        editAllInActiveDonorAddress({
                          donation_ids: selectedRows,
                        });
                      }}
                      disabled={!selectedRows.length}
                      sx={{
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
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
                                  onClick: () => {
                                    getDonorAddressExport("excel");
                                  },
                                },
                                {
                                  dataCy: "pfd",
                                  dataPTag: "pfd",
                                  key: "pfd",
                                  label: t("common.file.label", {
                                    label: t("pdf.label"),
                                  }),
                                  onClick: () => {
                                    getDonorAddressExport("pdf");
                                  },
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
              <DonorAddressList
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

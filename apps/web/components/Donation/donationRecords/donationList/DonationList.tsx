import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ActionCell,
  Button,
  ColumnArrangerDialog,
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import type {
  DynamicSummaryConfig,
  SmartGridRef,
} from "@codezee-org/sixtify-smartgrid";
import { SmartGrid } from "@codezee-org/sixtify-smartgrid";
import { Box, Stack, Typography } from "@mui/material";
import { isActive } from "@tiptap/core";
import { t } from "i18next";
import { ArrowLeft } from "iconoir-react";
import _isEmpty from "lodash/isEmpty";
import _split from "lodash/split";
import _sumBy from "lodash/sumBy";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import { SEVEN_DAYS } from "@web/components/common/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import type { DonationEntryApiSuccessResponse } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { MailConfirmationDialog } from "@web/components/Donation/donationEntry/dialogs/bulkMail/MailConfirmationDialog";
import { CancelDonationEntryDialog } from "@web/components/Donation/donationEntry/donationEntryList/dialogs/CancelDonationEntryDialog";
import { DonationEntryFilter } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryFilter";
import {
  DonationEntryListPagination,
  pageSizeDefault,
} from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryListPagination";
import type { DonationEntryColumnHideTypes } from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
import { useActivateDonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useActivateDonationEntry";
import { useCancelDonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useCancelDonationEntry";
import { useDonationEntryColumns } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useDonationEntryColumns";
import type { GetDonationAddressPdfApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationAddressPdf";
import { useGetDonationAddressPdf } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationAddressPdf";
import {
  useGetDonationEntry,
  type DonationEntry,
} from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntry";
import type { GetDonationEntryExportApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntryExport";
import { useGetDonationEntryExport } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntryExport";
import type { GetDonationLetterApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationLettet";
import { useGetDonationLetter } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationLettet";
import type { GetDonationReceiptApiSuccessResponse } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationReceipt";
import { useGetDonationReceipt } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationReceipt";
import { ExportModule } from "@web/constants/export";
import { DONATION_ENTRY_PERMISSION } from "@web/constants/permission/donation/donationEntry/permission";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { calculateFromDate } from "@web/hooks/useDateFilters";
import { useGridLayoutHeight } from "@web/hooks/useGridLayoutHeight";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import {
  Debounce_Delay,
  filterSearchParams,
  formatToIndianNumber,
} from "@web/utils/helper";

export type DonationListProps = {
  columnHide: DonationEntryColumnHideTypes;
  setColumnHide: (col: DonationEntryColumnHideTypes) => void;
};

const EVENT_SUMMARY = "event-summary";

export const fromFilterDate = DateTime.now().minus({ months: 3 }).toISODate();
export const toFilterDate = DateTime.now().toISODate();

export const DonationList = ({
  columnHide,
  setColumnHide,
}: DonationListProps) => {
  const router = useRouter();

  const { isMobile } = useGetDeviceType();

  const searchParams = useSearchParams();

  const { branchIds } = useBranch();

  const { allowPrintExport, validateAccess } = useUserPermissions();

  const { control, setValue, watch } = useForm({
    defaultValues: {
      date_range: [calculateFromDate(SEVEN_DAYS), DateTime.now().toISODate()],
      is_save_filter: false,
      search: "",
    },
  });

  const dateRange = watch("date_range");

  const is_save_filter = watch("is_save_filter");

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setValue("date_range", [urlFromDate, urlToDate]);
    } else {
      setValue("date_range", [
        calculateFromDate(SEVEN_DAYS),
        DateTime.now().toISODate(),
      ]);
    }
  }, [searchParams]);

  const hasSummaryParams = useMemo(() => {
    const contactNo = searchParams.get("contact_no");

    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    return !!(contactNo && urlFromDate && urlToDate);
  }, [searchParams]);

  const handleBackToSummary = () => {
    if (hasSummaryParams) {
      router.push("/donation/donation-summary");
    }
  };

  const smartGridRef = useRef<SmartGridRef<DonationEntry>>(null);

  const params = Object.fromEntries(searchParams.entries());

  const { contact_no, event_type_id, page: moduleName, ...restParams } = params;

  const [filterListData, setFilterListData] = useState<FieldValues>({
    branch_id: [""],
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [selectedDonationEntry, setSelectedDonationEntry] =
    useState<DonationEntry | null>(null);

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  smartGridRef.current?.setNotifyCallback(() => {
    setSelectedRows(
      smartGridRef.current?.getSelectedRows().map((row) => row.donation_id) ??
        []
    );
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

  const handleSaveFilters = (filtersData: FieldValues, checked: boolean) => {
    const payload = checked
      ? {
          ...filtersData,
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

    setValue("is_save_filter", checked);

    handleSaveFilters(filterListData, checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { from_date, to_date, ...rest } = filters as Record<string, string>;

      setValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setValue("date_range", [from_date, to_date]);
      }

      if (rest) {
        setFilterListData({
          ...rest,
        });
      }
    }
  }, [filters]);

  const handleApplyFilter = (data: FieldValues) => {
    setFilterListData(data);

    if (is_save_filter) {
      handleSaveFilters(data, is_save_filter);
    }
  };

  useMemo(() => {
    setFilterListData((prev) => ({
      ...prev,
      branch_id: [branchIds],
    }));
  }, [branchIds]);

  useMemo(() => {
    const trustId = searchParams.get("trust_id");

    const eventTypeId = searchParams.get("event_type_id");

    // Exclude contact_no, from_date, to_date from restParams as they are handled separately
    const filterParams = Object.fromEntries(
      Object.entries(restParams).filter(
        ([key]) => !["contact_no", "from_date", "to_date"].includes(key)
      )
    );

    setFilterListData((prev) => ({
      ...prev,
      ...filterParams,
      ...(!!trustId && {
        trust_id: EVENT_SUMMARY === moduleName ? _split(trustId, ",") : trustId,
      }),
      ...(!!eventTypeId && {
        event_type_id: eventTypeId,
      }),
    }));
  }, []);

  const {
    data: donationEntryList,
    isFetching,
    refetch,
  } = useGetDonationEntry({
    endRow,
    externalFilter: {
      branch_id: [branchIds],
      ...filterListData,
      from_date: dateRange[0],
      is_active: isActive,
      to_date: dateRange[1],
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    quickFilter: filterSearchParams(searchInput),
    startRow,
  });

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const {
    isPending: isPendingExportDonationEntry,
    mutate: exportDonationEntry,
  } = useGetDonationEntryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetDonationEntryExportApiSuccessResponse) => {
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
    exportModule: ExportModule.DONATION,
    onExport: (data) => {
      exportDonationEntry(data);
    },
  });

  resetExportStateRef.current = resetExportState;

  const getExportBody = () => ({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
      ...filterListData,
      from_date: dateRange[0],
      is_active: isActive,
      to_date: dateRange[1],
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { mutate: printAddress } = useGetDonationAddressPdf({
    donationIds: selectedRows,
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetDonationAddressPdfApiSuccessResponse) => {
        toasts.success({ title: message });
        window.open(data.pdfUrl, "_blank");
      },
    },
  });

  const { mutate: donationLetter } = useGetDonationLetter({
    options: {
      onError: (error) => onError(error),

      onSuccess: ({ data, message }: GetDonationLetterApiSuccessResponse) => {
        toasts.success({ title: message });

        window.open(data.letterUrl, "_blank");
      },
    },
  });

  const { isPending: isPendingDonationReceipt, mutate: donationReceipt } =
    useGetDonationReceipt({
      options: {
        onError: (error) => onError(error),

        onSuccess: ({
          data,
          message,
        }: GetDonationReceiptApiSuccessResponse) => {
          toasts.success({ title: message });

          window.open(data.pdfUrl, "_blank");
        },
      },
    });

  const { isPending: isPendingCancelDonation, mutate: cancelDonationEntry } =
    useCancelDonationEntry({
      options: {
        onError: (error) => onError(error),

        onSuccess: ({ message }: DonationEntryApiSuccessResponse) => {
          toasts.success({ title: message });
          onDialogClose();
          setSelectedDonationEntry(null);
          refetch();
        },
      },
    });

  const {
    isPending: isPendingActivateDonation,
    mutate: activateDonationEntry,
  } = useActivateDonationEntry({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({ message }) => {
        refetch();

        toasts.success({ title: message });
      },
    },
  });

  const {
    donationDetail,
    full_count,
    total_amount,
    total_cancel_amount,
    total_receipt,
  } = donationEntryList;

  const selectedTotalAmount = useMemo(() => {
    const selectedDonationIds = new Set(selectedRows);

    return donationDetail.reduce(
      (total, donation) =>
        selectedDonationIds.has(donation.donation_id)
          ? total + Number(donation.amount || 0)
          : total,
      0
    );
  }, [donationDetail, selectedRows]);

  const { columns } = useDonationEntryColumns({
    columnHide,
    onAction: (actionType, data) => {
      if (actionType === "edit") {
        router.push(
          `/donation/donation-entry/${data.donation_id}?page=edit-donation-entry`
        );

        return;
      }

      if (actionType === "clone") {
        router.push(
          `/donation/donation-entry/${data.donation_id}?page=clone-donation-entry`
        );

        return;
      }

      if (actionType === "donationLetter") {
        donationLetter({
          donation_id: data.donation_id,
        });
      }

      if (actionType === "donationReceipt") {
        donationReceipt({
          donation_id: data.donation_id,
        });

        return;
      }

      if (actionType === "cancelDonationEntryConfirmation") {
        if (data.is_cancel) {
          activateDonationEntry({
            donation_id: data.donation_id,
            is_active: true,
          });

          return;
        }

        setSelectedDonationEntry(data);
        onDialogOpen("cancelDonationEntryConfirmation");

        return;
      }

      setSelectedDonationEntry(data);
      onDialogOpen(actionType);
    },
  });

  const dialogRenderer: DialogRenderer = {
    cancelDonationEntryConfirmation: (
      <CancelDonationEntryDialog
        open
        isLoading={isPendingCancelDonation}
        onCancel={() => {
          if (selectedDonationEntry) {
            cancelDonationEntry({
              donation_id: selectedDonationEntry.donation_id,
              is_cancel: true,
            });
          }
        }}
        onClose={() => {
          onDialogClose();
          setSelectedDonationEntry(null);
        }}
      />
    ),
    columnChooser: (
      <ColumnArrangerDialog<DonationEntryColumnHideTypes>
        columns={columns}
        title={t("common.column.chooser")}
        open
        onClose={onDialogClose}
        onSave={(columns) => {
          setColumnHide(columns);
        }}
      />
    ),
    confirmation: (
      <MailConfirmationDialog
        open
        onClose={onDialogClose}
        selectedRows={selectedRows}
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
        isLoading={isPendingExportDonationEntry}
        isPendingSendExportOtp={isPendingSendExportOtp}
      />
    ),
  };

  const dynamicGroupDonationListSummaryColumns: DynamicSummaryConfig<DonationEntry>[] =
    [
      {
        calculation: (data: DonationEntry[]) => {
          return _sumBy(data, "amount");
        },
        field: "amount",
        formatter: (value: number) => String(`₹${formatToIndianNumber(value)}`),
        label: "Total Amount",
      },
    ];

  const shouldShowPagination = Number(full_count) > pageSizeDefault;

  const gridHeight = useGridLayoutHeight({
    baseHeight: isMobile ? 270 : 220,
    noNeedToApplyPaginationHeight: true,
    showPagination: shouldShowPagination,
  });

  const actionItems = [
    {
      isView: allowPrintExport,
      onClick: () => {
        onExport("pdf");
      },
      title: t("pdf.label"),
    },
    {
      isView: allowPrintExport,
      onClick: () => {
        onExport("excel");
      },
      title: t("excel.label"),
    },
    {
      disabled: !selectedRows.length,
      onClick: () => {
        onDialogOpen("confirmation");
      },
      title: t("common.bulk.mail"),
    },
    {
      disabled: !selectedRows.length,
      isView: allowPrintExport,
      onClick: () => {
        printAddress();
      },
      title: t("common.print.address"),
    },
  ];

  return (
    <>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction={{ lg: "row", xs: "column" }}
            gap={{ md: 1.25, xs: 1 }}
            alignItems={{ lg: "center", xs: "stretch" }}
            justifyContent={{ lg: "space-between", xs: "flex-start" }}
            flexWrap={{ lg: "nowrap", xs: "wrap" }}
            width="100%"
          >
            <Stack
              direction={{ lg: "row", xs: "column" }}
              gap={1.25}
              alignItems={{ lg: "center", xs: "stretch" }}
              flexShrink={0}
              minWidth={0}
            >
              <Typography
                variant="subtitle1"
                sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
              >
                Donation List
              </Typography>

              <Box
                sx={{
                  flex: { lg: "0 0 220px", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { xs: "100%" },
                }}
              >
                <SearchField
                  name="search"
                  characterType="any-character"
                  letterCase="mixed"
                  control={control}
                  containerProps={{ width: "100%" }}
                />
              </Box>
            </Stack>

            <Stack
              direction="row"
              gap={{ md: 1.25, xs: 1 }}
              alignItems="center"
              flexShrink={0}
              flexWrap="wrap"
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
                  flexShrink: 0,
                  minWidth: 0,
                  width: { sm: "auto", xs: "100%" },
                }}
              >
                <DateRangePickerField
                  name="date_range"
                  control={control}
                  showPresets
                  placeholder="Select Date Range"
                />
              </Box>

              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="nowrap"
                justifyContent="flex-start"
                sx={{ flexShrink: 0, width: "auto" }}
              >
                <Box
                  sx={{
                    "& > .MuiBox-root": {
                      flexGrow: "0 !important",
                    },
                    "& > .MuiBox-root > .MuiStack-root": {
                      justifyContent: "flex-start !important",
                    },
                    flexGrow: 0,
                    flexShrink: 0,
                  }}
                >
                  <DonationEntryFilter
                    isHideRenderChips
                    filterListData={filterListData}
                    handleApplyFilter={handleApplyFilter}
                  />
                </Box>

                <ActionCell items={actionItems} />

                {hasSummaryParams && (
                  <Button
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    startIcon={<ArrowLeft width={20} height={20} />}
                    onClick={handleBackToSummary}
                    sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    Back
                  </Button>
                )}

                <PermissionGuard
                  canAccess={validateAccess(DONATION_ENTRY_PERMISSION.CREATE)}
                >
                  <ButtonLayoutProvider
                    onClick={() => {
                      router.push(
                        "/donation/donation-entry?page=add-donation-entry"
                      );
                    }}
                    label={t("common.button.add", {
                      label: t("entry.label"),
                    })}
                    sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                  />
                </PermissionGuard>
              </Stack>
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <SmartGrid<DonationEntry>
          ref={smartGridRef}
          columns={columns}
          data={donationDetail}
          dynamicSummaryConfig={dynamicGroupDonationListSummaryColumns}
          loading={
            isFetching || isPendingDonationReceipt || isPendingActivateDonation
          }
          totalCount={full_count}
          rowSelection
          checkBoxPinning="left"
          height={gridHeight}
        />

        <Box>
          <PadBox padding={{ padding: { md: "8px 25px", xs: "8px 12px" } }}>
            <Stack
              direction={{ md: "row", xs: "column" }}
              gap={{ md: 1.5, xs: 1 }}
              justifyContent="space-between"
              alignItems={{ md: "center", xs: "stretch" }}
            >
              <Stack
                direction={{ sm: "row", xs: "column" }}
                gap={{ sm: 2.5, xs: 0.75 }}
                flexWrap="wrap"
              >
                <Stack direction="row" gap="10px">
                  <Typography variant="body2">Total Amount:</Typography>

                  <Typography variant="body1">
                    {formatToIndianNumber(Number(total_amount))}
                  </Typography>
                </Stack>

                <Stack direction="row" gap="10px">
                  <Typography variant="body2">Total Receipt:</Typography>

                  <Typography variant="body1">{total_receipt || 0}</Typography>
                </Stack>

                <Stack direction="row" gap="10px">
                  <Typography variant="body2">Total Cancel Amount:</Typography>

                  <Typography variant="body1">
                    {formatToIndianNumber(Number(total_cancel_amount))}
                  </Typography>
                </Stack>

                <Stack direction="row" gap="10px">
                  <Typography variant="body2">
                    Selected Total Amount:
                  </Typography>

                  <Typography variant="body1">
                    {formatToIndianNumber(selectedTotalAmount)}
                  </Typography>
                </Stack>
              </Stack>

              <DonationEntryListPagination
                page={page}
                fullCount={full_count}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            </Stack>
          </PadBox>
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

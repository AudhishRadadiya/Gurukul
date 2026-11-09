import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ColumnArrangerDialog,
  ColumnIconAction,
  ContentBox,
  PadBox,
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import type { SmartGridRef } from "@codezee-org/sixtify-smartgrid";
import { SmartGrid } from "@codezee-org/sixtify-smartgrid";
import { Box, Stack, Typography } from "@mui/material";
import { isActive } from "@tiptap/core";
import { t } from "i18next";
import { Mail, PrintingPage } from "iconoir-react";
import _split from "lodash/split";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { type FieldValues } from "react-hook-form";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
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
import { useBranch } from "@web/context/BranchContext";
import { useGridLayoutHeight } from "@web/hooks/useGridLayoutHeight";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { filterSearchParams, formatToIndianNumber } from "@web/utils/helper";

export type DonationEntryListProps = {
  columnHide: DonationEntryColumnHideTypes;
  externalDateFilter?: FieldValues;
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
  isDonationEntryList: boolean;
  search: string;
  setColumnHide: (col: DonationEntryColumnHideTypes) => void;
  setFilterListData: (data: FieldValues) => void;
};

const EVENT_SUMMARY = "event-summary";

export const fromFilterDate = DateTime.now().minus({ months: 3 }).toISODate();
export const toFilterDate = DateTime.now().toISODate();

export const DonationEntryList = ({
  columnHide,
  externalDateFilter,
  filterListData,
  handleApplyFilter,
  search,
  setColumnHide,
  setFilterListData,
}: DonationEntryListProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { branchIds } = useBranch();

  const { allowPrintExport } = useUserPermissions();

  const { isMobile } = useGetDeviceType();

  const smartGridRef = useRef<SmartGridRef<DonationEntry>>(null);

  const params = Object.fromEntries(searchParams.entries());

  const { contact_no, event_type_id, page: moduleName, ...restParams } = params;

  useMemo(() => {
    setFilterListData((prev: FieldValues) => ({
      ...prev,
      branch_id: [branchIds],
    }));
  }, [branchIds]);

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

  useMemo(() => {
    const trustId = searchParams.get("trust_id");

    const eventTypeId = searchParams.get("event_type_id");

    // Exclude contact_no, from_date, to_date from restParams as they are handled separately
    const filterParams = Object.fromEntries(
      Object.entries(restParams).filter(
        ([key]) => !["contact_no", "from_date", "to_date"].includes(key)
      )
    );

    setFilterListData((prev: FieldValues) => ({
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
      ...externalDateFilter,
      is_active: isActive,
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    quickFilter: filterSearchParams(search),
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
      ...externalDateFilter,
      is_active: isActive,
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    quickFilter: filterSearchParams(search),
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { isPending: isPendingPrintAddress, mutate: printAddress } =
    useGetDonationAddressPdf({
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

  const shouldShowPagination = Number(full_count) > pageSizeDefault;

  const gridHeight = useGridLayoutHeight({
    baseHeight: isMobile ? 330 : 320,
    noNeedToApplyPaginationHeight: true,
    showPagination: shouldShowPagination,
  });

  return (
    <>
      <PadBox padding={{ padding: { md: "3px 5px", xs: "8px 10px" } }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent={{ md: "flex-end", xs: "flex-start" }}
          alignItems="center"
          flexWrap="wrap"
          width="100%"
          sx={{
            "& .MuiButton-root": {
              flexGrow: { md: 0, xs: 1 },
              minWidth: { md: "auto", xs: "calc(50% - 10px)" },
              whiteSpace: "nowrap",
            },
          }}
        >
          <DonationEntryFilter
            filterListData={filterListData}
            handleApplyFilter={handleApplyFilter}
          />

          <ButtonLayoutProvider
            size={isMobile ? "small" : "medium"}
            startIcon={<Mail width={20} height={20} />}
            onClick={() => {
              onDialogOpen("confirmation");
            }}
            disabled={!selectedRows.length}
            label={t("common.bulk.mail")}
          />

          <PermissionGuard canAccess={allowPrintExport}>
            <ButtonLayoutProvider
              loading={isPendingPrintAddress}
              startIcon={<PrintingPage width={20} height={20} />}
              onClick={() => {
                printAddress();
              }}
              disabled={!selectedRows.length}
              label={t("common.print.address")}
            />

            <DataExport onExport={onExport} />
          </PermissionGuard>

          <ColumnIconAction
            onClick={() => {
              onDialogOpen("columnChooser");
            }}
          />
        </Stack>
      </PadBox>

      <ContentBox>
        <SmartGrid<DonationEntry>
          ref={smartGridRef}
          columns={columns}
          data={donationDetail}
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
              direction={{
                lg: "column",
                md: "column",
                sm: "column",
                xl: "row",
                xs: "column",
                xxl: "row",
              }}
              gap="6px"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                gap={{ md: "20px", xs: "12px" }}
                flexWrap="wrap"
              >
                <Stack direction="row" gap="10px" flexShrink={0}>
                  <Typography variant="body2">Total Amount:</Typography>

                  <Typography variant="body1">
                    {formatToIndianNumber(Number(total_amount))}
                  </Typography>
                </Stack>

                <Stack direction="row" gap="10px" flexShrink={0}>
                  <Typography variant="body2">Total Receipt:</Typography>

                  <Typography variant="body1">{total_receipt || 0}</Typography>
                </Stack>

                <Stack direction="row" gap="10px" flexShrink={0}>
                  <Typography variant="body2">Total Cancel Amount:</Typography>

                  <Typography variant="body1">
                    {formatToIndianNumber(Number(total_cancel_amount))}
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

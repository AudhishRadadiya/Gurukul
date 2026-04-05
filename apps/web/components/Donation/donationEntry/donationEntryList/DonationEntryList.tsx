import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  Button,
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { isActive } from "@tiptap/core";
import { type FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { Mail, PrintingPage } from "iconoir-react";
import _split from "lodash/split";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { type FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import type { DonationEntryApiSuccessResponse } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { MailConfirmationDialog } from "@web/components/Donation/donationEntry/dialogs/bulkMail/MailConfirmationDialog";
import { CancelDonationEntryDialog } from "@web/components/Donation/donationEntry/donationEntryList/dialogs/CancelDonationEntryDialog";
import { DonationEntryFilter } from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryFilter";
import type { DonationEntryColumnHideTypes } from "@web/components/Donation/donationEntry/donationEntryList/hooks/templateTypes";
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
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { formatToIndianNumber } from "@web/utils/helper";

export type DonationEntryListProps = {
  columnHide: DonationEntryColumnHideTypes;
  externalDateFilter?: FieldValues;
  isDonationEntryList: boolean;
  setColumnHide: (col: DonationEntryColumnHideTypes) => void;
};

const EVENT_SUMMARY = "event-summary";

export const fromFilterDate = DateTime.now().minus({ months: 3 }).toISODate();
export const toFilterDate = DateTime.now().toISODate();

export const DonationEntryList = ({
  columnHide,
  externalDateFilter,
  setColumnHide,
}: DonationEntryListProps) => {
  const theme = useTheme();

  const router = useRouter();

  const searchParams = useSearchParams();

  const { orchid, red } = theme.palette.app.color;

  const { allowPrintExport, validateAccess } = useUserPermissions();

  const { branchIds } = useBranch();

  const params = Object.fromEntries(searchParams.entries());

  const { contact_no, event_type_id, page: moduleName, ...restParams } = params;

  const [filterListData, setFilterListData] = useState<FieldValues>({
    branch_id: [""],
  });

  useMemo(() => {
    setFilterListData((prev) => ({
      ...prev,
      branch_id: [branchIds],
    }));
  }, [branchIds]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const [selectedDonationEntry, setSelectedDonationEntry] =
    useState<DonationEntry | null>(null);

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

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
      ...externalDateFilter,
      is_active: isActive,
      ...(contact_no && { contact_no }),
      ...(event_type_id && { event_type_id }),
    },
    filterModel: agGridFilterModel,
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
    filterModel: agGridFilterModel,
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  const { columns } = useDonationEntryColumns({
    columnHide,
  });

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
    donationDetail,
    full_count,
    total_amount,
    total_cancel_amount,
    total_receipt,
  } = donationEntryList;

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

  return (
    <>
      <PadBox padding={{ padding: "3px 5px" }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent="end"
          alignItems="center"
        >
          <DonationEntryFilter
            filterListData={filterListData}
            setFilterListData={setFilterListData}
          />

          <Button
            variant="outlined"
            startIcon={<Mail width={20} height={20} />}
            onClick={() => {
              onDialogOpen("confirmation");
            }}
            disabled={!selectedRows.length}
          >
            {t("common.bulk.mail")}
          </Button>

          <PermissionGuard canAccess={allowPrintExport}>
            <Button
              loading={isPendingPrintAddress}
              variant="outlined"
              startIcon={<PrintingPage width={20} height={20} />}
              onClick={() => {
                printAddress();
              }}
              disabled={!selectedRows.length}
            >
              {t("common.print.address")}
            </Button>

            <DataExport onExport={onExport} />
          </PermissionGuard>

          <ColumnIconAction
            onClick={() => {
              onDialogOpen("columnChooser");
            }}
          />
        </Stack>
      </PadBox>

      <AgGridV2<DonationEntry>
        defaultColDef={{
          cellStyle: ({ data }) => {
            if (data?.is_cancel) {
              return {
                color: red[500],
              };
            }

            if (data?.edit_date) {
              return {
                color: orchid[900],
              };
            }
          },
        }}
        rowSelection="multiple"
        getRowId={(params) => params.data.donation_id}
        isLoading={isFetching || isPendingDonationReceipt}
        page={page}
        count={full_count}
        columnDefs={columns}
        onSelectionChanged={setSelectedRows}
        rowData={donationDetail}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={350}
        footer={
          <Stack direction="row" gap="60px">
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
          </Stack>
        }
        actions={[
          {
            isView: validateAccess(DONATION_ENTRY_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/donation/donation-entry/${data.donation_id}?page=edit-donation-entry`
              );
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(DONATION_ENTRY_PERMISSION.CREATE),
            onClick: (data) => {
              router.push(
                `/donation/donation-entry/${data.donation_id}?page=clone-donation-entry`
              );
            },
            title: t("common.clone"),
          },
          {
            onClick: (data) => {
              donationLetter({
                donation_id: data.donation_id,
              });
            },
            title: t("common.donation.letter"),
          },
          {
            onClick: (data) => {
              donationReceipt({
                donation_id: data.donation_id,
              });
            },
            title: t("donationReceipt.label"),
          },
          {
            onClick: (data) => {
              setSelectedDonationEntry(data);
              onDialogOpen("cancelDonationEntryConfirmation");
            },
            title: t("common.cancel.button"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

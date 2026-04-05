import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { toasts, useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import {
  ExportDialog,
  useExportDialog,
} from "@web/components/common/ExportDialog";
import { useDonationSummaryColumns } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useDonationSummaryColumns";
import type { DonationSummary } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummary";
import { useGetDonationSummary } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummary";
import type { GetDonationSummaryExportApiSuccessResponse } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummaryExport";
import { useGetDonationSummaryExport } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummaryExport";
import { buildQuery } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryList";
import { ExportModule } from "@web/constants/export";
import { useBranch } from "@web/context/BranchContext";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

export type DonationSummaryListProps = {
  externalFilter: FieldValues;
  fromDate: string;
  onlyContactNo: boolean;
  toDate: string;
};

export type DonationSummaryListHandle = {
  onExport: (fileType: FilType) => void;
};

export const DonationSummaryList = forwardRef<
  DonationSummaryListHandle,
  DonationSummaryListProps
>(({ externalFilter, fromDate, onlyContactNo, toDate }, ref) => {
  const router = useRouter();

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { data, isFetching } = useGetDonationSummary({
    endRow,
    externalFilter: {
      ...externalFilter,
      branch_id: [branchIds],
      from_date: fromDate,
      only_contact_no: onlyContactNo,
      to_date: toDate,
    },
    filterModel: agGridFilterModel,
    startRow,
  });

  const { donationSummary: rowData, totalCount = 0 } = data ?? {};

  const { column } = useDonationSummaryColumns({ onlyContactNo });

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const {
    isPending: isPendingExportDonationSummary,
    mutate: exportDonationSummary,
  } = useGetDonationSummaryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetDonationSummaryExportApiSuccessResponse) => {
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
    exportModule: ExportModule.DONATION_SUMMARY,
    onExport: (data) => {
      exportDonationSummary(data);
    },
  });

  resetExportStateRef.current = resetExportState;

  const getExportBody = () => ({
    endRow: 0,
    externalFilter: {
      ...externalFilter,
      branch_id: [branchIds],
      from_date: fromDate,
      only_contact_no: onlyContactNo,
      to_date: toDate,
    },
    filterModel: agGridFilterModel,
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    handleExport(fileType, getExportBody());
    onDialogOpen("exportOptions");
  };

  useImperativeHandle(ref, () => ({
    onExport,
  }));

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
        isLoading={isPendingExportDonationSummary}
        isPendingSendExportOtp={isPendingSendExportOtp}
      />
    ),
  };

  return (
    <>
      <AgGridV2<DonationSummary>
        isLoading={isFetching}
        page={page}
        rowData={rowData}
        count={totalCount}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={290}
        actions={[
          {
            onClick: (data) => {
              const query: FieldValues = buildQuery({
                ...externalFilter,
                contact_no: data.contact_no,
                from_date: fromDate,
                to_date: toDate,
              });

              const params = new URLSearchParams(query).toString();

              router.push(`/donation/donation-entry?${params}`);
            },
            title: t("common.details.label"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
});

DonationSummaryList.displayName = "DonationSummaryList";

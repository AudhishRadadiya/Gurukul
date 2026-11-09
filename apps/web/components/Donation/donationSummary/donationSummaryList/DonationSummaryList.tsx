import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
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
import { filterSearchParams } from "@web/utils/helper";

export type DonationSummaryListProps = {
  externalFilter: FieldValues;
  search: string;
};

export type DonationSummaryListHandle = {
  onExport: (fileType: FilType) => void;
};

export const DonationSummaryList = forwardRef<
  DonationSummaryListHandle,
  DonationSummaryListProps
>(({ externalFilter, search }, ref) => {
  const router = useRouter();

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

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { data, isFetching } = useGetDonationSummary({
    endRow,
    externalFilter: {
      ...externalFilter,
      branch_id: [branchIds],
    },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { donationSummary: rowData, totalCount = 0 } = data ?? {};

  const { column } = useDonationSummaryColumns({
    onlyContactNo: externalFilter.only_contact_no,
  });

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
    },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
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
        onGridStateChange={setAgGridState}
        onRowsPerPageChange={onRowsPerPageChange}
        height={isMobile ? 250 : 235}
        actions={[
          {
            onClick: (data) => {
              const query: FieldValues = buildQuery({
                ...externalFilter,
                contact_no: data.contact_no,
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

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions, useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { CurrencyDetailDialog } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/CurrencyDetailDialog";
import { EditDonationCollectionDialog } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/EditDonationCollectionDialog";
import { useDonationCollectionReportColumns } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/hooks/useDonationCollectionReportColumns";
import type { DailyDonationReportData } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/hooks/useGetDonationCollectionReport";
import { useGetDonationCollectionReport } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/hooks/useGetDonationCollectionReport";
import { useBranch } from "@web/context/BranchContext";

export type DonationCollectionReportListProps = {
  agGridState: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  };
  externalFilter: FieldValues;
  setAgGridState: (data: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }) => void;
};

export const DonationCollectionReportList = ({
  agGridState,
  externalFilter,
  setAgGridState,
}: DonationCollectionReportListProps) => {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { branchIds } = useBranch();

  const [currentDonationCollectionData, setCurrentDonationCollectionData] =
    useState<DailyDonationReportData>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetDonationCollectionReport({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { dailyDonationReportList, totalCount } = data;

  const { column } = useDonationCollectionReportColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentDonationCollectionData && (
      <EditDonationCollectionDialog
        open
        dailyDonationId={currentDonationCollectionData.daily_donation_id}
        onClose={onDialogClose}
      />
    ),
    view: currentDonationCollectionData && (
      <CurrencyDetailDialog
        open
        dailyDonationId={currentDonationCollectionData.daily_donation_id}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<DailyDonationReportData>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("view");
              setCurrentDonationCollectionData(data);
            },
            title: t("view.label"),
          },
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentDonationCollectionData(data);
            },
            title: t("common.edit"),
          },
        ]}
        rowsPerPage={rowsPerPage}
        rowData={dailyDonationReportList}
        onPageChange={onPageChange}
        onGridStateChange={setAgGridState}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        height={isMobile ? 300 : 240}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

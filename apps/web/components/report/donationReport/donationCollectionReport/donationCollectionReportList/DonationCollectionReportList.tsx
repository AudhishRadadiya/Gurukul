import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
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
  externalFilter: FieldValues;
};

export const DonationCollectionReportList = ({
  externalFilter,
}: DonationCollectionReportListProps) => {
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
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        height={250}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

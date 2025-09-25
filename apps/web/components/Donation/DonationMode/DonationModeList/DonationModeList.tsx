import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditDonationModeDialog } from "@web/components/Donation/DonationMode/DonationModeList/Dialogs/EditDonationModeDialog";
import { useDonationModeColumns } from "@web/components/Donation/DonationMode/DonationModeList/hooks/useDonationModeColumns";
import {
  useGetDonationMode,
  type DonationMode,
} from "@web/components/Donation/DonationMode/DonationModeList/hooks/useGetDonationMode";

export const DonationModeList = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentDonationMode, setCurrentDonationMode] =
    useState<DonationMode>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetDonationMode({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { donationModeDetail: rowData, totalCount } = data || {};

  const { column } = useDonationModeColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentDonationMode && (
      <EditDonationModeDialog
        open
        donationModeId={currentDonationMode.donation_mode_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<DonationMode>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={200}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentDonationMode(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

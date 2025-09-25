import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteDonationMasterDialog } from "@web/components/Donation/DonationMaster/DonationMasterList/Dialogs/DeleteDonationMasterDialog";
import { EditDonationMasterDialog } from "@web/components/Donation/DonationMaster/DonationMasterList/Dialogs/EditDonationMasterDialog";
import { useDonationMasterColumns } from "@web/components/Donation/DonationMaster/DonationMasterList/hooks/useDonationMasterColumns";
import type { DonationMaster } from "@web/components/Donation/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";
import { useGetDonationMaster } from "@web/components/Donation/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";

export const DonationMasterList = () => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetDonationMaster({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { donationDetails, totalCount } = data || {};

  const { column } = useDonationMasterColumns();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentDonationMaster, setCurrentDonationMaster] =
    useState<DonationMaster>();

  const dialogRenderer: DialogRenderer = {
    delete: currentDonationMaster && (
      <DeleteDonationMasterDialog
        open
        donationMaster={currentDonationMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentDonationMaster && (
      <EditDonationMasterDialog
        open
        donationMasterId={currentDonationMaster.donation_master_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<DonationMaster>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={donationDetails}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={200}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentDonationMaster(data);
            },
            title: t("common.edit"),
          },

          {
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentDonationMaster(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

DonationMasterList.displayName = "DonationMasterList";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions, useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditDonationModeDialog } from "@web/components/settings/DonationMode/DonationModeList/Dialogs/EditDonationModeDialog";
import { useDonationModeColumns } from "@web/components/settings/DonationMode/DonationModeList/hooks/useDonationModeColumns";
import {
  useGetDonationMode,
  type DonationMode,
} from "@web/components/settings/DonationMode/DonationModeList/hooks/useGetDonationMode";
import { DONATION_MODE_PERMISSION } from "@web/constants/permission/settings/donationMode/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const DonationModeList = () => {
  const { isMobile } = useGetDeviceType();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentDonationMode, setCurrentDonationMode] =
    useState<DonationMode>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetDonationMode({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
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
        onGridStateChange={setAgGridState}
        height={isMobile ? 170 : 160}
        actions={[
          {
            isView: validateAccess(DONATION_MODE_PERMISSION.EDIT),
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

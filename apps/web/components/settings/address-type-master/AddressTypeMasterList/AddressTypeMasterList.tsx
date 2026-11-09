import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditAddressTypeMasterDialog } from "@web/components/settings/address-type-master/AddressTypeMasterList/Dialogs/EditAddressTypeMasterDialog";
import { useAddressTypeColumns } from "@web/components/settings/address-type-master/AddressTypeMasterList/hooks/useAddressTypeColumns";
import {
  useGetAddressTypeMaster,
  type AddressType,
} from "@web/components/settings/address-type-master/AddressTypeMasterList/hooks/useGetAddressTypeMaster";
import { ADDRESS_TYPE_PERMISSION } from "@web/constants/permission/settings/addressType/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const AddressTypeMasterList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentAddressType, setCurrentAddressType] = useState<AddressType>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetAddressTypeMaster({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { addressTypeDetails: rowData, totalCount } = data || {};

  const { column } = useAddressTypeColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentAddressType && (
      <EditAddressTypeMasterDialog
        open
        addressTypeId={currentAddressType.address_type_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<AddressType>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            isView: validateAccess(ADDRESS_TYPE_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentAddressType(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

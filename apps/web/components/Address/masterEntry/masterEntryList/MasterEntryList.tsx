import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";

import type { MasterEntryListRef } from "@web/app/address/master-entry/page";
import { DeleteMasterEntryDialog } from "@web/components/Address/masterEntry/dialogs/DeleteMasterEntryDialog";
import { EditMasterEntryDialog } from "@web/components/Address/masterEntry/dialogs/EditMasterEntryDialog";
import {
  useGetMasterEntry,
  type MasterParameterDetails,
} from "@web/components/Address/masterEntry/masterEntryList/hooks/useGetMasterEntry";
import { useMasterEntryColumns } from "@web/components/Address/masterEntry/masterEntryList/hooks/useMasterEntryColumns";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { MASTER_PARAMETER_PERMISSION } from "@web/constants/permission/settings/masterParameter/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const MasterEntryList = forwardRef(
  (_, ref: ForwardedRef<MasterEntryListRef>) => {
    const { validateAccess } = useUserPermissions();

    const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const { data, isFetching, refetch } = useGetMasterEntry({
      endRow,
      filterModel: agGridFilterModel,
      startRow,
    });

    const { masterParameterDetails, totalCount } = data || {};

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const [currentMasterEntry, setCurrentMasterEntry] =
      useState<MasterParameterDetails>();

    const { column } = useMasterEntryColumns();

    const dialogRenderer: DialogRenderer = {
      delete: currentMasterEntry && (
        <DeleteMasterEntryDialog
          open
          masterEntry={currentMasterEntry}
          onDeleteSuccess={() => {
            refetch();
          }}
          onClose={onDialogClose}
        />
      ),
      edit: currentMasterEntry && (
        <EditMasterEntryDialog
          open
          masterParameterId={currentMasterEntry.master_parameter_id}
          onEditSuccess={() => {
            refetch();
          }}
          onClose={onDialogClose}
        />
      ),
    };

    useImperativeHandle(ref, () => ({
      refreshMasterEntryList() {
        refetch();
      },
    }));

    return (
      <>
        <AgGridV2<MasterParameterDetails>
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          rowsPerPage={rowsPerPage}
          rowData={masterParameterDetails}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onFilterChange={setAgGridFilterModel}
          height={200}
          actions={[
            {
              isView: validateAccess(MASTER_PARAMETER_PERMISSION.EDIT),
              onClick: (data) => {
                onDialogOpen("edit");
                setCurrentMasterEntry(data);
              },
              title: t("common.edit"),
            },

            {
              isView: validateAccess(MASTER_PARAMETER_PERMISSION.DELETE),
              onClick: (data) => {
                onDialogOpen("delete");
                setCurrentMasterEntry(data);
              },
              title: t("common.delete"),
            },
          ]}
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

MasterEntryList.displayName = "MasterEntryList";

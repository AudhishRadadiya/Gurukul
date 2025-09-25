import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteFinancialYearMasterDialog } from "@web/components/settings/financial-year-master/FinancialYearMasterList/Dialogs/DeleteFinancialYearMasterDialog";
import { EditFinancialYearMasterDialog } from "@web/components/settings/financial-year-master/FinancialYearMasterList/Dialogs/EditFinancialYearMasterDialog";
import { useFinancialYearMasterColumns } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useFinancialYearMasterColumns";
import {
  useGetFinancialYearMaster,
  type FinancialYear,
} from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import { AC_YEAR_MASTER_PERMISSION } from "@web/constants/permission/settings/acYearMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const FinancialYearMasterList = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const [currentFinancialYearMaster, setCurrentFinancialYearMaster] =
    useState<FinancialYear>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetFinancialYearMaster({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { financialYearDetails: rowData, totalCount } = data || {};

  const { column } = useFinancialYearMasterColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentFinancialYearMaster && (
      <DeleteFinancialYearMasterDialog
        open
        financialYear={currentFinancialYearMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentFinancialYearMaster && (
      <EditFinancialYearMasterDialog
        open
        financialYearId={currentFinancialYearMaster.financial_year_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<FinancialYear>
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
            isView: validateAccess(AC_YEAR_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentFinancialYearMaster(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(AC_YEAR_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentFinancialYearMaster(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

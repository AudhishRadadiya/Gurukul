import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import {
  useGetFamilyMember,
  type FamilyMemberDetail,
} from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMember";
import { useGetFamilyMemberColumns } from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMemberColumns";
import type { GetFamilyMemberExportApiSuccessResponse } from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMemberExport";
import { useGetFamilyMemberExport } from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMemberExport";
import type { FamilyMemberColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type FamilyMemberListProps = {
  columnHide: FamilyMemberColumnHideTypes;
  setColumnHide: (col: FamilyMemberColumnHideTypes) => void;
};

export const FamilyMemberList = ({
  columnHide,
  setColumnHide,
}: FamilyMemberListProps) => {
  const { allowPrintExport } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { branchIds } = useBranch();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetFamilyMember({
    endRow,
    externalFilter: { branch_id: [branchIds] },
    filterModel: agGridFilterModel,
    startRow,
  });

  const { family_memberDetail: rowData, totalCount } = data || {};

  const { columns } = useGetFamilyMemberColumns({
    columnHide,
  });

  const { mutate } = useGetFamilyMemberExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetFamilyMemberExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        endRow: 0,
        externalFilter: {
          branch_id: [branchIds],
        },
        filterModel: agGridFilterModel,
        startRow: 0,
      },
      fileType,
    });
  };

  const dialogRenderer: DialogRenderer = {
    columnChooser: (
      <ColumnArrangerDialog<FamilyMemberColumnHideTypes>
        columns={columns}
        title={t("common.column.chooser")}
        open
        onClose={onDialogClose}
        onSave={(columns) => {
          setColumnHide(columns);
        }}
      />
    ),
  };

  return (
    <>
      <PadBox padding={{ padding: "3px 5px" }}>
        <Box display="flex" justifyContent="flex-end">
          <Stack direction="row" gap="15px">
            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>

            <ColumnIconAction
              onClick={() => {
                onDialogOpen("columnChooser");
              }}
            />
          </Stack>
        </Box>
      </PadBox>

      <AgGridV2<FamilyMemberDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={columns}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={280}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

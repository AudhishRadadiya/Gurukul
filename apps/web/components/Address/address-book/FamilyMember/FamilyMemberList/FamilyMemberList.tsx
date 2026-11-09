import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
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

  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { branchIds } = useBranch();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetFamilyMember({
    endRow,
    externalFilter: { branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
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
        filterModel: agGridState.filterModel,
        sortModel: agGridState.sortModel,
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
      <PadBox padding={{ padding: { md: "3px 5px", xs: "8px 10px" } }}>
        <Stack
          direction="row"
          gap={1}
          justifyContent={{ md: "flex-end", xs: "flex-start" }}
          alignItems="center"
          flexWrap="wrap"
        >
          <PermissionGuard canAccess={allowPrintExport}>
            <DataExport onExport={onExport} />
          </PermissionGuard>

          <Box sx={{ flexShrink: 0, ml: { md: 0, xs: "auto" } }}>
            <ColumnIconAction
              onClick={() => {
                onDialogOpen("columnChooser");
              }}
            />
          </Box>
        </Stack>
      </PadBox>

      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<FamilyMemberDetail>
          isLoading={isFetching}
          page={page}
          columnDefs={columns}
          rowsPerPage={rowsPerPage}
          rowData={rowData}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onGridStateChange={setAgGridState}
          height={isMobile ? 230 : 280}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

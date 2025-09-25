import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ColumnArrangerDialog,
  ColumnIconAction,
  PadBox,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import {
  useGetFamilyMember,
  type FamilyMemberDetail,
} from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMember";
import { useGetFamilyMemberColumns } from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMemberColumns";
import type { FamilyMemberColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";

type FamilyMemberListProps = {
  columnHide: FamilyMemberColumnHideTypes;
  setColumnHide: (col: FamilyMemberColumnHideTypes) => void;
};

export const FamilyMemberList = ({
  columnHide,
  setColumnHide,
}: FamilyMemberListProps) => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetFamilyMember({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { family_memberDetail: rowData, totalCount } = data || {};

  const { columns } = useGetFamilyMemberColumns({
    columnHide,
  });

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
          <ColumnIconAction
            onClick={() => {
              onDialogOpen("columnChooser");
            }}
          />
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

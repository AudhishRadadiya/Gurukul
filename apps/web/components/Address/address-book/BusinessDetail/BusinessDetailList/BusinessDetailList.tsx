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

import type { BusinessDetail } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetail";
import { useGetBusinessDetail } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetail";
import { useGetBusinessDetailColumns } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetailColumns";
import type { BusinessDetailColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";

type BusinessDetailListProps = {
  columnHide: BusinessDetailColumnHideTypes;
  setColumnHide: (col: BusinessDetailColumnHideTypes) => void;
};

export const BusinessDetailList = ({
  columnHide,
  setColumnHide,
}: BusinessDetailListProps) => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetBusinessDetail({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { business_detail: rowData, totalCount } = data || {};

  const { columns } = useGetBusinessDetailColumns({
    columnHide,
  });

  const dialogRenderer: DialogRenderer = {
    columnChooser: (
      <ColumnArrangerDialog<BusinessDetailColumnHideTypes>
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

      <AgGridV2<BusinessDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={columns}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={290}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

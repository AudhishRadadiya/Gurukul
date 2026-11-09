import { useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { UserLoginReport } from "@web/components/user/userLoginReport/userLoginReportList/hooks/userGetUserLoginReport";
import { userGetUserLoginReport } from "@web/components/user/userLoginReport/userLoginReportList/hooks/userGetUserLoginReport";
import { useUserLoginReportColumns } from "@web/components/user/userLoginReport/userLoginReportList/hooks/useUserLoginReportColumns";

export type UserLoginReportListProps = {
  externalFilter: FieldValues;
};

export const UserLoginReportList = ({
  externalFilter,
}: UserLoginReportListProps) => {
  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = userGetUserLoginReport({
    endRow,
    externalFilter,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { totalCount, userLoginDetails: rowData } = data || {};

  const { column } = useUserLoginReportColumns();

  return (
    <AgGridV2<UserLoginReport>
      isLoading={isFetching}
      page={page}
      rowData={rowData}
      count={totalCount}
      columnDefs={column}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onGridStateChange={setAgGridState}
      onRowsPerPageChange={onRowsPerPageChange}
      height={isMobile ? 170 : 160}
    />
  );
};

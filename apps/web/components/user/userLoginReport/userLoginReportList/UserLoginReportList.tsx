import type { FilterModel } from "ag-grid-community";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { UserLoginReport } from "@web/components/user/userLoginReport/userLoginReportList/hooks/userGetUserLoginReport";
import { userGetUserLoginReport } from "@web/components/user/userLoginReport/userLoginReportList/hooks/userGetUserLoginReport";
import { useUserLoginReportColumns } from "@web/components/user/userLoginReport/userLoginReportList/hooks/useUserLoginReportColumns";

export type UserLoginReportListProps = {
  fromDate: string;
  toDate: string;
};

export const UserLoginReportList = ({
  fromDate,
  toDate,
}: UserLoginReportListProps) => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = userGetUserLoginReport({
    endRow,
    externalFilter: { from_date: fromDate, to_date: toDate },
    filterModel: agGridFilterModel,
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
      onFilterChange={setAgGridFilterModel}
      onRowsPerPageChange={onRowsPerPageChange}
      height={200}
    />
  );
};

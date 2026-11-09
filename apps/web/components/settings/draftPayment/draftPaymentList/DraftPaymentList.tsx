import type { FilterModel, SortModelItem } from "ag-grid-community";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useDraftPaymentColumns } from "@web/components/settings/draftPayment/draftPaymentList/hooks/useDraftPaymentColumns";
import type { TempPaymentDetails } from "@web/components/settings/draftPayment/draftPaymentList/hooks/useGetDraftPayment";
import { useGetDraftPayment } from "@web/components/settings/draftPayment/draftPaymentList/hooks/useGetDraftPayment";

export const DraftPaymentList = () => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetDraftPayment({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { tempPaymentDetails, totalCount } = data || {};

  const { column } = useDraftPaymentColumns();

  return (
    <AgGridV2<TempPaymentDetails>
      isLoading={isFetching}
      page={page}
      columnDefs={column}
      rowsPerPage={rowsPerPage}
      rowData={tempPaymentDetails}
      onPageChange={onPageChange}
      count={totalCount}
      onRowsPerPageChange={onRowsPerPageChange}
      onGridStateChange={setAgGridState}
      height={160}
    />
  );
};

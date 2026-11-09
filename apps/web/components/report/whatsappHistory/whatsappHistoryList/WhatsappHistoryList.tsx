import { useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { WhatsappHistory } from "@web/components/report/whatsappHistory/whatsappHistoryList/hooks/useGetWhatsappHistory";
import { useGetWhatsappHistory } from "@web/components/report/whatsappHistory/whatsappHistoryList/hooks/useGetWhatsappHistory";
import { useWhatsappHistoryColumns } from "@web/components/report/whatsappHistory/whatsappHistoryList/hooks/useWhatsappHistoryColumns";

export type WhatsappHistoryListProps = {
  externalFilter: FieldValues;
};

export const WhatsappHistoryList = ({
  externalFilter,
}: WhatsappHistoryListProps) => {
  const { isMobile } = useGetDeviceType();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetWhatsappHistory({
    endRow,
    externalFilter,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { totalCount, whatsappHistoryDetails: rowData } = data || {};

  const { column } = useWhatsappHistoryColumns();

  return (
    <AgGridV2<WhatsappHistory>
      isLoading={isFetching}
      page={page}
      rowData={rowData}
      count={totalCount}
      columnDefs={column}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onGridStateChange={setAgGridState}
      onRowsPerPageChange={onRowsPerPageChange}
      height={isMobile ? 230 : 160}
    />
  );
};

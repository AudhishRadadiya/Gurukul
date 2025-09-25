import type { CustomCellRendererProps } from "ag-grid-react";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { FinancialYear } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useFinancialYearMasterColumns = () => {
  const column: AgColumnsWithActions<FinancialYear> = [
    {
      field: "financial_year",
      headerName: "Financial Year",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "start_date",
      headerName: "Start Date",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "end_date",
      headerName: "End Date",
    },
    {
      field: "is_active",
      headerName: "Is Active",
    },
  ];

  return { column };
};

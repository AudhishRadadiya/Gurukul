import { useMemo } from "react";
import type { SimpleColDef, SmartGridColumnDef } from "../ColumnArrangerDialog";

type RefinedColumn = {
  field: string;
  hide?: boolean;
  headerName: string;
};

export const useRefinedColumns = (
  columns: Array<SimpleColDef | SmartGridColumnDef>
): RefinedColumn[] => {
  return useMemo(() => {
    return columns
      .map((column) => {
        const agGridColumn = column as SimpleColDef;

        const smartGridColumn = column as SmartGridColumnDef;

        const field = agGridColumn.field ?? smartGridColumn.accessorKey;

        const headerName = agGridColumn.headerName ?? smartGridColumn.header;

        if (!field || !headerName) {
          return null;
        }

        const result: RefinedColumn = { field, headerName };

        if (column.hide !== undefined) {
          result.hide = column.hide;
        }

        return result;
      })
      .filter((col): col is RefinedColumn => !!col);
  }, [columns]);
};

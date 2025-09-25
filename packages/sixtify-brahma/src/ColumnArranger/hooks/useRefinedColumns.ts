import { useMemo } from "react";
import type { SimpleColDef } from "../ColumnArrangerDialog";

type RefinedColumn = {
  field: string;
  hide?: boolean;
  headerName: string;
};

export const useRefinedColumns = (columns: SimpleColDef[]): RefinedColumn[] => {
  return useMemo(() => {
    return columns
      .filter(
        (col): col is { field: string; hide?: boolean; headerName: string } =>
          !!col.field
      )
      .map(({ field, hide, headerName }) => {
        const result: RefinedColumn = { field, headerName };

        if (hide !== undefined) {
          result.hide = hide;
        }

        return result;
      });
  }, [columns]);
};

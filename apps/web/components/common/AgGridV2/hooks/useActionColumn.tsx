import { ActionCell } from "@codezee/sixtify-brahma";
import type { ColDef, ColDefField } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import _isFunction from "lodash/isFunction";

export type UseActionColumnArgs<T> = {
  isView?: boolean;
  onClick: (data: T) => void;
  title: string | ((data: T) => string);
}[];

export const useActionColumn = <T,>(actions: UseActionColumnArgs<T>) => {
  const actionColumn: ColDef<T> = {
    cellRenderer: ({ data }: CustomCellRendererProps) => {
      const actionItems = actions.map((action) => ({
        onClick: () => {
          action.onClick(data);
        },
        title: _isFunction(action.title) ? action.title(data) : action.title,
      }));

      return <ActionCell items={actionItems} />;
    },
    field: "action" as ColDefField<T>,
    filter: false,
    headerName: "",
    maxWidth: 55,
    pinned: "right",
    sortable: false,
  };

  return { actionColumn };
};

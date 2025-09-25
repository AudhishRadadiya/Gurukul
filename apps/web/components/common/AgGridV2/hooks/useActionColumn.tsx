import { ActionCell } from "@codezee/sixtify-brahma";
import type { ColDef, ColDefField } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";

export type UseActionColumnArgs<T> = {
  isView?: boolean;
  onClick: (data: T) => void;
  title: string;
}[];

export const useActionColumn = <T,>(actions: UseActionColumnArgs<T>) => {
  const actionColumn: ColDef<T> = {
    cellRenderer: ({ data }: CustomCellRendererProps) => {
      const actionItems = actions.map((action) => ({
        onClick: () => {
          action.onClick(data);
        },
        title: action.title,
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

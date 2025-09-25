import type { ColDef } from "ag-grid-community";

type Action = {
  action?: string;
};

export type AgDataWithActions<TData> = TData & Action;

export type AgColumnsWithActions<TData> = ColDef<AgDataWithActions<TData>>[];

export type AgColumnsArgs<TData> = TData & { loading?: boolean };

export type QuickFilter = {
  quickFilter: {
    search: {
      filter?: string;
    };
  };
};

import type { SxProps, Theme } from "@mui/material";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
} from "@tanstack/react-table";
import type { Ref } from "react";
import type { OnAction } from "../../utils/types";

export type SummaryType =
  | "sum"
  | "avg"
  | "count"
  | "min"
  | "max"
  | "cross_field";

export type PaginationConfig = {
  pageIndex: number;
  pageSize: number;
  pageSizeOptions?: number[];
};

export type CrossFieldSummaryConfig<T> = {
  calculation: "sum" | "avg" | "multiply" | "custom";
  customCalculation?: (values: Record<string, number>) => number;
  field: keyof T;
  formatter?: (value: number) => string;
  label?: string;
  sourceFields: Array<{
    field: keyof T;
    operation: "sum" | "avg" | "count" | "min" | "max";
  }>;
};

export type SummaryConfig<T> = {
  field: keyof T;
  formatter?: (value: number) => string;
  label?: string;
  type: SummaryType;
};

export type ColumnMeta<T> = {
  allowGrouping?: boolean;
  enableSorting?: boolean;
  filterOptions?: { label: string; value: string }[];
  filterPlaceholder?: string;
  isGrow?: boolean;
  maxWidth?: number;
  minWidth?: number;
  pinned?: "left" | "right";
  summaryConfig?: SummaryConfig<T>[];
  width?: number;
  widthPercentage?: number;
};

export type CombinedFilter = {
  facets?: string[];
  search?: string;
};

export type AppColumnDef<TData> = ColumnDef<TData> & {
  accessorKey?: keyof TData | "action";
  facetedFilter?: boolean;
  filterFn?:
    | "multiSelect"
    | "includesString"
    | "criteriaText"
    | "criteriaNumber"
    | "includesSome"
    | "combinedFilter";
  filterParams?: {
    filterOptions: { label: string; value: string | boolean | number }[];
  };
  filterVariant?:
    | "smartTextFilter"
    | "smartNumberFilter"
    | "smartDateFilter"
    | "smartSelectFilter";
  id?: string;
  meta?: ColumnMeta<TData>;
  pinned?: "left" | "right";
};

export type SummaryValue = {
  style?: React.CSSProperties;
  value: React.ReactNode;
};

export type SummaryRecord<T> = Partial<Record<keyof T, SummaryValue>>;

export type CellPosition = {
  columnId: string;
  rowId: string;
};

export type CellRange = {
  end: CellPosition;
  start: CellPosition;
};

export type CellSelectionState = {
  activeCell: CellPosition | null;
  isSelecting: boolean;
  selectedCells: Set<string>;
  selectionRange: CellRange | null;
};

export type SmartGridRef<T> = {
  clearCellSelection: OnAction;
  getCellSelectionData: () => string[][];
  getSelectedRows: () => T[];
  getTable: () => Table<T>;
};

export type DynamicSummaryConfig<T> = {
  calculation: (values: T[]) => number | string;
  field: keyof T;
  formatter?: (value: number) => string;
  label?: string;
};

export type SmartGridProps<T> = {
  columns: Array<AppColumnDef<T>>;
  data: T[];
  debugTable?: boolean;
  defaultColumnWidth?: number;
  defaultGrouping?: Array<keyof T>;
  dynamicRowSelection?: (rowNode: T) => boolean;
  dynamicSummaryConfig?: DynamicSummaryConfig<T>[];
  emptyMessage?: string;
  enableCellSelection?: boolean;
  enableColumnPinning?: boolean;
  enableCrossFieldSummary?: boolean;
  enableExpanding?: boolean;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  enablePagination?: boolean;
  enablePinning?: boolean;
  enableRowSelection?: boolean;
  enableSorting?: boolean;
  enableSummaryRows?: boolean;
  error?: string | null;
  exportActions?: Array<{ label: string; onClick: () => void }>;
  exportData?: boolean;
  globalSummaryConfig?: Array<SummaryConfig<T> | CrossFieldSummaryConfig<T>>;
  height?: string;
  initialPinnedColumns?: {
    left?: string[];
    right?: string[];
  };
  loading: boolean;
  onFiltersChange?: (filters: ColumnFiltersState) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  pagination?: PaginationConfig;
  ref?: Ref<SmartGridRef<T>>;
  rowHeight?: number;
  rowSelection?: boolean;
  summary?: SummaryRecord<T>;
  swipeableColumns?: boolean;
  sx?: SxProps<Theme>;
  totalCount: number;
};

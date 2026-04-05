import {
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  type GroupingState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { useGetFacetedFilter } from "./useGetFacetedFilter";
import { useGetPinningColumns } from "./useGetPinningColumns";
import type { SmartGridProps } from "../types";

export const useTableState = <T>(props: SmartGridProps<T>) => {
  const { columns, data } = props;

  const { combinedFilter, dateRangeFilter, includesSome, processedColumns } =
    useGetFacetedFilter({
      columns,
    });

  const [sorting, setSorting] = useState<SortingState>([]);

  const [grouping, setGrouping] = useState<GroupingState>(
    (props.defaultGrouping as string[]) ?? []
  );

  const [expanded, setExpanded] = useState<ExpandedState>(true);

  const [rowSelection, setRowSelection] = useState({});

  const { hasPinnedColumns, initialPinning } = useGetPinningColumns({
    columns,
  });

  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>(initialPinning);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const {
    enableExpanding = true,
    enableGrouping = true,
    enablePinning = hasPinnedColumns,
    enableRowSelection = true,
    enableSorting = true,
  } = props;

  const table = useReactTable({
    autoResetExpanded: false,
    columnResizeDirection: "ltr",
    columnResizeMode: "onChange",
    columns: processedColumns,
    data,
    defaultColumn: { maxSize: 500, minSize: 100, size: 150 },
    enableExpanding,
    enableGrouping,
    enablePinning,
    enableRowSelection,
    enableSorting,
    filterFns: {
      combinedFilter,
      dateRangeFilter,
      includesSome,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnOrder,
      columnPinning,
      expanded,
      grouping,
      rowSelection,
      sorting,
    },
  });

  useEffect(() => {
    setExpanded(true);
  }, [grouping, data.length]);

  return { table };
};

import type { FilterFn } from "@tanstack/react-table";
import { useMemo } from "react";

import { isValid, parseISO } from "date-fns";
import type { AppColumnDef, CombinedFilter } from "../types";

type UseGetFacetedFilterProps<T> = {
  columns: AppColumnDef<T>[];
};

export const useGetFacetedFilter = <T>({
  columns,
}: UseGetFacetedFilterProps<T>) => {
  const includesSome: FilterFn<T> = (row, columnId, filterValue) => {
    if (
      !filterValue ||
      (Array.isArray(filterValue) && filterValue.length === 0)
    ) {
      return true;
    }

    const cellValue = row.getValue(columnId);

    const cellValueStr = cellValue != null ? String(cellValue) : "";

    if (Array.isArray(filterValue)) {
      return filterValue.some(
        (filterVal) => String(filterVal) === cellValueStr
      );
    }

    return String(filterValue) === cellValueStr;
  };

  const combinedFilter: FilterFn<T> = (row, columnId, filterValue) => {
    if (!filterValue) {
      return true;
    }

    const cellValue = row.getValue(columnId);

    const cellValueStr = cellValue != null ? String(cellValue) : "";

    // Handle combined filter object
    if (typeof filterValue === "object" && !Array.isArray(filterValue)) {
      const combinedFilterValue = filterValue as CombinedFilter;

      const { facets, search } = combinedFilterValue;

      let matches = true;

      // Check search filter
      if (search && search.trim() !== "") {
        matches =
          matches && cellValueStr.toLowerCase().includes(search.toLowerCase());
      }

      // Check facets filter
      if (facets && facets.length > 0) {
        matches =
          matches &&
          facets.some((filterVal) => String(filterVal) === cellValueStr);
      }

      return matches;
    }

    // Fallback to original logic for backward compatibility
    if (Array.isArray(filterValue)) {
      return filterValue.some(
        (filterVal) => String(filterVal) === cellValueStr
      );
    }

    return String(filterValue) === cellValueStr;
  };

  const parseToDate = (value: unknown) => {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = parseISO(value);

      if (isValid(parsed)) {
        return parsed;
      }
    }

    return null;
  };

  const dateRangeFilter: FilterFn<T> = (row, columnId, filterValue) => {
    if (!Array.isArray(filterValue) || filterValue.length === 0) {
      return true;
    }

    const [startValue, endValue] = filterValue;

    const startDate = parseToDate(startValue);

    const endDate = parseToDate(endValue ?? startValue);

    if (!startDate || !endDate) {
      return true;
    }

    const normalizedStart = new Date(startDate);

    normalizedStart.setHours(0, 0, 0, 0);

    const normalizedEnd = new Date(endDate);

    normalizedEnd.setHours(23, 59, 59, 999);

    const cellValue = row.getValue(columnId);

    const cellDate = parseToDate(cellValue);

    if (!cellDate) {
      const cellString = cellValue != null ? String(cellValue) : "";

      const startString = String(startValue ?? "");

      const endString =
        typeof endValue === "string" && endValue ? endValue : startString;

      return cellString >= startString && cellString <= endString;
    }

    const cellTime = new Date(cellDate).getTime();

    return (
      cellTime >= normalizedStart.getTime() &&
      cellTime <= normalizedEnd.getTime()
    );
  };

  const processedColumns = useMemo(() => {
    return columns.map((col) => {
      const appCol = col as AppColumnDef<T>;

      const { facetedFilter, filterVariant } = appCol;

      // If column has both facetedFilter and filterVariant, use combined filter
      if (facetedFilter && filterVariant) {
        return {
          ...col,
          filterFn: "combinedFilter" as const,
        } as AppColumnDef<T>;
      }

      if (filterVariant === "smartDateFilter") {
        return {
          ...col,
          filterFn: "dateRangeFilter",
        } as unknown as AppColumnDef<T>;
      }

      // If only faceted filter, use includesSome
      if (facetedFilter) {
        return {
          ...col,
          filterFn: "includesSome" as const,
        } as AppColumnDef<T>;
      }

      return col;
    });
  }, [columns]);

  return { combinedFilter, dateRangeFilter, includesSome, processedColumns };
};

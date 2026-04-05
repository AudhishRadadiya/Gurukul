import type { Table } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

import type { AppColumnDef } from "../types";

type UseGetColumnWidthProps<T> = {
  columns: AppColumnDef<T>[];
  headerRef: React.RefObject<HTMLTableSectionElement>;
  table: Table<T>;
};

export const useGetColumnWidth = <T>({
  columns,
  headerRef,
  table,
}: UseGetColumnWidthProps<T>) => {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  const { getColumn, getRowModel, getState } = table;

  const columnSizing = getState().columnSizing;

  const columnOrder = getState().columnOrder;

  const rowDataLength = getRowModel().rows.length;

  const updateColumnWidths = useCallback(() => {
    if (headerRef.current) {
      // Find all header rows
      const headerRows = headerRef.current.querySelectorAll("tr");

      // Get the last row which contains the actual data column headers (not grouped headers)
      const lastHeaderRow = headerRows[headerRows.length - 1];

      if (lastHeaderRow) {
        const headerCells = lastHeaderRow.querySelectorAll("th");

        const widths = Array.from(headerCells).map((cell) => {
          const columnId = cell.getAttribute("data-column-id");

          const columnDef = columnId ? getColumn(columnId)?.columnDef : null;

          return cell.getBoundingClientRect().width ?? columnDef?.size ?? 50;
        });

        setColumnWidths(widths);
      }
    } else {
      const flatColumns: AppColumnDef<T>[] = [];

      const flattenColumns = (cols: AppColumnDef<T>[]) => {
        cols.forEach((col) => {
          if ("columns" in col && col.columns) {
            flattenColumns(col.columns as AppColumnDef<T>[]);
          } else {
            flatColumns.push(col);
          }
        });
      };

      flattenColumns(columns);
      setColumnWidths(flatColumns.map((col) => col.size ?? 150));
    }
  }, [headerRef, table, columns]);

  useEffect(() => {
    updateColumnWidths();

    window.addEventListener("resize", updateColumnWidths);

    const observer = new ResizeObserver(() => {
      updateColumnWidths();
    });

    if (headerRef.current?.parentElement) {
      observer.observe(headerRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", updateColumnWidths);
      observer.disconnect();
    };
  }, [
    columnSizing,
    columnOrder,
    columns.length,
    rowDataLength,
    updateColumnWidths,
  ]);

  return { columnWidths };
};

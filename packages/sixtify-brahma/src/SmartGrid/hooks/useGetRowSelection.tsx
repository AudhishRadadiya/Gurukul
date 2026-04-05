import type { CellContext, HeaderContext } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import { IndeterminateCheckbox } from "../Components/IndeterminateCheckbox";
import type { AppColumnDef } from "../types";

type UseGetRowSelectionProps<T> = {
  defaultColumn: AppColumnDef<T>[];
  dynamicRowSelection?: (rowNode: T) => boolean;
  rowSelection: boolean;
};

export const useGetRowSelection = <T,>({
  defaultColumn,
  dynamicRowSelection,
  rowSelection,
}: UseGetRowSelectionProps<T>) => {
  // Stable cell renderer
  const renderSelectionCell = useCallback(
    (info: CellContext<T, unknown>) => {
      // Check if row is selectable
      const isSelectable = dynamicRowSelection
        ? dynamicRowSelection(info.row.original)
        : true;

      if (!isSelectable) {
        return null;
      }

      return (
        <IndeterminateCheckbox
          checked={info.row.getIsSelected()}
          disabled={!info.row.getCanSelect()}
          indeterminate={info.row.getIsSomeSelected()}
          onChange={info.row.getToggleSelectedHandler()}
        />
      );
    },
    [dynamicRowSelection]
  );

  // Stable header renderer
  const renderSelectionHeader = useCallback(
    (info: HeaderContext<T, unknown>) => {
      if (!dynamicRowSelection) {
        // Fast path: no dynamic selection
        return (
          <IndeterminateCheckbox
            checked={info.table.getIsAllRowsSelected()}
            indeterminate={info.table.getIsSomeRowsSelected()}
            onChange={info.table.getToggleAllRowsSelectedHandler()}
          />
        );
      }

      // Use a simple event handler that doesn't rely on state
      const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;

        const rows = info.table.getRowModel().rows;

        // Use table's batch selection for better performance
        info.table.setRowSelection((old) => {
          const newSelection: Record<string, boolean> = { ...old };

          // eslint-disable-next-line sonarjs/no-nested-functions
          rows.forEach((row) => {
            if (dynamicRowSelection(row.original)) {
              if (checked) {
                newSelection[row.id] = true;
              } else {
                delete newSelection[row.id];
              }
            }
          });

          return newSelection;
        });
      };

      // Calculate state only when rendering, not in event handler
      const rows = info.table.getRowModel().rows;

      const rowSelection = info.table.getState().rowSelection;

      let selectableCount = 0;

      let selectedCount = 0;

      for (const row of rows) {
        if (dynamicRowSelection(row.original)) {
          selectableCount++;

          if (rowSelection[row.id]) {
            selectedCount++;
          }
        }
      }

      const allSelected =
        selectableCount > 0 && selectedCount === selectableCount;

      const someSelected = selectedCount > 0 && selectedCount < selectableCount;

      return (
        <IndeterminateCheckbox
          checked={allSelected}
          indeterminate={someSelected}
          disabled={selectableCount === 0}
          onChange={handleToggleAll}
        />
      );
    },
    [dynamicRowSelection]
  );

  const dynamicColumns: AppColumnDef<T>[] = useMemo(() => {
    return defaultColumn.map((col) => {
      if (col.filterVariant === "smartNumberFilter" && !col.filterFn) {
        return { ...col, filterFn: "includesString" };
      }

      return col;
    });
  }, [defaultColumn]);

  const columns: AppColumnDef<T>[] = useMemo(() => {
    if (!rowSelection) {
      return dynamicColumns;
    }

    const selectionColumn: AppColumnDef<T> = {
      cell: renderSelectionCell,
      enableSorting: false,
      header: renderSelectionHeader,
      id: "select",
      maxSize: 30,
      minSize: 30,
    };

    return [selectionColumn, ...dynamicColumns];
  }, [
    dynamicColumns,
    rowSelection,
    renderSelectionCell,
    renderSelectionHeader,
  ]);

  return { columns };
};

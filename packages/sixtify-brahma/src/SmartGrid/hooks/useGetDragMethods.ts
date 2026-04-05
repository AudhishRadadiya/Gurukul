import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Header, Table } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import type { AppColumnDef } from "../types";

type UseGetDragMethodsArgs<T> = {
  swipeableColumns: boolean;
  table: Table<T>;
};

export const useGetDragMethods = <T>({
  swipeableColumns,
  table,
}: UseGetDragMethodsArgs<T>) => {
  // Memoize non-reorderable column IDs to avoid recreating the Set on every render
  const nonReorderableColumnIds = useMemo(
    () => new Set(["select", "action"]),
    []
  );

  // Initialize DnD sensors with pointer detection and minimal activation distance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  /**
   *  useCallback is used here to memoize the function
   * so it doesn’t get re-created on every render.
   *
   * Checks if a header (column) is reorderable.
   * Returns false for pinned, placeholder, or disabled columns.
   */

  const isHeaderReorderable = useCallback(
    (header: Header<T, unknown>, isLeaf: boolean) => {
      if (!swipeableColumns || !isLeaf || header.isPlaceholder) {
        return false;
      }

      const columnId = header.column.id;

      const columnDef = header.column.columnDef as AppColumnDef<T>;

      const accessorKey = columnDef?.accessorKey;

      const { enableColumnOrdering } = columnDef as {
        enableColumnOrdering?: boolean;
      };

      return (
        enableColumnOrdering !== false &&
        accessorKey !== "action" &&
        !nonReorderableColumnIds.has(columnId)
      );
    },
    [swipeableColumns, nonReorderableColumnIds]
  );

  /**
   *  useCallback is used again to memoize `handleDragEnd`
   * to ensure stable reference across renders.
   *
   * Handles column drag-and-drop reordering:
   * - Skips pinned columns
   * - Updates the column order in the TanStack Table instance
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!swipeableColumns) {
        return;
      }

      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const activeId = String(active.id);

      const overId = String(over.id);

      const activeColumn = table.getColumn(activeId);

      const overColumn = table.getColumn(overId);

      if (!activeColumn || !overColumn) {
        return;
      }

      if (activeColumn.getIsPinned() || overColumn.getIsPinned()) {
        return;
      }

      const allLeafColumns = table.getAllLeafColumns();

      const currentOrder =
        table.getState().columnOrder.length > 0
          ? table.getState().columnOrder
          : allLeafColumns.map((column) => column.id);

      const { center, left, right } = currentOrder.reduce(
        (acc, columnId) => {
          const column = table.getColumn(columnId);

          if (!column) {
            return acc;
          }

          const pinState = column.getIsPinned();

          if (pinState === "left") {
            acc.left.push(columnId);
          } else if (pinState === "right") {
            acc.right.push(columnId);
          } else {
            acc.center.push(columnId);
          }

          return acc;
        },
        {
          center: [] as string[],
          left: [] as string[],
          right: [] as string[],
        }
      );

      const activeIndex = center.indexOf(activeId);

      const overIndex = center.indexOf(overId);

      if (activeIndex === -1 || overIndex === -1) {
        return;
      }

      const updatedCenterOrder = arrayMove(center, activeIndex, overIndex);

      const newOrder = [...left, ...updatedCenterOrder, ...right];

      table.setColumnOrder(newOrder);
    },
    [swipeableColumns, table]
  );

  return {
    handleDragEnd,
    isHeaderReorderable,
    sensors,
  };
};

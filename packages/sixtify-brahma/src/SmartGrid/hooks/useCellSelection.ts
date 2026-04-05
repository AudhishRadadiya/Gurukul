import type { Table } from "@tanstack/react-table";
import { useCallback, useRef, useState } from "react";

import type { CellPosition, CellRange, CellSelectionState } from "../types";

type UseCellSelectionArgs<T> = {
  enabled: boolean;
  table: Table<T>;
};

export const useCellSelection = <T>({
  enabled,
  table,
}: UseCellSelectionArgs<T>) => {
  const [selectionState, setSelectionState] = useState<CellSelectionState>({
    activeCell: null,
    isSelecting: false,
    selectedCells: new Set<string>(),
    selectionRange: null,
  });

  const [isCopyFlashing, setIsCopyFlashing] = useState(false);

  const isSelectingRef = useRef(false);

  const anchorCellRef = useRef<CellPosition | null>(null);

  const getCellKey = useCallback((rowId: string, columnId: string): string => {
    return `${rowId}-${columnId}`;
  }, []);

  const getCellsInRange = useCallback(
    (start: CellPosition, end: CellPosition): Set<string> => {
      const cells = new Set<string>();

      const { getRowModel, getVisibleFlatColumns } = table;

      const rows = getRowModel().rows;

      const visibleColumns = getVisibleFlatColumns();

      // Find row indices
      const startRowIndex = rows.findIndex(({ id }) => id === start.rowId);

      const endRowIndex = rows.findIndex(({ id }) => id === end.rowId);

      // Find column indices
      const startColIndex = visibleColumns.findIndex(
        ({ id }) => id === start.columnId
      );

      const endColIndex = visibleColumns.findIndex(
        ({ id }) => id === end.columnId
      );

      if (
        startRowIndex === -1 ||
        endRowIndex === -1 ||
        startColIndex === -1 ||
        endColIndex === -1
      ) {
        return cells;
      }

      const minRow = Math.min(startRowIndex, endRowIndex);

      const maxRow = Math.max(startRowIndex, endRowIndex);

      const minCol = Math.min(startColIndex, endColIndex);

      const maxCol = Math.max(startColIndex, endColIndex);

      for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
        const row = rows[rowIndex];

        if (!row) {
          continue;
        }

        for (let colIndex = minCol; colIndex <= maxCol; colIndex++) {
          const column = visibleColumns[colIndex];

          if (!column) {
            continue;
          }

          cells.add(getCellKey(row.id, column.id));
        }
      }

      return cells;
    },
    [table, getCellKey]
  );

  //  useCallback is used Prevents unnecessary re-renders and Prevents infinite loops
  const startCellSelection = useCallback(
    (rowId: string, columnId: string, isShiftClick: boolean = false) => {
      if (!enabled) {
        return;
      }

      const cellPosition: CellPosition = { columnId, rowId };

      // Handle Shift+Click: select range from anchor to current cell
      if (isShiftClick && anchorCellRef.current) {
        const selectedCells = getCellsInRange(
          anchorCellRef.current,
          cellPosition
        );

        setSelectionState({
          activeCell: cellPosition,
          isSelecting: false,
          selectedCells,
          selectionRange: {
            end: cellPosition,
            start: anchorCellRef.current,
          },
        });

        return;
      }

      // Normal click: start new selection and set anchor
      isSelectingRef.current = true;
      anchorCellRef.current = cellPosition;

      setSelectionState({
        activeCell: cellPosition,
        isSelecting: true,
        selectedCells: new Set([getCellKey(rowId, columnId)]),
        selectionRange: { end: cellPosition, start: cellPosition },
      });
    },
    [enabled, getCellKey, getCellsInRange]
  );

  const updateCellSelection = useCallback(
    (rowId: string, columnId: string) => {
      if (!enabled || !isSelectingRef.current) {
        return;
      }

      setSelectionState((prev) => {
        if (!prev.selectionRange) {
          return prev;
        }

        const endPosition: CellPosition = { columnId, rowId };

        const newRange: CellRange = {
          end: endPosition,
          start: prev.selectionRange.start,
        };

        const selectedCells = getCellsInRange(newRange.start, newRange.end);

        return {
          ...prev,
          isSelecting: true,
          selectedCells,
          selectionRange: newRange,
        };
      });
    },
    [enabled, getCellsInRange]
  );

  const endCellSelection = useCallback(() => {
    if (!enabled) {
      return;
    }

    isSelectingRef.current = false;

    setSelectionState((prev) => ({
      ...prev,
      isSelecting: false,
    }));
  }, [enabled]);

  const clearCellSelection = useCallback(() => {
    isSelectingRef.current = false;
    anchorCellRef.current = null;

    setSelectionState({
      activeCell: null,
      isSelecting: false,
      selectedCells: new Set<string>(),
      selectionRange: null,
    });
  }, []);

  const isCellSelected = useCallback(
    (rowId: string, columnId: string): boolean => {
      return selectionState.selectedCells.has(getCellKey(rowId, columnId));
    },
    [selectionState.selectedCells, getCellKey]
  );

  const triggerCopyFlash = useCallback(() => {
    setIsCopyFlashing(true);

    // Clear the flash after animation completes (500ms)
    setTimeout(() => {
      setIsCopyFlashing(false);
    }, 500);
  }, []);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const getCellSelectionData = useCallback((): string[][] => {
    if (!selectionState.selectionRange) {
      return [];
    }

    const { end, start } = selectionState.selectionRange;

    const { getRowModel, getVisibleFlatColumns } = table;

    const rows = getRowModel().rows;

    const visibleColumns = getVisibleFlatColumns();

    // Find row indices
    const startRowIndex = rows.findIndex(({ id }) => id === start.rowId);

    const endRowIndex = rows.findIndex(({ id }) => id === end.rowId);

    // Find column indices
    const startColIndex = visibleColumns.findIndex(
      ({ id }) => id === start.columnId
    );

    const endColIndex = visibleColumns.findIndex(
      ({ id }) => id === end.columnId
    );

    if (
      startRowIndex === -1 ||
      endRowIndex === -1 ||
      startColIndex === -1 ||
      endColIndex === -1
    ) {
      return [];
    }

    const minRow = Math.min(startRowIndex, endRowIndex);

    const maxRow = Math.max(startRowIndex, endRowIndex);

    const minCol = Math.min(startColIndex, endColIndex);

    const maxCol = Math.max(startColIndex, endColIndex);

    const data: string[][] = [];

    for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
      const row = rows[rowIndex];

      if (!row) {
        continue;
      }

      const rowData: string[] = [];

      for (let colIndex = minCol; colIndex <= maxCol; colIndex++) {
        const column = visibleColumns[colIndex];

        if (!column) {
          continue;
        }

        const cell = row
          .getVisibleCells()
          .find((c) => c.column.id === column.id);

        if (!cell) {
          rowData.push("");

          continue;
        }

        // Get the cell value
        let cellValue = "";

        const value = cell.getValue();

        if (typeof value === "object") {
          cellValue = JSON.stringify(value);
        } else {
          cellValue = String(value);
        }

        rowData.push(cellValue);
      }

      data.push(rowData);
    }

    return data;
  }, [selectionState.selectionRange, table]);

  return {
    clearCellSelection,
    endCellSelection,
    getCellSelectionData,
    isCellSelected,
    isCopyFlashing,
    selectionState,
    startCellSelection,
    triggerCopyFlash,
    updateCellSelection,
  };
};

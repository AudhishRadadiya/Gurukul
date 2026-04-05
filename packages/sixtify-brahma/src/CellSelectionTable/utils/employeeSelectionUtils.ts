import type { TableDataRow } from "../CellSelectionTable";
import type { CellCoord, EmployeeCellCoord } from "./types";

export function convertToEmployeeCoords(
  cellCoords: CellCoord[],
  data: TableDataRow[]
): EmployeeCellCoord[] {
  return cellCoords.map((coord) => {
    const row = data[coord.row];

    const employeeId =
      typeof row?.id === "string" ? row.id : `row-${coord.row}`;

    return {
      employeeId,
      col: coord.col,
      originalRow: coord.row,
    };
  });
}

export function convertFromEmployeeCoords(
  employeeCoords: EmployeeCellCoord[],
  data: TableDataRow[]
): CellCoord[] {
  return employeeCoords
    .map((coord) => {
      const rowIndex = data.findIndex((row, index) => {
        const rowEmployeeId =
          typeof row?.id === "string" ? row.id : `row-${index}`;

        return rowEmployeeId === coord.employeeId;
      });

      if (rowIndex === -1) {
        return null;
      }

      return {
        row: rowIndex,
        col: coord.col,
      };
    })
    .filter((coord): coord is CellCoord => coord !== null);
}

export function createEmployeeRowMapping(
  data: TableDataRow[]
): Map<string, number> {
  const mapping = new Map<string, number>();

  data.forEach((row, index) => {
    const employeeId = typeof row?.id === "string" ? row.id : `row-${index}`;

    mapping.set(employeeId, index);
  });

  return mapping;
}

export function updateCellCoordsForSorting(
  selectedRanges: CellCoord[][],
  oldData: TableDataRow[],
  newData: TableDataRow[]
): CellCoord[][] {
  const newEmployeeMap = createEmployeeRowMapping(newData);

  return selectedRanges.map((range) => {
    return range
      .map((cell) => {
        const oldRow = oldData[cell.row];

        const employeeId =
          typeof oldRow?.id === "string" ? oldRow.id : `row-${cell.row}`;

        const newRowIndex = newEmployeeMap.get(employeeId);

        if (newRowIndex === undefined) {
          return null;
        }

        return {
          row: newRowIndex,
          col: cell.col,
        };
      })
      .filter((coord): coord is CellCoord => coord !== null);
  });
}

/**
 * Creates a mapping from sorted data row indices to original data row indices
 * This is useful for updating data when the table is sorted
 */
export function createSortedToOriginalMapping(
  originalData: TableDataRow[],
  sortedData: TableDataRow[]
): Map<number, number> {
  const mapping = new Map<number, number>();

  const originalEmployeeMap = createEmployeeRowMapping(originalData);

  sortedData.forEach((sortedRow, sortedIndex) => {
    const employeeId =
      typeof sortedRow?.id === "string" ? sortedRow.id : `row-${sortedIndex}`;

    const originalIndex = originalEmployeeMap.get(employeeId);

    if (originalIndex !== undefined) {
      mapping.set(sortedIndex, originalIndex);
    }
  });

  return mapping;
}

/**
 * Converts cell coordinates from sorted data indices to original data indices
 * This ensures that data updates are applied to the correct rows in the original data
 */
export function convertSortedCoordsToOriginal(
  sortedCoords: CellCoord[],
  sortedToOriginalMapping: Map<number, number>
): CellCoord[] {
  return sortedCoords
    .map((coord) => {
      const originalRowIndex = sortedToOriginalMapping.get(coord.row);

      if (originalRowIndex === undefined) {
        return null;
      }

      return {
        row: originalRowIndex,
        col: coord.col,
      };
    })
    .filter((coord): coord is CellCoord => coord !== null);
}

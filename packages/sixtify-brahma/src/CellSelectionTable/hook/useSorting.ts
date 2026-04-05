import { useCallback, useMemo, useState } from "react";
import type { TableDataRow } from "../CellSelectionTable";
import {
  convertSortedCoordsToOriginal,
  createSortedToOriginalMapping,
  updateCellCoordsForSorting,
} from "../utils/employeeSelectionUtils";
import {
  getNextSortDirection,
  sortTableData,
  type SortConfig,
} from "../utils/sortUtils";
import type { CellCoord, Column } from "../utils/types";

export type UseSortingProps = {
  data: TableDataRow[];
  columns: Column[];
};

export type UseSortingReturn = {
  sortedData: TableDataRow[];
  sortConfig: SortConfig | null;
  handleSort: (columnKey: string) => void;
  isColumnSorted: (columnKey: string) => boolean;
  getSortDirection: (columnKey: string) => "asc" | "desc" | null;
  updateSelectedRangesForSorting: (
    selectedRanges: CellCoord[][],
    oldData: TableDataRow[],
    newData: TableDataRow[]
  ) => CellCoord[][];
  sortedToOriginalMapping: Map<number, number>;
  convertSortedCoordsToOriginal: (sortedCoords: CellCoord[]) => CellCoord[];
};

export function useSorting({
  data,
  columns,
}: UseSortingProps): UseSortingReturn {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = useCallback(
    (columnKey: string) => {
      const column = columns.find((col) => col.key === columnKey);

      if (!column) {
        return;
      }

      if (!column.disableSelection || !column.sorting) {
        return;
      }

      setSortConfig((prevConfig) => {
        const currentDirection =
          prevConfig?.columnKey === columnKey ? prevConfig.direction : null;

        const nextDirection = getNextSortDirection(currentDirection);

        if (nextDirection === null) {
          return null;
        }

        return {
          columnKey,
          direction: nextDirection,
        };
      });
    },
    [columns]
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data;
    }

    return sortTableData(data, sortConfig.columnKey, sortConfig.direction);
  }, [data, sortConfig]);

  const sortedToOriginalMapping = useMemo(() => {
    if (!sortConfig) {
      const mapping = new Map<number, number>();

      data.forEach((_, index) => mapping.set(index, index));

      return mapping;
    }

    return createSortedToOriginalMapping(data, sortedData);
  }, [data, sortedData, sortConfig]);

  const isColumnSorted = useCallback(
    (columnKey: string) => {
      return sortConfig?.columnKey === columnKey;
    },
    [sortConfig]
  );

  const getSortDirection = useCallback(
    (columnKey: string) => {
      if (sortConfig?.columnKey === columnKey) {
        return sortConfig.direction;
      }

      return null;
    },
    [sortConfig]
  );

  const updateSelectedRangesForSorting = useCallback(
    (
      selectedRanges: CellCoord[][],
      oldData: TableDataRow[],
      newData: TableDataRow[]
    ) => {
      return updateCellCoordsForSorting(selectedRanges, oldData, newData);
    },
    []
  );

  const convertSortedCoordsToOriginalCallback = useCallback(
    (sortedCoords: CellCoord[]) => {
      return convertSortedCoordsToOriginal(
        sortedCoords,
        sortedToOriginalMapping
      );
    },
    [sortedToOriginalMapping]
  );

  return {
    sortedData,
    sortConfig,
    handleSort,
    isColumnSorted,
    getSortDirection,
    updateSelectedRangesForSorting,
    sortedToOriginalMapping,
    convertSortedCoordsToOriginal: convertSortedCoordsToOriginalCallback,
  };
}

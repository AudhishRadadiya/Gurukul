import { useMemo } from "react";
import type { Column } from "../utils";

type ParsedColumn = Column & {
  idx: number;
  parsedMinWidth: number;
};

type UseStickyColumnsResult = {
  parsedColumns: ParsedColumn[];
  stickyMap: Map<number, number>;
};

const parseMinWidth = (minWidth: number | string | undefined): number => {
  if (typeof minWidth === "number") {
    return minWidth;
  }

  const cleaned = parseInt((minWidth ?? "36").replace("px", ""), 10);

  return isNaN(cleaned) ? 36 : cleaned;
};

export const useStickyColumns = (columns: Column[]): UseStickyColumnsResult => {
  return useMemo(() => {
    const stickyMap = new Map<number, number>();

    const parsedColumns: ParsedColumn[] = [];

    let runningOffset = 0;

    columns.forEach((col, idx) => {
      const parsedMinWidth = parseMinWidth(col.minWidth);

      const parsedCol = { ...col, idx, parsedMinWidth };

      parsedColumns.push(parsedCol);

      if (col.lockPinned) {
        stickyMap.set(idx, runningOffset);
        runningOffset += parsedMinWidth;
      }
    });

    return { parsedColumns, stickyMap };
  }, [columns]);
};

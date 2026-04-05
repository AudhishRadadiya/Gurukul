import { useTheme } from "@mui/material";
import { type Cell } from "@tanstack/react-table";
import { useCallback, type CSSProperties } from "react";

export const useGetPinStyle = <T>() => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const getPinStyle = useCallback(
    (
      cell: Cell<T, unknown>,
      cellIndex: number,
      allCells: Cell<T, unknown>[]
    ): CSSProperties => {
      const isPinned = cell.column.getIsPinned();

      if (isPinned === "left") {
        const nextCell = allCells[cellIndex + 1];

        const isLastLeft =
          !nextCell || nextCell.column.getIsPinned() !== "left";

        return {
          left: cell.column.getStart("left"),
          position: "sticky",
          zIndex: 2,
          ...(isLastLeft ? { borderRight: `1px solid ${iron[700]}` } : {}),
        };
      }

      if (isPinned === "right") {
        const prevCell = allCells[cellIndex - 1];

        const isFirstRight =
          !prevCell || prevCell.column.getIsPinned() !== "right";

        return {
          position: "sticky",
          right: cell.column.getAfter("right"),
          zIndex: 2,
          ...(isFirstRight ? { borderLeft: `1px solid ${iron[700]}` } : {}),
        };
      }

      // no pin style
      return {};
    },
    [iron]
  );

  return getPinStyle;
};

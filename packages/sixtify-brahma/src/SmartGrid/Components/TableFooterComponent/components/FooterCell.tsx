import { useTheme } from "@mui/material";
import type { Column } from "@tanstack/react-table";
import type { CSSProperties } from "react";

type FooterCellProps<T> = {
  col: Column<T, unknown>;
  colIndex: number;
  orderedColumns: Column<T, unknown>[];
  summaryValue?: { style?: React.CSSProperties; value?: React.ReactNode };
};

export function FooterCell<T>({
  col,
  colIndex,
  orderedColumns,
  summaryValue,
}: Readonly<FooterCellProps<T>>) {
  const theme = useTheme();

  const { iron, slate } = theme.palette.app.color;

  const isPinned = col.getIsPinned();

  // Apply pinning styles (same logic as TableRowComponent)
  const pinStyle: CSSProperties = {};

  if (isPinned === "left") {
    const nextCol = orderedColumns[colIndex + 1];

    const isLastLeft = !nextCol || nextCol.getIsPinned() !== "left";

    pinStyle.position = "sticky";
    pinStyle.left = col.getStart("left");
    pinStyle.zIndex = 2;
    pinStyle.background = slate[600];

    if (isLastLeft) {
      pinStyle.borderRight = `1px solid ${iron[700]}`;
    }
  }

  if (isPinned === "right") {
    const prevCol = orderedColumns[colIndex - 1];

    const isFirstRight = !prevCol || prevCol.getIsPinned() !== "right";

    pinStyle.position = "sticky";
    pinStyle.right = col.getAfter("right");
    pinStyle.zIndex = 2;
    pinStyle.background = slate[600];

    if (isFirstRight) {
      pinStyle.borderLeft = `1px solid ${iron[700]}`;
    }
  }

  return (
    <td
      key={`footer-${col.id}`}
      style={{
        background: "#F8F9FA",
        borderTop: `1px solid ${iron[700]}`,
        fontWeight: 500,
        padding: "8px",
        ...pinStyle,
        ...summaryValue?.style,
      }}
    >
      {summaryValue?.value ?? null}
    </td>
  );
}

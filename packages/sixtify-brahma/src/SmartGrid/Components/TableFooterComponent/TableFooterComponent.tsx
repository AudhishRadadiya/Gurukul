import { useTheme } from "@mui/material";
import type { Table } from "@tanstack/react-table";

import { FooterCell } from "./components/FooterCell";

type TableFooterProps<T> = {
  summary?: Partial<
    Record<keyof T, { style?: React.CSSProperties; value?: React.ReactNode }>
  >;
  table: Table<T>;
};

export function TableFooterComponent<T>({
  summary,
  table,
}: Readonly<TableFooterProps<T>>) {
  const theme = useTheme();

  const allColumns = table.getVisibleLeafColumns();

  const leftPinnedColumns = allColumns.filter(
    (col) => col.getIsPinned() === "left"
  );

  const centerColumns = allColumns.filter((col) => !col.getIsPinned());

  const rightPinnedColumns = allColumns.filter(
    (col) => col.getIsPinned() === "right"
  );

  const orderedColumns = [
    ...leftPinnedColumns,
    ...centerColumns,
    ...rightPinnedColumns,
  ];

  return (
    <tfoot
      style={{
        background: theme.palette.background.paper,
        bottom: 0,
        position: "sticky",
        zIndex: 2,
      }}
    >
      <tr>
        {orderedColumns.map((col, index) => {
          const key = col.id as keyof T;

          const summaryValue = summary?.[key];

          return (
            <FooterCell
              key={`footer-${col.id}`}
              col={col}
              colIndex={index}
              orderedColumns={orderedColumns}
              summaryValue={summaryValue}
            />
          );
        })}
      </tr>
    </tfoot>
  );
}

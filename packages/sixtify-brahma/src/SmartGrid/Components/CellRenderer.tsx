/* eslint-disable sonarjs/function-return-type */
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import type { Cell, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import type { SummaryRecord } from "../types";

type CellRendererProps<T> = {
  cell: Cell<T, unknown>;
  isSummaryRow: boolean;
  row: Row<T>;
  summaryData?: SummaryRecord<T>;
};

export const CellRenderer = <T,>({
  cell,
  isSummaryRow,
  row,
  summaryData,
}: CellRendererProps<T>) => {
  const renderSummaryCell = (cell: Cell<T, unknown>) => {
    const columnId = cell.column.id;

    const summaryValue = summaryData?.[columnId as keyof typeof summaryData];

    if (summaryValue) {
      return <div style={summaryValue.style}>{summaryValue.value}</div>;
    }

    if (cell.getIsGrouped()) {
      return "Total";
    }

    return null;
  };

  const renderGroupedHeaderCell = (cell: Cell<T, unknown>) => {
    if (!cell.getIsGrouped()) {
      return null;
    }

    return (
      <Button
        variant="text"
        onClick={row.getToggleExpandedHandler()}
        startIcon={
          row.getIsExpanded() ? (
            <ExpandMore color="primary" />
          ) : (
            <ChevronRight color="primary" />
          )
        }
        sx={{ textTransform: "none" }}
      >
        <Typography fontSize="14px">
          {String(row.getGroupingValue(row.groupingColumnId ?? "") ?? "")}
        </Typography>
        <Typography fontSize="14px">({row.subRows.length})</Typography>
      </Button>
    );
  };

  // Handle summary rows
  if (isSummaryRow) {
    return renderSummaryCell(cell);
  }

  // Regular row rendering
  // If this is a grouped header row, hide all non-grouping cells explicitly
  // to avoid TanStack's auto-aggregated values appearing in the header row.
  if (row.getIsGrouped() && !cell.getIsGrouped()) {
    return null;
  }

  if (cell.getIsGrouped()) {
    return renderGroupedHeaderCell(cell);
  }

  if (cell.getIsAggregated()) {
    // Only render if a custom aggregatedCell is explicitly provided.
    // This avoids TanStack's default numeric aggregation display for grouped rows.
    if (cell.column.columnDef.aggregatedCell) {
      return flexRender(
        cell.column.columnDef.aggregatedCell,
        cell.getContext()
      );
    }

    return null;
  }

  if (cell.getIsPlaceholder()) {
    return null;
  }

  return flexRender(cell.column.columnDef.cell, cell.getContext());
};

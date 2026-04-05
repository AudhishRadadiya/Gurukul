import { useTheme } from "@mui/material";
import type { Header } from "@tanstack/react-table";

import type { AppColumnDef } from "../../types";
import { GetRenderInputs } from "./GetRenderInputs";

type SearchFilterRowProps<T> = {
  header: Header<T, unknown>;
  resetAllFilters: boolean;
};

export const SearchFilterRow = <T,>({
  header,
  resetAllFilters,
}: SearchFilterRowProps<T>) => {
  const theme = useTheme();

  const { iron, slate } = theme.palette.app.color;

  const headerDyanmicWidth = header.column.getIsPinned()
    ? header.getSize() - 8
    : header.getSize();

  const columnDef = header.column.columnDef as AppColumnDef<T>;

  const filterVariant = columnDef.filterVariant;

  return (
    <th
      style={{
        backgroundColor: `${slate[800]}`,
        borderBottom: `1px solid ${iron[700]}`,
        height: "40px",
        left:
          header.column.getIsPinned() === "left"
            ? `${header.column.getStart("left")}px`
            : undefined,
        maxWidth: headerDyanmicWidth,
        minWidth: headerDyanmicWidth,
        padding: "0px 8px 0px 8px",
        position: header.column.getIsPinned() ? "sticky" : "relative",
        right:
          header.column.getIsPinned() === "right"
            ? `${header.column.getAfter("right")}px`
            : undefined,
        textAlign: "left",
        width: headerDyanmicWidth,
        zIndex: header.column.getIsPinned() ? 3 : 0,
      }}
    >
      {filterVariant ? (
        <GetRenderInputs
          filterVariant={filterVariant}
          header={header}
          resetAllFilters={resetAllFilters}
        />
      ) : (
        "-"
      )}
    </th>
  );
};

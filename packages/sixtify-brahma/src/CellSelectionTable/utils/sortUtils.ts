import type { TableDataRow } from "../CellSelectionTable";

export type SortDirection = "asc" | "desc" | null;

export type SortConfig = {
  columnKey: string;
  direction: SortDirection;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export function extractSortValue(
  cell: string | { cellLabel: string } | boolean | undefined
): string {
  if (typeof cell === "string") {
    if (cell.trim() === "") {
      return "";
    }

    const numValue = parseFloat(cell);

    if (!isNaN(numValue) && isFinite(numValue)) {
      return String(numValue);
    }

    return cell.toLowerCase();
  }

  if (typeof cell === "boolean") {
    return cell ? "1" : "0";
  }

  if (cell && typeof cell === "object" && "cellLabel" in cell) {
    const label = cell.cellLabel;

    if (typeof label === "string") {
      if (label.trim() === "") {
        return "";
      }

      const numValue = parseFloat(label);

      if (!isNaN(numValue) && isFinite(numValue)) {
        return String(numValue);
      }

      return label.toLowerCase();
    }
  }

  return "";
}

export function sortTableData(
  data: TableDataRow[],
  columnKey: string,
  direction: SortDirection
): TableDataRow[] {
  if (!direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = extractSortValue(a[columnKey]);

    const bValue = extractSortValue(b[columnKey]);

    if (aValue === "" && bValue === "") {
      return 0;
    }

    if (aValue === "") {
      return direction === "asc" ? 1 : -1;
    }

    if (bValue === "") {
      return direction === "asc" ? -1 : 1;
    }

    const aNum = parseFloat(aValue);

    const bNum = parseFloat(bValue);

    if (!isNaN(aNum) && !isNaN(bNum) && isFinite(aNum) && isFinite(bNum)) {
      return direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aValue);

    const bStr = String(bValue);

    if (direction === "asc") {
      return aStr.localeCompare(bStr);
    }

    return bStr.localeCompare(aStr);
  });
}

export function getNextSortDirection(
  currentDirection: SortDirection
): SortDirection {
  switch (currentDirection) {
    case null:
      return "asc";

    case "asc":
      return "desc";

    case "desc":
      return null;

    default:
      return "asc";
  }
}

export function isSortingEnabled(
  disableSelection?: boolean,
  sorting?: boolean
): boolean {
  return Boolean(disableSelection && sorting);
}

export function isSelectionDisabled(
  disableSelection?: boolean,
  sorting?: boolean
): boolean {
  return Boolean(disableSelection || sorting);
}

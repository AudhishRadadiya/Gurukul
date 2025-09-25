import _keyBy from "lodash/keyBy";
import _omit from "lodash/omit";
import _range from "lodash/range";
import _some from "lodash/some";
import _uniqBy from "lodash/uniqBy";
import _values from "lodash/values";
import type { Cell } from "../CellSelectionTable";
import type {
  CellCoord,
  HandleContextMenuArgs,
  HandleMouseDownArgs,
  HandleMouseEnterArgs,
  HandleMouseUpArgs,
  SelectionRecord,
} from "./types";

const cellKey = ({ row, col }: CellCoord) => `${row}:${col}`;

function rangeCoords(a: number, b: number): number[] {
  return _range(Math.min(a, b), Math.max(a, b) + 1);
}

function getRangeCells(a: CellCoord, b: CellCoord): CellCoord[] {
  const rows = rangeCoords(a.row, b.row);

  const cols = rangeCoords(a.col, b.col);

  return rows.flatMap((row) => cols.map((col) => ({ row, col })));
}

function arrayToRecord(cells: CellCoord[]): SelectionRecord {
  return _keyBy(cells, cellKey);
}

function recordToArray(rec: SelectionRecord): CellCoord[] {
  return _values(rec);
}

export function handleMouseDown({
  e,
  ri,
  ci,
  selectingRef,
  anchorRef,
  selectedRanges,
  selectionModeRef,
}: HandleMouseDownArgs) {
  if (e.button === 2) {
    return;
  }

  const start = { row: ri, col: ci };

  const additive = e.ctrlKey || e.metaKey;

  selectingRef.current = true;
  anchorRef.current = start;

  const key = cellKey(start);

  const isAlreadySelected = _some(
    selectedRanges.flat(),
    (c) => cellKey(c) === key
  );

  if (additive) {
    selectionModeRef.current = isAlreadySelected ? "remove" : "add";
  } else {
    selectionModeRef.current = "replace";
  }
}

export function handleMouseEnter({
  anchorRef,
  hoveringRef,
  ri,
  ci,
  setSelectedRanges,
  selectionModeRef,
  setCurrentSelectedRanges,
  columns,
  data,
}: HandleMouseEnterArgs) {
  if (anchorRef.current === null) {
    return;
  }

  const end = { row: ri, col: ci };

  hoveringRef.current = end;

  const rawDraggedCells = getRangeCells(anchorRef.current, end);

  const draggedCells =
    data.some((row) => row?.rowDisabled) ||
    columns.some((col) => col?.disableSelection)
      ? rawDraggedCells.filter(
          (cell) =>
            !data[cell.row]?.rowDisabled && !columns[cell.col]?.disableSelection
        )
      : rawDraggedCells;

  if (!draggedCells.length) {
    setCurrentSelectedRanges([]);

    return;
  }

  const mode = selectionModeRef.current;

  if (mode === "replace") {
    setSelectedRanges([draggedCells]);

    return;
  }

  if (mode === "remove") {
    const toRemove = new Set(draggedCells.map(cellKey));

    setSelectedRanges((prev) =>
      prev
        .map((group) => group.filter((cell) => !toRemove.has(cellKey(cell))))
        .filter((group) => group.length)
    );

    return;
  }

  if (mode === "add") {
    setCurrentSelectedRanges([draggedCells]);
  }
}

export function handleMouseUp({
  e,
  ri,
  ci,
  selectingRef,
  anchorRef,
  hoveringRef,
  setSelectedRanges,
  selectionModeRef,
  setCurrentSelectedRanges,
  columns,
  data,
}: HandleMouseUpArgs) {
  if (!selectionModeRef.current || !anchorRef.current) {
    return;
  }

  const end = { row: ri, col: ci };

  const additive = e.ctrlKey || e.metaKey;

  const mode = selectionModeRef.current;

  const rawDraggedCells = getRangeCells(anchorRef.current, end);

  const draggedCells =
    data.some((row) => row?.rowDisabled) ||
    columns.some((col) => col?.disableSelection)
      ? rawDraggedCells.filter(
          (cell) =>
            !data[cell.row]?.rowDisabled && !columns[cell.col]?.disableSelection
        )
      : rawDraggedCells;

  selectingRef.current = false;
  anchorRef.current = null;
  hoveringRef.current = null;

  setSelectedRanges((prev) => {
    if (mode === "replace") {
      return [draggedCells];
    }

    if (mode === "remove") {
      const toRemove = new Set(draggedCells.map(cellKey));

      return prev
        .map((group) => group.filter((cell) => !toRemove.has(cellKey(cell))))
        .filter((group) => group.length);
    }

    if (mode === "add") {
      return additive ? [...prev, draggedCells] : [draggedCells];
    }

    return prev;
  });

  setCurrentSelectedRanges([]);
}

export function handleContextMenu({
  e,
  ri,
  ci,
  setSelectedRanges,
  onCellSelection,
  selectedRanges,
}: HandleContextMenuArgs) {
  e.preventDefault();

  const clicked = { row: ri, col: ci };

  const keyClicked = cellKey(clicked);

  const additive = e.button === 2;

  const additiveCtrl = e.ctrlKey || e.metaKey;

  const allSelectedCells = selectedRanges.flat();

  const alreadySelected = _some(
    allSelectedCells,
    (c) => cellKey(c) === keyClicked
  );

  const baseRec = arrayToRecord(allSelectedCells);

  const newRec = (() => {
    if (additiveCtrl || additive) {
      if (!additive && alreadySelected) {
        return _omit(baseRec, keyClicked);
      }

      if (clicked && alreadySelected) {
        return { ...baseRec, [keyClicked]: clicked };
      }
    }

    return { [keyClicked]: clicked };
  })();

  const newSelection = recordToArray(newRec);

  if (newSelection.length > 0) {
    setSelectedRanges([newSelection]);

    const newSelectedData = _uniqBy(newSelection, cellKey);

    if (onCellSelection) {
      onCellSelection({ selectedCells: newSelectedData }, e);
    }
  }
}

export const getCellValue = (
  cell: string | Cell | boolean | undefined,
  key: string
): string => {
  if (typeof cell === "string") {
    return cell;
  }

  if (cell && typeof cell === "object") {
    const value = cell[key];

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return value.toString();
    }

    if (value === true) {
      return "active";
    }
  }

  return "";
};

import type { TableCellProps } from "@mui/material";
import type { Dictionary } from "lodash";
import type {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
} from "react";
import type { TableDataRow } from "../CellSelectionTable";

export type Column = {
  key: string;
  label: string;
  isEmployee?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: TableCellProps["align"];
  disableSelection?: boolean;
  lockSelection?: boolean;
  sorting?: boolean;
  lockPinned?: boolean;
  colorKey?: string;
};

export type OptionsType = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type CellCoord = { row: number; col: number };

export type EmployeeCellCoord = {
  employeeId: string;
  col: number;
  originalRow?: number;
};

export type SelectionRange = { start: CellCoord; end: CellCoord };

export type SelectionMode = "add" | "remove" | "replace" | "move";

export type SelectionRecord = Record<string, CellCoord>;

export type HandleMouseEnterArgs = {
  e: MouseEvent<HTMLTableCellElement>;
  selectingRef: MutableRefObject<boolean>;
  anchorRef: MutableRefObject<CellCoord | null>;
  hoveringRef: MutableRefObject<CellCoord | null>;
  ri: number;
  ci: number;
  selectedRanges: CellCoord[][];
  setSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  selectionModeRef: MutableRefObject<SelectionMode>;
  currentSelectedRanges: CellCoord[][];
  setCurrentSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  columns: Column[];
  data: TableDataRow[];
};

export type HandleMouseDownArgs = {
  e: MouseEvent<HTMLTableCellElement>;
  ri: number;
  ci: number;
  selectingRef: MutableRefObject<boolean>;
  anchorRef: MutableRefObject<CellCoord | null>;
  selectedRanges: CellCoord[][];
  setSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  selectionModeRef: MutableRefObject<SelectionMode>;
};

export type HandleMouseUpArgs = {
  e: MouseEvent<HTMLTableCellElement>;
  ri: number;
  ci: number;
  selectingRef: MutableRefObject<boolean>;
  anchorRef: MutableRefObject<CellCoord | null>;
  hoveringRef: MutableRefObject<CellCoord | null>;
  setSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  selectionModeRef: MutableRefObject<SelectionMode>;
  setCurrentSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  columns: Column[];
  data: TableDataRow[];
};

export type HandleMouseMoveArgs = {
  e: MouseEvent<HTMLTableCellElement>;
  ri: number;
  ci: number;
  selectingRef: MutableRefObject<boolean>;
  anchorRef: MutableRefObject<CellCoord | null>;
  hoveringRef: MutableRefObject<CellCoord | null>;
  setSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  selectionModeRef: MutableRefObject<SelectionMode>;
};

export type HandleContextMenuArgs = {
  e: MouseEvent<HTMLTableCellElement>;
  ri: number;
  ci: number;
  selectedRanges: CellCoord[][];
  setSelectedRanges: Dispatch<SetStateAction<CellCoord[][]>>;
  onCellSelection: (
    ranges: Dictionary<CellCoord[]>,
    e: MouseEvent<HTMLTableCellElement>
  ) => void;
};

export type GetCellColorArgs = {
  cellKey?: string;
  isSelected: boolean;
  colorKey?: string;
};

export type ModifyCellObj = {
  cellActive?: boolean;
  cellBackgroundConditionKey?: string;
  cellLabel: string;
  cellTooltip?: string;
};

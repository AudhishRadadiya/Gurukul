"use client";

import {
  Box,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import type { Dictionary } from "lodash";
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tooltip } from "../Tooltip";
import { useStickyColumns } from "./hook/useStickyColumns";
import { EmployeeCell } from "./SubComponents/EmployeeCell";
import { TableBodyLoader } from "./SubComponents/TableBodyLoader";
import {
  getCellValue,
  handleContextMenu,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
} from "./utils/helper";
import type {
  CellCoord,
  Column,
  GetCellColorArgs,
  SelectionMode,
} from "./utils/types";

export type Cell = {
  cellLabel: string;
} & {
  [key: string]: ReactNode;
};

export type TableDataRow = Record<string, string | Cell | boolean>;

export type CellSelectionTableProps = {
  columns: Column[];
  data: TableDataRow[];
  onCellSelection: (
    selectedCells: Dictionary<CellCoord[]>,
    e: MouseEvent
  ) => void;
  cellColors?: (status: string) => string;
  height?: string | number;
  loading?: boolean;
  getCellTextColor?: (status: string) => string;
};

export const CellSelectionTable = ({
  columns,
  data,
  onCellSelection,
  cellColors,
  height,
  loading = false,
  getCellTextColor = () => "",
}: Readonly<CellSelectionTableProps>) => {
  const theme = useTheme();

  const { slate, iron, butterflyBlue } = theme.palette.app.color;

  const selectingRef = useRef(false);

  const selectionModeRef = useRef<SelectionMode>("add");

  const anchorRef = useRef<CellCoord | null>(null);

  const hoveringRef = useRef<CellCoord | null>(null);

  const [selectedRanges, setSelectedRanges] = useState<CellCoord[][]>([]);

  const [currentSelectedRanges, setCurrentSelectedRanges] = useState<
    CellCoord[][]
  >([]);

  const { stickyMap } = useStickyColumns(columns);

  const isSelectedCell = (rowIndex: number, colIndex: number): boolean => {
    if (selectedRanges.length === 0 && currentSelectedRanges.length === 0) {
      return false;
    }

    return [...selectedRanges, ...currentSelectedRanges].some((range) =>
      range.some((cell) => cell.row === rowIndex && cell.col === colIndex)
    );
  };

  const memoizedData = useMemo(() => {
    return data.map((row) => {
      const normalizedRow: TableDataRow = {};

      for (const key in row) {
        const value = row[key];

        if (typeof value === "string") {
          if (value.toLowerCase() === "true") {
            normalizedRow[key] = true;
          } else if (value.toLowerCase() === "false") {
            normalizedRow[key] = false;
          } else {
            normalizedRow[key] = value;
          }
        } else if (typeof value === "boolean" || typeof value === "object") {
          normalizedRow[key] = value;
        }
      }

      return normalizedRow;
    });
  }, [data]);

  function getCellColor({
    cellKey,
    isSelected = false,
  }: GetCellColorArgs): string {
    if (isSelected) {
      return butterflyBlue[800];
    }

    if (!isSelected && cellKey && cellColors) {
      return cellColors(cellKey);
    }

    return iron[600];
  }

  const handleCellMouseDown = useCallback(
    (ri: number, ci: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      if (columns[ci]?.disableSelection) {
        const nextSelectableIndex = columns.findIndex(
          (col, index) => !col.disableSelection && index > ci
        );

        if (nextSelectableIndex !== -1) {
          return handleMouseDown({
            e,
            ri,
            ci: nextSelectableIndex,
            selectingRef,
            anchorRef,
            selectedRanges,
            setSelectedRanges,
            selectionModeRef,
          });
        }

        const fallbackIndex = [...columns]
          .reverse()
          .findIndex(
            (col, index) =>
              !col.disableSelection && columns.length - 1 - index < ci
          );

        if (fallbackIndex !== -1) {
          const adjustedIndex = columns.length - 1 - fallbackIndex;

          return handleMouseDown({
            e,
            ri,
            ci: adjustedIndex,
            selectingRef,
            anchorRef,
            selectedRanges,
            setSelectedRanges,
            selectionModeRef,
          });
        }

        return;
      }

      handleMouseDown({
        e,
        ri,
        ci,
        selectingRef,
        anchorRef,
        selectedRanges,
        setSelectedRanges,
        selectionModeRef,
      });
    },
    [selectedRanges]
  );

  const handleCellMouseEnter = useCallback(
    (ri: number, ci: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      handleMouseEnter({
        e,
        selectingRef,
        anchorRef,
        hoveringRef,
        ri,
        ci,
        selectedRanges,
        setSelectedRanges,
        selectionModeRef,
        currentSelectedRanges,
        setCurrentSelectedRanges,
        columns,
        data: memoizedData,
      });
    },
    [
      handleMouseEnter,
      selectingRef,
      anchorRef,
      hoveringRef,
      setSelectedRanges,
      selectionModeRef,
      memoizedData,
      columns,
    ]
  );

  const handleCellMouseUp = useCallback(
    (ri: number, ci: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      handleMouseUp({
        e,
        selectingRef,
        anchorRef,
        hoveringRef,
        ri,
        ci,
        setSelectedRanges,
        selectionModeRef,
        setCurrentSelectedRanges,
        data: memoizedData,
        columns,
      });
    },
    [memoizedData, columns]
  );

  const handleContextMenuCallback = useCallback(
    (ri: number, ci: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      handleContextMenu({
        e,
        ri,
        ci,
        selectedRanges,
        setSelectedRanges,
        onCellSelection,
      });
    },
    [onCellSelection, selectedRanges]
  );

  return (
    <Box
      position="relative"
      overflow="auto"
      height={height}
      bgcolor={iron[600]}
    >
      <Table
        stickyHeader
        sx={{
          borderCollapse: "separate",
          borderSpacing: 0,
          "& th, & td": {
            borderRight: `1px solid ${slate[700]}`,
            borderBottom: `1px solid ${slate[700]}`,
            height: "40px",
          },
          "& th": {
            padding: "2px 5px",
          },
          "& td": {
            padding: "0px 5px",
          },
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map(
              (
                {
                  key,
                  label,
                  minWidth = "auto",
                  lockPinned = false,
                  align = "left",
                },
                ci
              ) => {
                const isSticky = stickyMap.has(ci);

                const left = isSticky ? stickyMap.get(ci) : 0;

                return (
                  <TableCell
                    key={key}
                    align={align}
                    sx={{
                      ...(lockPinned && {
                        top: 0,
                        left,
                        zIndex: 10,
                        position: "sticky",
                      }),
                      backgroundColor: slate[700],
                      minWidth,
                      padding: "5px 10px",
                    }}
                  >
                    <Typography variant="subtitle2" lineHeight="18px">
                      {label}
                    </Typography>
                  </TableCell>
                );
              }
            )}
          </TableRow>
        </TableHead>

        {loading ? (
          <TableBodyLoader columns={columns} rowCount={25} />
        ) : (
          <TableBody>
            {memoizedData.map((row, ri) => (
              <TableRow
                key={typeof row.id === "string" ? row.id : ""}
                sx={{ backgroundColor: iron[600] }}
              >
                {columns.map(
                  (
                    {
                      key,
                      maxWidth = "auto",
                      minWidth = "auto",
                      isEmployee,
                      align = "center",
                      lockPinned = false,
                    },
                    ci
                  ) => {
                    const cell = row[key];

                    const getRowTitle = getCellValue(cell, "cellLabel");

                    const tooltip =
                      typeof cell === "object" &&
                      cell != null &&
                      typeof cell?.["cellTooltip"] === "object"
                        ? cell["cellTooltip"]
                        : getCellValue(cell, "cellTooltip");

                    const getColor = getCellValue(
                      cell,
                      "cellBackgroundConditionKey"
                    );

                    const cellActive = getCellValue(cell, "cellActive");

                    const isSticky = stickyMap.has(ci);

                    const left = isSticky ? stickyMap.get(ci) : 0;

                    const content = isEmployee ? (
                      <EmployeeCell
                        row={row}
                        maxWidth={maxWidth}
                        minWidth={minWidth}
                      />
                    ) : (
                      <Typography variant="body2">{getRowTitle}</Typography>
                    );

                    const isNotDisabled = !(
                      columns[ci]?.disableSelection || row?.rowDisabled
                    );

                    return (
                      <TableCell
                        key={key}
                        align={align}
                        sx={{
                          ...(lockPinned && {
                            top: 0,
                            left,
                            zIndex: 5,
                            position: "sticky",
                          }),
                          ...(isNotDisabled
                            ? {}
                            : {
                                cursor: "not-allowed",
                              }),
                          userSelect: "none",
                          overflow: "hidden",
                          bgcolor: lighten(
                            getCellColor({
                              cellKey: getColor,
                              isSelected: isSelectedCell(ri, ci),
                            }),
                            0.8
                          ),
                          ...(cellActive &&
                            ci > 0 && { color: getCellTextColor(cellActive) }),
                          padding: "5px 10px",
                          cursor: "pointer",
                          maxWidth,
                          minWidth,
                        }}
                        onMouseDown={(e) => handleCellMouseDown(ri, ci)(e)}
                        onMouseEnter={
                          isNotDisabled
                            ? handleCellMouseEnter(ri, ci)
                            : undefined
                        }
                        onMouseUp={(e) => handleCellMouseUp(ri, ci)(e)}
                        onContextMenu={
                          isNotDisabled
                            ? handleContextMenuCallback(ri, ci)
                            : undefined
                        }
                      >
                        {tooltip ? (
                          <Tooltip toolTipLabel={tooltip}>{content}</Tooltip>
                        ) : (
                          content
                        )}
                      </TableCell>
                    );
                  }
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </Box>
  );
};

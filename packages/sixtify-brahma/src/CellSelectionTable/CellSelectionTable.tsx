"use client";

import {
  ArrowDownward,
  ArrowUpward,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
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
  forwardRef,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOutsideClick } from "./hook/useOutsideClick";
import { useSorting } from "./hook/useSorting";
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
import { isSelectionDisabled } from "./utils/sortUtils";
import type {
  CellCoord,
  Column,
  GetCellColorArgs,
  SelectionMode,
} from "./utils/types";
import { Tooltip } from "../Tooltip";

export type Cell = {
  cellLabel: string;
} & {
  [key: string]: ReactNode;
};

export type TableDataRow = Record<string, string | Cell | boolean>;

export type CellSelectionTableRef = {
  updateData: (sortedCoords: CellCoord[]) => void;
  getSortedToOriginalMapping: () => Map<number, number>;
  convertSortedCoordsToOriginal: (sortedCoords: CellCoord[]) => CellCoord[];
  getUpdatedTableData: <T = TableDataRow>(
    sortedCoords: CellCoord[],
    updates: Record<string, string | Cell | boolean>
  ) => T[];
};

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
  onDataUpdate?: (
    sortedCoords: CellCoord[],
    originalCoords: CellCoord[],
    sortedData: TableDataRow[],
    originalData: TableDataRow[]
  ) => void;
};

export const CellSelectionTable = forwardRef<
  CellSelectionTableRef,
  CellSelectionTableProps
>(
  (
    {
      columns,
      data,
      onCellSelection,
      cellColors,
      height,
      loading = false,
      getCellTextColor = () => "",
      onDataUpdate,
    },
    ref
  ) => {
    const theme = useTheme();

    const { slate, iron, butterflyBlue } = theme.palette.app.color;

    const selectingRef = useRef(false);

    const tableRef = useRef<HTMLTableElement | null>(null);

    const selectionModeRef = useRef<SelectionMode>("add");

    const anchorRef = useRef<CellCoord | null>(null);

    const hoveringRef = useRef<CellCoord | null>(null);

    const [selectedRanges, setSelectedRanges] = useState<CellCoord[][]>([]);

    const [currentSelectedRanges, setCurrentSelectedRanges] = useState<
      CellCoord[][]
    >([]);

    useOutsideClick(tableRef, () => {
      setSelectedRanges([]);
      setCurrentSelectedRanges([]);
    });

    useMemo(() => {
      if (loading && selectedRanges.length > 0) {
        setSelectedRanges([]);
        setCurrentSelectedRanges([]);
      }
    }, [loading]);

    const isSelectedCell = (rowIndex: number, colIndex: number): boolean => {
      if (selectedRanges.length === 0 && currentSelectedRanges.length === 0) {
        return false;
      }

      return [...selectedRanges, ...currentSelectedRanges].some((range) =>
        range.some((cell) => cell.row === rowIndex && cell.col === colIndex)
      );
    };

    const { stickyMap } = useStickyColumns(columns);

    useOutsideClick(tableRef, () => {
      setSelectedRanges([]);
      setCurrentSelectedRanges([]);
    });

    useMemo(() => {
      if (loading && selectedRanges.length > 0) {
        setSelectedRanges([]);
        setCurrentSelectedRanges([]);
      }
    }, [loading]);

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

    const {
      sortedData,
      handleSort,
      getSortDirection,
      updateSelectedRangesForSorting,
      sortedToOriginalMapping,
      convertSortedCoordsToOriginal,
    } = useSorting({
      data: memoizedData,
      columns,
    });

    const prevSortedDataRef = useRef<TableDataRow[]>([]);

    const selectedRangesRef = useRef<CellCoord[][]>([]);

    // Keep track of the latest data for the ref methods
    const latestDataRef = useRef<TableDataRow[]>(memoizedData);

    // Update the latest data ref whenever memoizedData changes
    useEffect(() => {
      latestDataRef.current = memoizedData;
    }, [memoizedData]);

    // Function to get updated table data without setting state
    const getUpdatedTableData = useCallback(
      <T = TableDataRow,>(
        sortedCoords: CellCoord[],
        updates: Record<string, string | Cell | boolean>
      ) => {
        const originalCoords = convertSortedCoordsToOriginal(sortedCoords);

        // Use the latest data from ref, which is always up-to-date
        const updatedData = [...latestDataRef.current];

        originalCoords.forEach((coord, index) => {
          const sortedCoord = sortedCoords[index];

          if (sortedCoord && coord) {
            const columnKey = columns[coord.col]?.key;

            if (columnKey && updates[columnKey] !== undefined) {
              updatedData[coord.row] = {
                ...updatedData[coord.row],
                [columnKey]: updates[columnKey],
              };
            }
          }
        });

        return updatedData as T[];
      },
      [convertSortedCoordsToOriginal, columns]
    );

    const handleDataUpdate = useCallback(
      (sortedCoords: CellCoord[]) => {
        if (!onDataUpdate) {
          return;
        }

        const originalCoords = convertSortedCoordsToOriginal(sortedCoords);

        onDataUpdate(sortedCoords, originalCoords, sortedData, memoizedData);
      },
      [onDataUpdate, convertSortedCoordsToOriginal, sortedData, memoizedData]
    );

    useImperativeHandle(
      ref,
      () => ({
        updateData: handleDataUpdate,
        getSortedToOriginalMapping: () => sortedToOriginalMapping,
        convertSortedCoordsToOriginal,
        getUpdatedTableData,
      }),
      [
        handleDataUpdate,
        sortedToOriginalMapping,
        convertSortedCoordsToOriginal,
        getUpdatedTableData,
      ]
    );

    useEffect(() => {
      if (
        selectedRangesRef.current.length > 0 &&
        prevSortedDataRef.current.length > 0
      ) {
        // Check if the data has been reordered (sorting changed)
        const dataChanged =
          prevSortedDataRef.current.length !== sortedData.length ||
          prevSortedDataRef.current.some((row, index) => {
            const newRow = sortedData[index];

            const rowId = typeof row?.id === "string" ? row.id : `row-${index}`;

            const newRowId =
              typeof newRow?.id === "string" ? newRow.id : `row-${index}`;

            return !newRow || rowId !== newRowId;
          });

        if (dataChanged) {
          try {
            const updatedRanges = updateSelectedRangesForSorting(
              selectedRangesRef.current,
              prevSortedDataRef.current,
              sortedData
            );

            // Only update if the ranges actually changed and are valid
            const rangesChanged =
              updatedRanges.length !== selectedRangesRef.current.length ||
              updatedRanges.some((range, i) => {
                const oldRange = selectedRangesRef.current[i];

                return (
                  !oldRange ||
                  range.length !== oldRange.length ||
                  range.some(
                    (cell, j) =>
                      cell.row !== oldRange[j]?.row ||
                      cell.col !== oldRange[j]?.col
                  )
                );
              });

            const validRanges = updatedRanges.every((range) =>
              range.every(
                (cell) =>
                  cell.row >= 0 &&
                  cell.row < sortedData.length &&
                  cell.col >= 0 &&
                  cell.col < columns.length
              )
            );

            if (rangesChanged && validRanges) {
              setSelectedRanges(updatedRanges);
              selectedRangesRef.current = updatedRanges;
            }
            // eslint-disable-next-line sonarjs/no-ignored-exceptions
          } catch (error) {
            setSelectedRanges([]);
            selectedRangesRef.current = [];
          }
        }
      }

      prevSortedDataRef.current = sortedData;
    }, [sortedData, updateSelectedRangesForSorting, columns.length]);

    // Keep the ref in sync with the state
    useEffect(() => {
      selectedRangesRef.current = selectedRanges;
    }, [selectedRanges]);

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
        e.preventDefault();

        if (
          isSelectionDisabled(
            columns[ci]?.disableSelection,
            columns[ci]?.sorting
          ) &&
          ci > 0
        ) {
          const nextSelectableIndex = columns.findIndex(
            (col, index) =>
              !isSelectionDisabled(col.disableSelection, col.sorting) &&
              index > ci
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
                !isSelectionDisabled(col.disableSelection, col.sorting) &&
                columns.length - 1 - index < ci
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
          data: sortedData,
        });
      },
      [
        handleMouseEnter,
        selectingRef,
        anchorRef,
        hoveringRef,
        setSelectedRanges,
        selectionModeRef,
        sortedData,
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
          data: sortedData,
          columns,
        });
      },
      [sortedData, columns]
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
          ref={tableRef}
          stickyHeader
          sx={{
            userSelect: "none",
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
                    disableSelection,
                    sorting,
                  },
                  ci
                ) => {
                  const isSticky = stickyMap.has(ci);

                  const left = isSticky ? stickyMap.get(ci) : 0;

                  const sortDirection = getSortDirection(key);

                  const canSort = Boolean(disableSelection && sorting);

                  let justifyContent = "flex-start";

                  if (align === "center") {
                    justifyContent = "center";
                  } else if (align === "right") {
                    justifyContent = "flex-end";
                  }

                  const renderSortIcon = () => {
                    if (sortDirection === "asc") {
                      return (
                        <ArrowUpward
                          sx={{ fontSize: 16, color: butterflyBlue[400] }}
                        />
                      );
                    }

                    if (sortDirection === "desc") {
                      return (
                        <ArrowDownward
                          sx={{ fontSize: 16, color: butterflyBlue[400] }}
                        />
                      );
                    }

                    return (
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ opacity: 0.5 }}
                      >
                        <KeyboardArrowUp
                          sx={{ fontSize: 14, marginBottom: -0.5 }}
                        />

                        <KeyboardArrowDown sx={{ fontSize: 14 }} />
                      </Box>
                    );
                  };

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
                        cursor: canSort ? "pointer" : "default",
                      }}
                      onClick={canSort ? () => handleSort(key) : undefined}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={justifyContent}
                        gap={1}
                      >
                        <Typography variant="subtitle2" lineHeight="18px">
                          {label}
                        </Typography>
                        {canSort && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                          >
                            {renderSortIcon()}
                          </Box>
                        )}
                      </Box>
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
              {sortedData.map((row, ri) => (
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
                        isSelectionDisabled(
                          columns[ci]?.disableSelection,
                          columns[ci]?.sorting
                        ) || row?.rowDisabled
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
                              ci > 0 && {
                                color: getCellTextColor(cellActive),
                              }),
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
  }
);

CellSelectionTable.displayName = "CellSelectionTable";

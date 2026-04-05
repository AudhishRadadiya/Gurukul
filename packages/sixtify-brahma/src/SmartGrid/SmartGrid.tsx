import { closestCenter, DndContext } from "@dnd-kit/core";
import { useTheme } from "@mui/material";
import type { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Ref } from "react";
import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { CircularLoader } from "./Components/CircularLoader";
import { DataNotFound } from "./Components/DataNotFound";
import { FilterStatusPanel } from "./Components/FilterStatusPanel";
import { DraggableHeaderGroupRows } from "./Components/HeaderCells/DraggableHeaderGroupRows";
import { HeaderCell } from "./Components/HeaderCells/HeaderCell";
import { SearchFilterRow } from "./Components/SearchFilterRow/SearchFilterRow";
import { TableFooterComponent } from "./Components/TableFooterComponent/TableFooterComponent";
import { TableRowComponent } from "./Components/TableRowComponent";
import { CellSelectionProvider } from "./context/CellSelectionContext";
import { useCellSelection } from "./hooks/useCellSelection";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import { useGetColumnWidth } from "./hooks/useGetColumnWidth";
import { useGetDragMethods } from "./hooks/useGetDragMethods";
import { useGetRowSelection } from "./hooks/useGetRowSelection";
import { useTableState } from "./hooks/useTableState";
import type {
  AppColumnDef,
  SmartGridProps,
  SmartGridRef,
  SummaryRecord,
} from "./types";
import { calculateDynamicSummary } from "./utils/summaryCalculations";

const calculateGroupSummary = <T,>(
  groupRow: Row<T>,
  globalSummary?: SummaryRecord<T>,
  dynamicSummaryConfig?: SmartGridProps<T>["dynamicSummaryConfig"]
): SummaryRecord<T> => {
  const { subRows } = groupRow;

  if (dynamicSummaryConfig && subRows) {
    const dynamicSummary = calculateDynamicSummary(
      subRows,
      dynamicSummaryConfig
    );

    return dynamicSummary;
  }

  return globalSummary ? globalSummary : {};
};

type EnhancedRow<T> = {
  groupId?: string;
  isSummary?: boolean;
  row: Row<T>;
  summaryData?: SummaryRecord<T>;
};

type SmartGridType = React.ForwardRefExoticComponent<SmartGridProps<unknown>> &
  (<GenericType>(props: SmartGridProps<GenericType>) => JSX.Element);

export const SmartGrid = forwardRef(
  <T,>(
    {
      defaultGrouping = [],
      dynamicRowSelection = () => true,
      emptyMessage = "No data found",
      enableCellSelection = false,
      exportActions = [],
      exportData = false,
      height = "calc(100vh - 130px)",
      loading = false,
      rowHeight = 38,
      rowSelection = false,
      swipeableColumns = false,
      totalCount = 0,
      ...props
    }: SmartGridProps<T>,
    ref: Ref<SmartGridRef<T>>
  ) => {
    const theme = useTheme();

    const { butterflyBlue } = theme.palette.app.color;

    const [resetAllFilters, setResetAllFilters] = useState<boolean>(false);

    const containerRef = useRef<HTMLTableElement>(null);

    const headerRef = useRef<HTMLTableSectionElement>(null);

    const {
      columns: propsColumns,
      data,
      dynamicSummaryConfig,
      summary,
    } = props;

    const { columns } = useGetRowSelection<T>({
      defaultColumn: propsColumns,
      dynamicRowSelection,
      rowSelection,
    });

    const { table } = useTableState({
      ...props,
      columns,
      data,
      defaultGrouping,
      loading,
      totalCount,
    });

    const { getHeaderGroups, getRowModel, getSelectedRowModel } = table;

    const rows = getRowModel().rows;

    // Drag and drop Methoda
    const { handleDragEnd, isHeaderReorderable, sensors } = useGetDragMethods({
      swipeableColumns,
      table,
    });

    const cellSelection = useCellSelection({
      enabled: enableCellSelection,
      table,
    });

    const {
      clearCellSelection,
      endCellSelection,
      getCellSelectionData,
      selectionState,
      triggerCopyFlash,
    } = cellSelection;

    // Copy to clipboard functionality
    useCopyToClipboard({
      enabled: enableCellSelection,
      getCellSelectionData,
      hasSelection: selectionState.selectedCells.size > 0,
      triggerCopyFlash,
    });

    const enhancedRows: EnhancedRow<T>[] = useMemo(() => {
      const result: EnhancedRow<T>[] = [];

      const buildRows = (row: Row<T>) => {
        result.push({ groupId: row.id, row });

        const { getIsExpanded, getIsGrouped, subRows } = row;

        if (getIsGrouped()) {
          if (getIsExpanded() && subRows && subRows.length > 0) {
            subRows.forEach((sub) => buildRows(sub));
          }

          if ((summary || dynamicSummaryConfig) && getIsExpanded()) {
            const summaryData = calculateGroupSummary(
              row,
              summary,
              dynamicSummaryConfig
            );

            if (Object.keys(summaryData).length > 0) {
              result.push({
                groupId: `${row.id}-summary`,
                isSummary: true,
                row,
                summaryData,
              });
            }
          }
        }
      };

      const topLevelRows = rows.filter((r) => r.depth === 0);

      topLevelRows.forEach((r) => buildRows(r));

      return result;
    }, [rows, summary, dynamicSummaryConfig]);

    const rowVirtualizer = useVirtualizer({
      count: enhancedRows.length,
      estimateSize: () => rowHeight,
      getScrollElement: () => containerRef.current,
      overscan: 5,
    });

    const { columnWidths } = useGetColumnWidth<T>({
      columns: propsColumns,
      headerRef,
      table,
    });

    useImperativeHandle(
      ref,
      () => ({
        clearCellSelection,
        getCellSelectionData,
        getSelectedRows: () =>
          getSelectedRowModel().rows.map((row) => row.original),
        getTable: () => table,
      }),
      [table, cellSelection]
    );

    const enableSecondRowFilter: boolean = useMemo(() => {
      return getHeaderGroups().some((headerGroup) =>
        headerGroup.headers.some((header) => {
          const columnDef = header.column.columnDef as AppColumnDef<T>;

          const hasFilterVariant = !!columnDef.filterVariant;

          const hasFacetedFilter = !!columnDef.facetedFilter;

          const isCombinedFilter = hasFacetedFilter && hasFilterVariant;

          // Show second row if there's a filter variant (including combined filters) or standalone faceted filter
          return hasFilterVariant || (hasFacetedFilter && !isCombinedFilter);
        })
      );
    }, [columns]);

    const clearAllFilters = () => {
      table.setColumnFilters([]);
      table.resetColumnFilters();
      getHeaderGroups()
        .flatMap((group) => group.headers)
        .forEach((header) => header.column.setFilterValue(undefined));
      setResetAllFilters(true);

      setTimeout(() => {
        setResetAllFilters(false);
      }, 100);
    };

    const headerGroups = getHeaderGroups();

    return (
      <CellSelectionProvider
        value={{
          ...cellSelection,
          enabled: enableCellSelection,
        }}
      >
        <style>
          {`
            @keyframes copyFlash {
              0% {
                background-color: ${butterflyBlue[700]};
              }
              50% {
                background-color: ${butterflyBlue[900]};
              }
              100% {
                background-color: ${butterflyBlue[700]};
              }
            }
          `}
        </style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: height || "calc(100vh - 100px)",
            position: "relative",
          }}
          onMouseUp={endCellSelection}
        >
          <div
            ref={containerRef}
            style={{
              border: `1px solid ${theme.palette.divider}`,
              flexGrow: 1,
              height: "100%",
              overflow: "auto",
              position: "relative",
            }}
          >
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                fontFamily: "arial, sans-serif",
                minHeight: "100%",
                tableLayout: "fixed",
                width: "100%",
              }}
            >
              <thead
                ref={headerRef}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                {swipeableColumns ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    {headerGroups.map((headerGroup) => {
                      return (
                        <DraggableHeaderGroupRows
                          key={headerGroup.id}
                          defaultGrouping={defaultGrouping}
                          enableSecondRowFilter={enableSecondRowFilter}
                          headerGroup={headerGroup}
                          isHeaderReorderable={isHeaderReorderable}
                          loading={loading}
                          resetAllFilters={resetAllFilters}
                          swipeableColumns={swipeableColumns}
                        />
                      );
                    })}
                  </DndContext>
                ) : (
                  headerGroups.map((headerGroup) => {
                    const leftPinnedHeaders = headerGroup.headers.filter(
                      (h) => h.column.getIsPinned() === "left"
                    );

                    const centerHeaders = headerGroup.headers.filter(
                      (h) => !h.column.getIsPinned()
                    );

                    const rightPinnedHeaders = headerGroup.headers.filter(
                      (h) => h.column.getIsPinned() === "right"
                    );

                    const headerRow = (
                      <tr key={`${headerGroup.id}-row`}>
                        {leftPinnedHeaders.map((header) => (
                          <HeaderCell
                            defaultGrouping={defaultGrouping}
                            header={header}
                            key={header.id}
                            loading={loading}
                            resetAllFilters={resetAllFilters}
                          />
                        ))}

                        {centerHeaders.map((header) => {
                          return (
                            <HeaderCell
                              defaultGrouping={defaultGrouping}
                              header={header}
                              key={header.id}
                              loading={loading}
                              resetAllFilters={resetAllFilters}
                            />
                          );
                        })}

                        {rightPinnedHeaders.map((header) => (
                          <HeaderCell
                            defaultGrouping={defaultGrouping}
                            header={header}
                            key={header.id}
                            loading={loading}
                            resetAllFilters={resetAllFilters}
                          />
                        ))}
                      </tr>
                    );

                    return (
                      <Fragment key={headerGroup.id}>
                        {headerRow}

                        {enableSecondRowFilter && !loading && (
                          <tr>
                            {headerGroup.headers.map((header) => (
                              <SearchFilterRow
                                header={header}
                                key={header.id}
                                resetAllFilters={resetAllFilters}
                              />
                            ))}
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </thead>

              <tbody
                style={{
                  filter: loading ? "blur(2px)" : "none",
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: "relative",
                  transition: "filter 0.2s ease-in-out",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const enhancedRow = enhancedRows[virtualRow.index];

                  if (!enhancedRow) {
                    return null;
                  }

                  const { groupId, isSummary, row, summaryData } = enhancedRow;

                  return (
                    <TableRowComponent
                      columnWidths={columnWidths}
                      key={`table-row-${virtualRow.index}-${isSummary ? "summary" : "normal"}-${groupId}`}
                      row={row}
                      index={virtualRow.index}
                      virtualRow={virtualRow}
                      rowHeight={rowHeight}
                      isSummaryRow={isSummary}
                      summaryData={summaryData}
                      exportData={exportData}
                      exportActions={exportActions}
                    />
                  );
                })}
              </tbody>

              {!loading && summary && (
                <TableFooterComponent table={table} summary={summary} />
              )}
            </table>
          </div>

          {rowSelection && getSelectedRowModel().rows.length > 0 && (
            <div style={{ fontSize: "14px" }}>
              Selected Rows: {getSelectedRowModel().rows.length}
            </div>
          )}

          <FilterStatusPanel table={table} clearAllFilters={clearAllFilters} />

          {loading && <CircularLoader />}

          {!rows.length && !loading && <DataNotFound message={emptyMessage} />}
        </div>
      </CellSelectionProvider>
    );
  }
) as SmartGridType;

SmartGrid.displayName = "SmartGrid";

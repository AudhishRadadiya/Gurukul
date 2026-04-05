import { useTheme } from "@mui/material";
import { type Row } from "@tanstack/react-table";
import type { VirtualItem } from "@tanstack/react-virtual";
import type { MouseEvent } from "react";
import { useMemo, useRef, useState } from "react";

import { Button } from "../../Button";
import { useCellSelectionContext } from "../context/CellSelectionContext";
import { useGetPinStyle } from "../hooks/useGetPinStyle";
import type { SummaryRecord } from "../types";
import { CellRenderer } from "./CellRenderer";

type TableRowComponentProps<T> = {
  columnWidths: number[];
  exportActions?: Array<{ label: string; onClick: () => void }>;
  exportData?: boolean;
  index: number;
  isSummaryRow?: boolean;
  row: Row<T>;
  rowHeight: number;
  summaryData?: SummaryRecord<T>;
  virtualRow: VirtualItem;
};

export const TableRowComponent = <T,>({
  columnWidths,
  exportActions,
  exportData,
  index,
  isSummaryRow = false,
  row,
  rowHeight,
  summaryData,
  virtualRow,
}: TableRowComponentProps<T>) => {
  const theme = useTheme();

  const { butterflyBlue, iron, mirage, slate } = theme.palette.app.color;

  const cellSelectionContext = useCellSelectionContext();

  const [isRowHovered, setIsRowHovered] = useState(false);

  const [activePopupRowId, setActivePopupRowId] = useState<string | null>(null);

  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });

  const trRef = useRef<HTMLTableRowElement>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const {
    enabled: cellSelectionEnabled,
    isCellSelected,
    isCopyFlashing,
    startCellSelection,
    updateCellSelection,
  } = cellSelectionContext;

  const getPinStyle = useGetPinStyle<T>();

  const isRowSelected = row.getIsSelected();

  const getRowBackgroundColor = () => {
    if (isSummaryRow) {
      return slate[600];
    }

    if (isRowHovered && !isSummaryRow) {
      return butterflyBlue[600];
    }

    if (isRowSelected) {
      return butterflyBlue[600];
    }

    return iron[600];
  };

  // Handle right-click (context menu) to open popup
  const handleContextMenu = (e: MouseEvent<HTMLTableRowElement>) => {
    if (isSummaryRow) {
      return;
    }
    e.preventDefault();

    const rect = trRef.current?.getBoundingClientRect();

    if (rect) {
      setPopupPosition({
        left: e.clientX,
        top: e.clientY,
      });
      setActivePopupRowId(row.id);
    }
  };

  // Close popup when clicking outside is managed with useEffect and avoid dupilcate open
  useMemo(() => {
    const handleClickOutside = (e: Event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        trRef.current &&
        !trRef.current.contains(e.target as Node)
      ) {
        setActivePopupRowId(null);
      }
    };

    if (activePopupRowId) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activePopupRowId]);

  const isPopupOpen = activePopupRowId === row.id;

  return (
    <>
      <tr
        ref={trRef}
        style={{
          backgroundColor: getRowBackgroundColor(),
          borderTop: `1px solid ${iron[700]}`,
          display: "flex",
          position: virtualRow ? "absolute" : "relative",
          transform: virtualRow
            ? `translateY(${virtualRow.start}px)`
            : undefined,
          width: "100%",
        }}
        key={`table-row-${index}${isSummaryRow ? "-summary" : ""}`}
        onMouseEnter={() => {
          if (!isSummaryRow) {
            setIsRowHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isSummaryRow) {
            setIsRowHovered(false);
          }
        }}
        onContextMenu={handleContextMenu}
      >
        {row.getVisibleCells().map((cell, cellIndex, allCells) => {
          const width = columnWidths[cellIndex] ?? cell.column.getSize();

          const pinStyle = getPinStyle(cell, cellIndex, allCells);

          const isSelected = isCellSelected(row.id, cell.column.id);

          const handleMouseDown = (event: React.MouseEvent) => {
            if (cellSelectionEnabled && !isSummaryRow) {
              const isShiftClick = event.shiftKey;

              startCellSelection(row.id, cell.column.id, isShiftClick);
            }
          };

          const handleMouseEnter = () => {
            if (cellSelectionEnabled && !isSummaryRow) {
              updateCellSelection(row.id, cell.column.id);
            }
          };

          // Apply copy flash animation when cell is selected and flash is active
          const cellBackgroundColor =
            isSelected && !isCopyFlashing ? butterflyBlue[600] : undefined;

          const cellAnimation =
            isSelected && isCopyFlashing
              ? "copyFlash 0.5s ease-in-out"
              : undefined;

          // Check if this cell is pinned
          const isPinned = cell.column.getIsPinned();

          const finalBackgroundColor = isPinned
            ? // eslint-disable-next-line sonarjs/no-nested-conditional
              isSelected && !isCopyFlashing
              ? butterflyBlue[600]
              : getRowBackgroundColor()
            : cellBackgroundColor;

          return (
            <td
              key={cell.id}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              style={{
                animation: cellAnimation,
                backgroundColor: finalBackgroundColor,
                boxSizing: "border-box",
                cursor: cellSelectionEnabled ? "cell" : "default",
                lineHeight: "21px",
                maxWidth: width,
                minWidth: width,
                overflow: "hidden",
                padding: "0px 8px",
                position: "relative",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
                userSelect: cellSelectionEnabled ? "none" : "auto",
                width,
                ...pinStyle,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  color: iron[400],
                  display: "flex",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontWeight: isSummaryRow ? "500" : 400,
                  height: rowHeight,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <CellRenderer
                  cell={cell}
                  row={row}
                  isSummaryRow={isSummaryRow}
                  summaryData={summaryData}
                />
              </div>
            </td>
          );
        })}
      </tr>

      {/* Popup Portal */}
      {isPopupOpen && exportData && (
        <div
          ref={popupRef}
          style={{
            backgroundColor: iron[600],
            borderRadius: "6px",
            boxShadow: `0 0 20px ${mirage[50]}`,
            display: "flex",
            flexDirection: "column",
            left: `${popupPosition.left}px`,
            minWidth: "120px",
            padding: "8px",
            position: "fixed",
            top: `${popupPosition.top}px`,
            width: "120px",
            zIndex: 99,
          }}
        >
          {exportActions?.map((item) => {
            return (
              <Button
                key={item.label}
                onClick={item.onClick}
                variant="text"
                style={{
                  borderBottom: `1px solid ${iron[700]}`,
                  fontSize: "14px",
                  padding: 0,
                }}
                disableRipple
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
};

import type { DraggableAttributes } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { type Header, flexRender } from "@tanstack/react-table";
import { Tooltip } from "../../../Tooltip";
import { useGetGroupedColumn } from "../../hooks/useGetGroupedColumn";
import { useGetSortedColumn } from "../../hooks/useGetSortedColumn";
import type { AppColumnDef } from "../../types";
import { FacetedFilter } from "../FacetedFilter/FacetedFilter";
import { GroupingIcons } from "./GroupingIcons";

type HeaderCellProps<T> = {
  defaultGrouping?: (keyof T)[];
  dragAttributes?: DraggableAttributes;
  dragListeners?: Record<string, unknown>;
  dragRef?: (node: HTMLTableCellElement | null) => void;
  dragTransform?: Transform | null;
  dragTransition?: string;
  header: Header<T, unknown>;
  isDragOver?: boolean;
  isDragging?: boolean;
  isReorderable?: boolean;
  loading: boolean;
  resetAllFilters: boolean;
};

export const HeaderCell = <T,>({
  defaultGrouping,
  dragAttributes,
  dragListeners,
  dragRef,
  dragTransform,
  dragTransition,
  header,
  isDragOver = false,
  isDragging = false,
  isReorderable = false,
  loading = false,
  resetAllFilters,
}: HeaderCellProps<T>) => {
  const theme = useTheme();

  const { butterflyBlue, iron, slate } = theme.palette.app.color;

  const { isSortable, mutipleSortCounts, sortableIcon } = useGetSortedColumn({
    header,
  });

  const { groupedIndex, isGroupable, isGrouped } = useGetGroupedColumn({
    header,
  });

  const {
    columnDef,
    getAfter,
    getCanResize,
    getIsPinned,
    getSize,
    getStart,
    getToggleGroupingHandler,
    getToggleSortingHandler,
  } = header.column;

  const showFacetedFilter = (columnDef as AppColumnDef<T>)?.facetedFilter;

  const isSmartSelectFilter =
    (columnDef as AppColumnDef<T>)?.filterVariant === "smartSelectFilter";

  const headerDynamicWidth: number = getIsPinned() ? getSize() - 8 : getSize();

  const transformStyle = dragTransform
    ? CSS.Transform.toString(dragTransform)
    : undefined;

  const backgroundColor = isReorderable && isDragOver ? slate[700] : slate[800];

  const draggableAttributes = dragAttributes ?? {};

  const draggableListeners = dragListeners ?? {};

  return (
    <th
      colSpan={header.colSpan}
      data-column-id={header.id}
      ref={dragRef}
      style={{
        backgroundColor,
        borderBottom: `1px solid ${iron[700]}`,
        height: "40px",
        left: getIsPinned() === "left" ? `${getStart("left")}px` : undefined,
        maxWidth: headerDynamicWidth,
        minWidth: headerDynamicWidth,
        opacity: isDragging ? 0.85 : 1,
        padding: "0px 0px 0px 8px",
        position: getIsPinned() ? "sticky" : "relative",
        right: getIsPinned() === "right" ? `${getAfter("right")}px` : undefined,
        textAlign: "left",
        transform: transformStyle,
        transition: dragTransition,
        width: headerDynamicWidth,
        zIndex: getIsPinned() ? 3 : 1,
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderRight: `2px solid ${iron[700]}`,
          display: "flex",
          flexGrow: 1,
          gap: "8px",
        }}
      >
        {isReorderable && !loading && (
          <span
            {...draggableAttributes}
            {...draggableListeners}
            style={{
              alignItems: "center",
              color: iron[400],
              cursor: isDragging ? "grabbing" : "grab",
              display: "flex",
              paddingRight: "2px",
              touchAction: "none",
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </span>
        )}

        <div>
          <div
            style={{
              color: iron[400],
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textWrap: "nowrap",
            }}
          >
            {!header.isPlaceholder &&
              flexRender(columnDef.header, header.getContext())}
          </div>
        </div>

        {showFacetedFilter && !loading && !isSmartSelectFilter && (
          <FacetedFilter header={header} resetAllFilters={resetAllFilters} />
        )}

        {isSortable && !loading && (
          <Tooltip toolTipLabel="Sorting">
            <Stack flexDirection="row" alignItems="center">
              <IconButton
                sx={{ padding: 0 }}
                onClick={getToggleSortingHandler()}
              >
                {sortableIcon}
              </IconButton>

              {isSortable && mutipleSortCounts > 0 && (
                <Typography color={iron[400]} variant="caption">
                  ({mutipleSortCounts + 1})
                </Typography>
              )}
            </Stack>
          </Tooltip>
        )}

        {isGroupable && !defaultGrouping?.length && !loading && (
          <IconButton
            {...{
              onClick: getToggleGroupingHandler(),
              style: {
                cursor: "pointer",
                padding: 0,
              },
            }}
          >
            <GroupingIcons
              groupedIndex={groupedIndex}
              isGrouped={isGrouped}
              loading={loading}
            />
          </IconButton>
        )}
      </div>

      {getCanResize() && !loading && (
        <div
          style={{
            background: "transparent",
            cursor: "col-resize",
            height: "100%",
            position: "absolute",
            right: 0,
            top: 0,
            width: "3px",
            zIndex: 1,
          }}
          onMouseDown={header.getResizeHandler()}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = butterflyBlue[900];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        />
      )}
    </th>
  );
};

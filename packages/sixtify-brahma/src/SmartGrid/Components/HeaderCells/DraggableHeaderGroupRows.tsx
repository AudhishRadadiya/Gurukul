import { SortableContext } from "@dnd-kit/sortable";
import type { Header, HeaderGroup } from "@tanstack/react-table";
import { HeaderCell } from "./HeaderCell";
import { DraggableHeaderCell } from "./DraggableHeaderCell";
import { SearchFilterRow } from "../SearchFilterRow/SearchFilterRow";

type DraggableHeaderGroupRowsProps<T> = {
  defaultGrouping: (keyof T)[];
  enableSecondRowFilter: boolean;
  headerGroup: HeaderGroup<T>;
  isHeaderReorderable: (
    header: Header<T, unknown>,
    isLeafGroup: boolean
  ) => boolean;
  loading: boolean;
  resetAllFilters: boolean;
  swipeableColumns: boolean;
};

export const DraggableHeaderGroupRows = <T,>({
  defaultGrouping,
  enableSecondRowFilter,
  headerGroup,
  isHeaderReorderable,
  loading,
  resetAllFilters,
  swipeableColumns,
}: DraggableHeaderGroupRowsProps<T>) => {
  const { depth, headers } = headerGroup;

  const leafDepth = depth ?? 0;

  const leftPinnedHeaders = headers.filter(
    (h) => h.column.getIsPinned() === "left"
  );

  const centerHeaders = headers.filter((h) => !h.column.getIsPinned());

  const rightPinnedHeaders = headers.filter(
    (h) => h.column.getIsPinned() === "right"
  );

  const isLeafGroup = depth === leafDepth;

  const reorderableHeaders = centerHeaders.filter((header) =>
    isHeaderReorderable(header, isLeafGroup)
  );

  const sortableItems = reorderableHeaders.map(({ column: { id } }) => id);

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
        const canReorder = isHeaderReorderable(header, isLeafGroup);

        return canReorder ? (
          <DraggableHeaderCell
            defaultGrouping={defaultGrouping}
            header={header}
            key={header.id}
            loading={loading}
            resetAllFilters={resetAllFilters}
          />
        ) : (
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
    <>
      {swipeableColumns && isLeafGroup && sortableItems.length ? (
        <SortableContext items={sortableItems}>{headerRow}</SortableContext>
      ) : (
        headerRow
      )}

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
    </>
  );
};

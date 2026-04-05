import type { Header } from "@tanstack/react-table";
import { HeaderCell } from "./HeaderCell";
import { useSortable } from "@dnd-kit/sortable";

type DraggableHeaderCellProps<T> = {
  defaultGrouping?: (keyof T)[];
  header: Header<T, unknown>;
  loading: boolean;
  resetAllFilters: boolean;
};

export const DraggableHeaderCell = <T,>({
  defaultGrouping,
  header,
  loading,
  resetAllFilters,
}: DraggableHeaderCellProps<T>) => {
  const {
    attributes,
    isDragging,
    isOver,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
  });

  return (
    <HeaderCell
      defaultGrouping={defaultGrouping}
      header={header}
      loading={loading}
      resetAllFilters={resetAllFilters}
      dragAttributes={attributes}
      dragListeners={
        listeners
          ? (listeners as unknown as Record<string, unknown>)
          : undefined
      }
      dragRef={setNodeRef}
      dragTransform={transform}
      dragTransition={transition}
      isDragging={isDragging}
      isDragOver={isOver}
      isReorderable
    />
  );
};

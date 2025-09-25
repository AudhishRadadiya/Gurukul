import { useEffect } from "react";

type UseHeaderSpacebarToggleArgs<T extends string | number> = {
  allSelectableIds: T[];
  onDeselectAll: () => void;
  onSelectAll: (selectedIds: T[]) => void;
  selectedItems: Record<T, boolean>;
};

export function useHeaderSpacebarToggle<T extends string | number>({
  allSelectableIds,
  onDeselectAll,
  onSelectAll,
  selectedItems,
}: UseHeaderSpacebarToggleArgs<T>) {
  // here useEffect is used to add a keydown event listener to the header element, rendering issue in useMemo
  useEffect(() => {
    const handler = (event: Event) => {
      if (!(event instanceof KeyboardEvent) || event?.code !== "Space") {
        return;
      }

      event.preventDefault();

      const isAllSelected =
        Object.keys(selectedItems).length === allSelectableIds.length;

      if (!isAllSelected) {
        onSelectAll(allSelectableIds);
      } else {
        onDeselectAll();
      }
    };

    const header = document.querySelector(".ag-header");

    if (header) {
      header.addEventListener("keydown", handler);
    }

    return () => {
      header?.removeEventListener("keydown", handler);
    };
  }, [selectedItems, onSelectAll, onDeselectAll]);
}

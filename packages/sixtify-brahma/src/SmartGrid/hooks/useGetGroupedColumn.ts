import type { Header } from "@tanstack/react-table";

type UseGetGroupedColumnProps<T> = {
  header: Header<T, unknown>;
};

export const useGetGroupedColumn = <T>({
  header,
}: UseGetGroupedColumnProps<T>) => {
  const { getCanGroup, getGroupedIndex, getIsGrouped } = header.column;

  const isGroupable = getCanGroup();

  const isGrouped = getIsGrouped();

  const groupedIndex = getGroupedIndex();

  return { groupedIndex, isGroupable, isGrouped };
};

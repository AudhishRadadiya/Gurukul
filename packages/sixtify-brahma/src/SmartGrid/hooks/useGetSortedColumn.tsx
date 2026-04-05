import { ArrowDownward, ArrowUpward, UnfoldMore } from "@mui/icons-material";
import type { Header } from "@tanstack/react-table";
import { useMemo } from "react";

const sortIcons = {
  asc: <ArrowUpward sx={{ fontSize: 16 }} />,
  default: <UnfoldMore sx={{ fontSize: 16, opacity: 0.5 }} />,
  desc: <ArrowDownward sx={{ fontSize: 16 }} />,
} as const;

type UseGetSortedColumnProps<T> = {
  header: Header<T, unknown>;
};

export const useGetSortedColumn = <T,>({
  header,
}: UseGetSortedColumnProps<T>) => {
  const { getCanSort, getIsSorted, getSortIndex } = header.column;

  const isSortable = getCanSort();

  const sortableIcon = useMemo(() => {
    const sortDirection = getIsSorted();

    return sortDirection && sortDirection in sortIcons
      ? sortIcons[sortDirection as keyof typeof sortIcons]
      : sortIcons.default;
  }, [getIsSorted()]);

  const mutipleSortCounts = getSortIndex();

  return { isSortable, mutipleSortCounts, sortableIcon };
};

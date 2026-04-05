import type { ColumnPinningState } from "@tanstack/react-table";
import { useMemo } from "react";

import type { AppColumnDef } from "../types";

type UseGetPinningColumnsProps<T> = {
  columns: AppColumnDef<T>[];
};

export const useGetPinningColumns = <T>({
  columns,
}: UseGetPinningColumnsProps<T>) => {
  const initialPinning = useMemo<ColumnPinningState>(() => {
    const left: string[] = [];

    const right: string[] = [];

    columns.forEach(({ accessorKey, id, pinned }) => {
      if (pinned === "left") {
        left.push(id ?? (accessorKey as string));
      }

      if (pinned === "right") {
        right.push(id ?? (accessorKey as string));
      }
    });

    return { left, right };
  }, [columns]);

  const hasPinnedColumns = useMemo(() => {
    return columns.some(
      ({ pinned }) => pinned === "left" || pinned === "right"
    );
  }, [columns]);

  return { hasPinnedColumns, initialPinning };
};

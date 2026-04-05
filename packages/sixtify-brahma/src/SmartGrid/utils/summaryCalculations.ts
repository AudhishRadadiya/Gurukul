import type { Row } from "@tanstack/react-table";

export type DynamicSummaryConfig<T> = {
  calculation: (values: T[]) => number | string;
  field: keyof T;
  formatter?: (value: number) => string;
  label?: string;
};

export type DynamicSummaryRecord<T> = Partial<
  Record<
    keyof T,
    {
      style?: React.CSSProperties;
      value: React.ReactNode;
    }
  >
>;

export function calculateDynamicSummary<T>(
  rows: Row<T>[],
  configs: DynamicSummaryConfig<T>[]
): DynamicSummaryRecord<T> {
  const result: DynamicSummaryRecord<T> = {};

  const leafRows = rows.flatMap((row) => {
    const { getIsGrouped, subRows } = row;

    if (getIsGrouped()) {
      return subRows.flatMap((subRow) => {
        if (subRow.getIsGrouped()) {
          return subRow.subRows;
        }

        return [subRow];
      });
    }

    return [row];
  });

  const data = leafRows.map((row) => row.original);

  configs.forEach((config) => {
    const calculatedValue = config.calculation(data);

    const formattedValue =
      typeof calculatedValue === "number" && config.formatter
        ? config.formatter(calculatedValue)
        : calculatedValue;

    result[config.field] = {
      value: formattedValue,
    };
  });

  return result;
}

export const calculationHelpers = {
  average:
    <T>(field: keyof T) =>
    (data: T[]): number => {
      if (data.length === 0) {
        return 0;
      }

      const sum = data.reduce((sum, item) => {
        const value = item[field];

        return sum + (typeof value === "number" ? value : 0);
      }, 0);

      return sum / data.length;
    },

  count:
    <T>() =>
    (data: T[]): number => {
      return data.length;
    },

  multiplyAndSum:
    <T>(field: keyof T, multiplier: number) =>
    (data: T[]): number => {
      return data.reduce((sum, item) => {
        const value = item[field];

        return sum + (typeof value === "number" ? value * multiplier : 0);
      }, 0);
    },

  sum:
    <T>(field: keyof T) =>
    (data: T[]): number => {
      return data.reduce((sum, item) => {
        const value = item[field];

        return sum + (typeof value === "number" ? value : 0);
      }, 0);
    },
};

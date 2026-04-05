import type { Header } from "@tanstack/react-table";
import _filter from "lodash/filter";
import _isEmpty from "lodash/isEmpty";
import _isFunction from "lodash/isFunction";
import _isNil from "lodash/isNil";
import _sortBy from "lodash/sortBy";
import { useMemo } from "react";

type UseGetDynamicOptionDataArgs<T> = {
  header: Header<T, unknown>;
  isOpen: boolean;
  searchValue: string;
};

export const useGetDynamicOptionData = <T,>({
  header,
  isOpen,
  searchValue,
}: UseGetDynamicOptionDataArgs<T>) => {
  const { getFacetedUniqueValues } = header.column;

  // Get unique values for the column (from TanStack Table)
  const facetedUniqueValues: Map<string, number> = useMemo(() => {
    if (!_isFunction(getFacetedUniqueValues)) {
      return new Map();
    }

    return getFacetedUniqueValues() ?? new Map();
  }, [header.column, isOpen]);

  // Sort unique values alphabetically
  const sortedUniqueValues: string[] = useMemo(() => {
    if (_isEmpty(facetedUniqueValues)) {
      return [];
    }

    const values = Array.from(facetedUniqueValues.keys());

    return _sortBy(
      _filter(values, (v) => !_isNil(v)),
      (v) => String(v).toLowerCase()
    );
  }, [facetedUniqueValues]);

  // Filter options based on search input
  const filteredOptions: string[] = useMemo(() => {
    if (_isEmpty(searchValue)) {
      return sortedUniqueValues;
    }

    return _filter(sortedUniqueValues, (value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [sortedUniqueValues, searchValue]);

  return { filteredOptions };
};

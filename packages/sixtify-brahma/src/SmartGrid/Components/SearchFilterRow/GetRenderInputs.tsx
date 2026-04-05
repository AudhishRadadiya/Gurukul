import { Autocomplete, TextField } from "@mui/material";
import type { Header } from "@tanstack/react-table";

import type { AppColumnDef, CombinedFilter } from "../../types";
import { DateRangeInput } from "./DateRangeInput/DateRangeInput";
import { DebouncedInput } from "./DebouncedInput";

type GetRenderInputsProps<T> = {
  filterVariant?:
    | "smartTextFilter"
    | "smartNumberFilter"
    | "smartDateFilter"
    | "smartSelectFilter";
  header: Header<T, unknown>;
  resetAllFilters: boolean;
};

export const GetRenderInputs = <T,>({
  filterVariant,
  header,
  resetAllFilters,
}: GetRenderInputsProps<T>) => {
  const { columnDef, getFilterValue, setFilterValue } = header.column;

  const {
    facetedFilter,
    filterParams,
    filterVariant: hasFilterVariant,
  } = columnDef as AppColumnDef<T>;

  const isCombinedFilter = facetedFilter && hasFilterVariant;

  const rawFilterValue = getFilterValue();

  const combinedFilterValue = isCombinedFilter
    ? ((rawFilterValue as CombinedFilter) ?? { facets: [], search: "" })
    : undefined;

  const updateCombinedFilter = (updates: Partial<CombinedFilter>) => {
    if (isCombinedFilter) {
      setFilterValue({
        ...(combinedFilterValue as CombinedFilter),
        ...updates,
      });
    }
  };

  const getValue = () =>
    isCombinedFilter
      ? (combinedFilterValue?.search ?? "")
      : // eslint-disable-next-line sonarjs/no-nested-conditional
        typeof rawFilterValue === "string" ||
          typeof rawFilterValue === "boolean" ||
          typeof rawFilterValue === "number"
        ? rawFilterValue
        : "";

  const setValue = (value: string | boolean | number) => {
    if (isCombinedFilter) {
      return updateCombinedFilter({ search: value.toString() });
    }

    return setFilterValue(value);
  };

  const renderDebouncedInput = (type: "number" | "text" | "date") => (
    <DebouncedInput
      onChange={(value) => setValue(resetAllFilters ? "" : value)}
      type={type}
      value={resetAllFilters ? "" : getValue().toString()}
      style={{ width: "100%" }}
    />
  );

  const renderSelectInput = () => {
    const options = filterParams?.filterOptions ?? [];

    const value = isCombinedFilter
      ? (combinedFilterValue?.search ?? "")
      : // eslint-disable-next-line sonarjs/no-nested-conditional
        typeof rawFilterValue === "string" ||
          typeof rawFilterValue === "boolean" ||
          typeof rawFilterValue === "number"
        ? rawFilterValue
        : "";

    const selected = options.find((opt) => opt.value === value) || null;

    const handleChange = (
      _: unknown,
      newValue: { value: string | boolean | number } | null
    ) => setValue(newValue ? newValue.value : "");

    return (
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label || ""}
        value={selected}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="All"
            sx={{
              "& .MuiInputBase-root": { height: 28 },
            }}
          />
        )}
        size="small"
        sx={{ width: "100%" }}
        slotProps={{
          paper: {
            sx: {
              "& .MuiAutocomplete-option": { fontSize: 12 },
            },
          },
        }}
      />
    );
  };

  switch (filterVariant) {
    case "smartTextFilter":
      return renderDebouncedInput("text");

    case "smartNumberFilter":
      return renderDebouncedInput("number");

    case "smartDateFilter":
      return (
        <DateRangeInput
          width="100%"
          initialValue={
            Array.isArray(rawFilterValue)
              ? (rawFilterValue as string[])
              : undefined
          }
          onApply={(dates) => setFilterValue(dates)}
        />
      );

    case "smartSelectFilter":
      return renderSelectInput();

    default:
      return null;
  }
};

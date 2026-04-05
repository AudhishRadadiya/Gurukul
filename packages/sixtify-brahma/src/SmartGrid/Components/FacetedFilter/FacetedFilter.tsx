import { FilterListRounded } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  ClickAwayListener,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import type { Header } from "@tanstack/react-table";
import { useCallback, useMemo, useRef, useState } from "react";

import type { AppColumnDef, CombinedFilter } from "../../types";
import { DebouncedInput } from "../SearchFilterRow/DebouncedInput";
import { useGetDynamicOptionData } from "./hooks/useGetDynamicOptionData";

import { Tooltip } from "../../../Tooltip";
import { VirtualCheckboxList } from "./VirtualCheckboxList";

type FacetedFilterProps<T> = {
  header: Header<T, unknown>;
  resetAllFilters: boolean;
};

export const FacetedFilter = <T,>({
  header,
  resetAllFilters,
}: FacetedFilterProps<T>) => {
  const theme = useTheme();

  const { butterflyBlue, iron, mirage } = theme.palette.app.color;

  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [localFilterData, setLocalFilterData] = useState<string[] | undefined>(
    undefined
  );

  const popoverRef = useRef<HTMLDivElement>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickAway = useCallback(() => {
    setIsOpen(false);
    setSearchValue("");
  }, []);

  const columnDef = header.column.columnDef as AppColumnDef<T>;

  const { facetedFilter, filterVariant } = columnDef;

  const { getFilterValue, setFilterValue } = header.column;

  // Check if this column has both faceted filter and filter variant
  const isCombinedFilter = facetedFilter && filterVariant;

  const filterValue = isCombinedFilter
    ? ((getFilterValue() as CombinedFilter)?.facets ?? [])
    : ((getFilterValue() as string[]) ?? []);

  const { filteredOptions } = useGetDynamicOptionData({
    header,
    isOpen,
    searchValue,
  });

  const isOptionsEmpty: boolean = !filteredOptions.length;

  const isNoneMode: boolean =
    filterValue.length === 1 && filterValue[0] === "allData";

  const allSelected: boolean = useMemo(() => {
    const valueToUse = localFilterData ?? filterValue;

    const isCurrentNoneMode =
      valueToUse.length === 1 && valueToUse[0] === "allData";

    if (isOptionsEmpty || isCurrentNoneMode) {
      return false;
    }

    if (valueToUse.length === 0) {
      return false;
    }

    return filteredOptions.every((opt) => valueToUse.includes(String(opt)));
  }, [filterValue, localFilterData, filteredOptions, isOptionsEmpty]);

  const manageIntermidiate: boolean = useMemo(() => {
    const valueToUse = localFilterData ?? filterValue;

    const isCurrentNoneMode =
      valueToUse.length === 1 && valueToUse[0] === "allData";

    if (isOptionsEmpty || isCurrentNoneMode || allSelected) {
      return false;
    }

    const selectedFilteredCount = filteredOptions.filter((opt) =>
      valueToUse.includes(String(opt))
    ).length;

    return (
      selectedFilteredCount > 0 &&
      selectedFilteredCount < filteredOptions.length
    );
  }, [
    filterValue,
    localFilterData,
    filteredOptions,
    isOptionsEmpty,
    allSelected,
    searchValue,
  ]);

  const activeFilterCount: number = isNoneMode ? 0 : filterValue.length;

  const checkedMap: Record<string, boolean> = useMemo(() => {
    const valueToUse = localFilterData ?? filterValue;

    const isCurrentNoneMode =
      valueToUse.length === 1 && valueToUse[0] === "allData";

    if (isOptionsEmpty || isCurrentNoneMode) {
      return {};
    }

    return Object.fromEntries(valueToUse.map((val) => [val, true]));
  }, [filterValue, localFilterData, filteredOptions, isOptionsEmpty]);

  const handleToggle = (value: string | number) => {
    const valueStr = String(value);

    const currentLocal = localFilterData ?? filterValue;

    const newFilterValue = currentLocal.includes(valueStr)
      ? currentLocal.filter((v) => v !== valueStr)
      : [...currentLocal, valueStr];

    setLocalFilterData(newFilterValue);
  };

  const handleSelectAll = () => {
    const allOptions = filteredOptions.map(String);

    const valueToUse = localFilterData ?? filterValue;

    const isAllSelected =
      valueToUse.length > 0 &&
      allOptions.every((opt) => valueToUse.includes(opt));

    if (isAllSelected) {
      setLocalFilterData([]);
    } else {
      setLocalFilterData(allOptions);
    }
  };

  const handleApply = useCallback(() => {
    if (localFilterData !== undefined) {
      if (isCombinedFilter) {
        const currentFilter = getFilterValue() ?? {
          facets: [],
          search: "",
        };

        const newFilter = { ...currentFilter, facets: localFilterData };

        setFilterValue(newFilter);
      } else {
        setFilterValue(localFilterData);
      }
    }
    setIsOpen(false);
    setSearchValue("");
  }, [localFilterData, header.column, isCombinedFilter]);

  const handleReset = useCallback(() => {
    if (isCombinedFilter) {
      const currentFilter = getFilterValue() ?? {
        facets: [],
        search: "",
      };

      const newFilter = { ...currentFilter, facets: [] };

      setFilterValue(newFilter);
    } else {
      setFilterValue(undefined);
    }
    setLocalFilterData(undefined);
    setSearchValue("");
    setIsOpen(false);
  }, [header.column, isCombinedFilter]);

  useMemo(() => {
    if (resetAllFilters) {
      handleReset();
    }
  }, [resetAllFilters]);

  return (
    <div style={{ position: "relative" }}>
      <IconButton
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        sx={{ padding: 0, position: "relative" }}
      >
        <Tooltip toolTipLabel="Faceted Filter">
          <FilterListRounded />
        </Tooltip>

        {activeFilterCount > 0 && (
          <span
            style={{
              backgroundColor: butterflyBlue[900],
              border: `2px solid ${iron[600]}`,
              borderRadius: "50%",
              color: iron[600],
              fontSize: "10px",
              fontWeight: "bold",
              height: "6px",
              position: "absolute",
              right: 0,
              top: 1,
              width: "6px",
            }}
          />
        )}
      </IconButton>

      {isOpen && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div
            ref={popoverRef}
            style={{
              backgroundColor: iron[600],
              borderRadius: "6px",
              boxShadow: `0 0 20px ${mirage[50]}`,
              display: "flex",
              flexDirection: "column",
              height: "290px",
              left: 0,
              padding: "8px",
              position: "absolute",
              top: "40px",
              width: "206px",
              zIndex: 50,
            }}
          >
            <DebouncedInput
              onChange={(value) => setSearchValue(String(value))}
              value={searchValue}
              inputHeight="10px"
              style={{ width: "100%" }}
            />

            <Typography
              onClick={handleSelectAll}
              sx={{
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                fontSize: "12px",
                fontWeight: "600",
                gap: "4px",
              }}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={manageIntermidiate}
                onChange={handleSelectAll}
                size="small"
                style={{
                  color:
                    allSelected && !isOptionsEmpty ? butterflyBlue[900] : "",
                  padding: "4px",
                }}
                disabled={isOptionsEmpty}
              />
              Select All
            </Typography>

            {isOptionsEmpty ? (
              <div
                style={{
                  fontSize: "12px",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                No options found
              </div>
            ) : (
              <VirtualCheckboxList
                options={filteredOptions}
                checkedMap={checkedMap}
                onToggle={handleToggle}
              />
            )}

            <div
              style={{
                borderTop: `1px solid ${iron[700]}`,
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "8px",
              }}
            >
              <Button
                variant="text"
                size="small"
                sx={{ fontSize: "12px", height: "22px", minWidth: "40px" }}
                onClick={handleReset}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "12px", height: "22px", minWidth: "40px" }}
                onClick={handleApply}
                disableElevation
              >
                Apply
              </Button>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

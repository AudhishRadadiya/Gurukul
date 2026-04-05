import { HighlightOffRounded } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import type { Table } from "@tanstack/react-table";
import { Fragment } from "react";
import type { OnAction } from "../../utils/types";
import type { CombinedFilter } from "../types";
import { formatDateValue } from "../utils/helper";

type FilterStatusPanelProps<T> = {
  clearAllFilters: OnAction;
  table: Table<T>;
};

export const FilterStatusPanel = <T,>({
  clearAllFilters,
  table,
}: FilterStatusPanelProps<T>) => {
  const theme = useTheme();

  const { brown, butterflyBlue, iron, slate } = theme.palette.app.color;

  const { getHeaderGroups } = table;

  return (
    <div
      style={{
        backgroundColor: slate[600],
        borderTop: `1px solid ${iron[700]}`,
        display: "flex",
        overflow: "auto",
        width: "100%",
      }}
    >
      {(() => {
        // Helper function to extract filter values from different filter types
        const extractFilterValues = (
          filter: CombinedFilter
        ): { facets: string[]; search: string[] } => {
          if (!filter) {
            return { facets: [], search: [] };
          }

          const { facets: filterFacets, search: filterSearch } = filter;

          // Handle array filters
          if (Array.isArray(filter)) {
            return { facets: filter.map(String), search: [] };
          }

          // Handle primitive filters (string/number)
          if (typeof filter === "string" || typeof filter === "number") {
            return {
              facets: filter !== "" ? [String(filter)] : [],
              search: [],
            };
          }

          // Handle object filters with facets and search
          if (typeof filter === "object" && filter != null) {
            const facets = Array.isArray(filterFacets) ? filterFacets : [];

            const search =
              filterSearch != null && filterSearch !== ""
                ? [String(filterSearch)]
                : [];

            return { facets, search };
          }

          return { facets: [], search: [] };
        };

        // Build applied filters list
        const appliedFilters = getHeaderGroups()
          .flatMap((group) => group.headers)
          .map((header) => {
            const filter = header.column.getFilterValue() as CombinedFilter;

            const { facets, search } = extractFilterValues(filter);

            const hasValues = facets.length > 0 || search.length > 0;

            return hasValues ? (
              <Stack key={header.id} flexDirection="row" gap="3px">
                <Typography variant="caption" fontWeight={600}>
                  {header.column.columnDef.header as string}:
                </Typography>

                {facets.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: butterflyBlue[900] }}
                  >
                    {facets.map(formatDateValue).join(", ")}
                  </Typography>
                )}

                {facets.length > 0 && search.length > 0 && (
                  <Typography variant="caption">,</Typography>
                )}

                {search.length > 0 && (
                  <Typography variant="caption" sx={{ color: brown[900] }}>
                    {search.join(", ")}
                  </Typography>
                )}
              </Stack>
            ) : null;
          })
          .filter(Boolean);

        // Don't render if no filters applied
        if (!appliedFilters.length) {
          return null;
        }

        return (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: "5px",
              padding: "5px 0px",
            }}
          >
            <IconButton
              sx={{ borderRight: `2px solid ${iron[700]}`, padding: "0px 5px" }}
              onClick={clearAllFilters}
            >
              <HighlightOffRounded fontSize="small" />
            </IconButton>

            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "3px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {appliedFilters.map((filter, index) => (
                // eslint-disable-next-line sonarjs/no-array-index-key
                <Fragment key={index}>
                  {index > 0 && <Typography variant="caption">,</Typography>}
                  {filter}
                </Fragment>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

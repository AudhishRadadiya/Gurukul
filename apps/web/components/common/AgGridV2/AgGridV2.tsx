import {
  defaultPageSize,
  FacebookCircularProgress,
  getPaletteByTheme,
  PadBox,
  Theme,
} from "@codezee/sixtify-brahma";
import {
  Box,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type {
  ColDef,
  FilterChangedEvent,
  FilterModel,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  DateEditorModule,
  DateFilterModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  themeBalham,
  ValidationModule,
} from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react";
import _isFunction from "lodash/isFunction";
import { useMemo } from "react";

import type { UseActionColumnArgs } from "./hooks/useActionColumn";
import { useActionColumn } from "./hooks/useActionColumn";

const myTheme = themeBalham.withParams({
  accentColor: getPaletteByTheme(Theme.light).palette.app.color
    .butterflyBlue[900],
});

ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  AllCommunityModule,
  InfiniteRowModelModule,
  NumberFilterModule,
  DateEditorModule,
  DateFilterModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

type AgGridV2Props<T> = Omit<AgGridReactProps<T>, "onSelectionChanged"> & {
  actions?: UseActionColumnArgs<T>;
  count?: number; // Made optional for non-paginated use
  footer?: JSX.Element;
  height: number;
  isLoading: boolean;
  onFilterChange?: (event: FilterModel) => void;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (pageSize: number) => void;
  onSelectionChanged?: (data: string[]) => void;
  page?: number;
  rowData: T[];
  rowsPerPage?: number;
  showPagination?: boolean;
};

export const AG_GRID_CELL_DEFAULT_VALUE = "-";

const pageSizeOptions = [20, 50, 100, 200, 500];

const internalDefaultColDef: ColDef = {
  filter: true,
  filterParams: {
    buttons: ["apply", "reset"],
    closeOnApply: true,
    contains: false,
  },
  flex: 1,
  lockVisible: true,
  minWidth: 100,
  valueFormatter: (params) => {
    return !params.value ? AG_GRID_CELL_DEFAULT_VALUE : params.value;
  },
};

export const AgGridV2 = <T,>({
  actions = [],
  columnDefs,
  count = 0,
  defaultColDef = {},
  footer,
  height,
  isLoading,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChanged,
  page = 0,
  rowData,
  rowsPerPage = defaultPageSize,
  ...restProps
}: AgGridV2Props<T>) => {
  const { rowSelection, ...gridProps } = restProps;

  const visibleActions = useMemo(
    () => actions.filter(({ isView }) => isView !== false),
    [actions]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(count / rowsPerPage);
  }, [count, rowsPerPage]);

  const RowsPerPageSelector = useMemo(() => {
    return (
      <Stack direction="row" spacing={5} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontSize={13} fontWeight={300}>
            Go to page
          </Typography>

          <Select
            size="medium"
            sx={{ fontSize: 14, height: 30, width: 68 }}
            value={page + 1}
            onChange={(e) => {
              onPageChange?.(Number(e.target.value) - 1);
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => {
              return (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontSize={13} fontWeight={300}>
            Rows per page
          </Typography>

          <Select
            size="medium"
            sx={{ fontSize: 14, height: 30, width: 68 }}
            value={rowsPerPage}
            onChange={(e) => {
              const newSize = Number(e.target.value);

              onRowsPerPageChange?.(newSize);
              onPageChange?.(0);
            }}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
    );
  }, [
    rowsPerPage,
    pageSizeOptions,
    onRowsPerPageChange,
    onPageChange,
    totalPages,
  ]);

  const { actionColumn } = useActionColumn(visibleActions);

  // Merge internal defaultColDef with passed defaultColDef
  const mergedDefaultColDef = useMemo<ColDef>(() => {
    if (defaultColDef) {
      return {
        ...internalDefaultColDef,
        ...defaultColDef,
      };
    }

    return internalDefaultColDef;
  }, [defaultColDef]);

  const onFilterChanged = (event: FilterChangedEvent<T>) => {
    if (_isFunction(onFilterChange)) {
      const filterModel = event.api.getFilterModel();

      onFilterChange(filterModel);
    }
  };

  const onSelection = (event: SelectionChangedEvent<T>) => {
    if (_isFunction(onSelectionChanged)) {
      const id = event.api.getSelectedNodes().map((node) => node.id);

      if (id.every((item) => typeof item === "string")) {
        onSelectionChanged(id);
      }
    }
  };

  const rowSelectionConfig = useMemo<
    AgGridReactProps<T>["rowSelection"]
  >(() => {
    if (!rowSelection) {
      return rowSelection;
    }

    return {
      checkboxes: true,
      enableClickSelection: false,
      mode: rowSelection === "multiple" ? "multiRow" : "singleRow",
    };
  }, [rowSelection]);

  const newColDef = useMemo<AgGridReactProps["columnDefs"]>(() => {
    if (visibleActions.length) {
      return [...(columnDefs ?? []), actionColumn];
    }

    return columnDefs;
  }, [visibleActions.length, columnDefs, actionColumn]);

  const shouldShowPagination = count > defaultPageSize;

  return (
    <>
      <Box
        height={`calc(100vh - ${shouldShowPagination ? height + 50 : height}px)`}
      >
        <AgGridReact
          columnDefs={newColDef}
          selectionColumnDef={{ pinned: "left", width: 35 }}
          rowData={rowData}
          defaultColDef={mergedDefaultColDef}
          loading={isLoading}
          theme={myTheme}
          loadingOverlayComponent={FacebookCircularProgress}
          onFilterChanged={onFilterChanged}
          rowSelection={rowSelectionConfig}
          onSelectionChanged={onSelection}
          {...gridProps}
        />
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          {footer}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {shouldShowPagination && onPageChange && onRowsPerPageChange && (
            <PadBox padding={{ padding: "8px 25px" }}>
              <Stack direction="row" spacing={5} alignItems="center">
                {RowsPerPageSelector}

                <Pagination
                  page={page + 1}
                  count={totalPages}
                  variant="outlined"
                  shape="rounded"
                  color="secondary"
                  siblingCount={1}
                  boundaryCount={1}
                  showFirstButton
                  showLastButton
                  onChange={(_, newPage) => {
                    onPageChange?.(newPage - 1);
                  }}
                />
              </Stack>
            </PadBox>
          )}
        </Box>
      </Stack>
    </>
  );
};

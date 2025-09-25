import {
  defaultPageSize,
  getPaletteByTheme,
  Pagination,
  Theme,
} from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
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

import { Loader } from "@web/components/common/AgGridV2/Loader";

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
  height,
  isLoading,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChanged,
  page = 1,
  rowData,
  rowsPerPage = defaultPageSize,
  ...restProps
}: AgGridV2Props<T>) => {
  const visibleActions = useMemo(
    () => actions.filter(({ isView }) => isView !== false),
    [actions]
  );

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

  const columnsWithCheckbox = useMemo<AgGridReactProps["columnDefs"]>(() => {
    if (restProps.rowSelection && columnDefs) {
      return [
        {
          checkboxSelection: true,
          field: "checkbox",
          filter: false,
          headerCheckboxSelection: restProps.rowSelection === "multiple",
          headerName: "",
          maxWidth: 35,
          pinned: "left",
          valueFormatter: () => {
            return "";
          },
        },
        ...columnDefs,
      ];
    }

    return columnDefs;
  }, [restProps.rowSelection, columnDefs]);

  const newColDef = useMemo<AgGridReactProps["columnDefs"]>(() => {
    if (visibleActions.length) {
      return [...(columnsWithCheckbox ?? []), actionColumn];
    }

    return columnsWithCheckbox;
  }, [visibleActions.length, columnsWithCheckbox, actionColumn]);

  const shouldShowPagination = count > defaultPageSize;

  return (
    <>
      <Box
        height={`calc(100vh - ${shouldShowPagination ? height + 50 : height}px)`}
      >
        <AgGridReact
          columnDefs={newColDef}
          rowData={rowData}
          defaultColDef={mergedDefaultColDef}
          loading={isLoading}
          theme={myTheme}
          loadingOverlayComponent={Loader}
          onFilterChanged={onFilterChanged}
          onSelectionChanged={onSelection}
          {...restProps}
        />
      </Box>

      {shouldShowPagination && onPageChange && onRowsPerPageChange && (
        <Pagination
          count={count}
          page={page}
          onPageChange={(_, page) => {
            onPageChange(page);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            onRowsPerPageChange(Number(event.target.value));
          }}
        />
      )}
    </>
  );
};

import { Box, Typography, useTheme } from "@mui/material";
import type { ColDef } from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react";
import type { Ref } from "react";
import { forwardRef } from "react";
import { PadBox } from "../PadBox";
import { useGetDeviceType } from "../utils";
import { AgGridStyleProvider } from "./AgGridStyleProvider";

export const defaultPageSize = 50;

export const pageSizeOptions = [20, 50, 100, 200];

//TODO: jaydip, fix unknown type
export type AgGridProps<T = unknown> = AgGridReactProps<T> & {
  height?: string;
  ref?: Ref<AgGridReact<T>>;
  totalRecords?: number;
  overlayNoRowsTemplate?: string;
  selectedItems?: number;
  enableSecondRowFilter?: boolean;
  disableKeyBoardEvent?: boolean;
};

type AgGridType = React.ForwardRefExoticComponent<AgGridProps> &
  (<GenericType>(props: AgGridProps<GenericType>) => JSX.Element);

export const AgGrid = forwardRef(
  <T,>(props: AgGridProps<T>, ref: Ref<AgGridReact<T>>) => {
    const { layout } = useGetDeviceType();

    const {
      cacheBlockSize = props.paginationPageSize ?? defaultPageSize,
      height = "597px",
      rowHeight = 50,
      rowModelType = "infinite",
      defaultColDef,
      rowBuffer = 5,
      totalRecords,
      // eslint-disable-next-line quotes
      overlayNoRowsTemplate = '<span class="ag-overlay-no-rows-center">No Data Found</span>',
      infiniteInitialRowCount = props.paginationPageSize ?? defaultPageSize,
      pagination = false,
      enableSecondRowFilter,
      disableKeyBoardEvent,
      ...rest
    } = props;

    const defaultColumnDef: ColDef<T> = {
      flex: 1,
      floatingFilter: false,
      filterParams: {
        closeOnApply: true,
        contains: false,
        debounceMs: 500,
      },
      lockPosition: true,
      minWidth: layout === "desktop" ? undefined : 200,
      wrapHeaderText: true,
      ...defaultColDef,
    };

    const {
      palette: {
        app: { color },
      },
    } = useTheme();

    if (totalRecords === 0) {
      return (
        <Box
          sx={{
            borderRadius: "4px",
            margin: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            textAlign: "center",
            backgroundColor: color.butterflyBlue[700],
          }}
        >
          <Typography variant="h6">No result found</Typography>
        </Box>
      );
    }

    return (
      <AgGridStyleProvider
        className="ag-theme-quartz "
        style={{ width: "100%", height, position: "relative" }}
      >
        <AgGridReact<T>
          ref={ref}
          cacheBlockSize={cacheBlockSize}
          defaultColDef={{
            ...defaultColumnDef,
            menuTabs: ["generalMenuTab", "filterMenuTab", "columnsMenuTab"],
            floatingFilter: enableSecondRowFilter,
            suppressFloatingFilterButton: enableSecondRowFilter,
            filterParams: {
              ...defaultColumnDef.filterParams,
              buttons:
                !enableSecondRowFilter || disableKeyBoardEvent
                  ? ["apply", "reset"]
                  : [],
            },
          }}
          rowHeight={rowHeight}
          rowModelType={rowModelType}
          rowBuffer={rowBuffer}
          infiniteInitialRowCount={infiniteInitialRowCount}
          overlayNoRowsTemplate={overlayNoRowsTemplate}
          pagination={pagination}
          {...(pagination ? { paginationPageSize: defaultPageSize } : {})}
          paginationPageSizeSelector={pagination ? pageSizeOptions : false}
          {...rest}
        />

        {!!props.selectedItems && pagination && (
          <Box position="absolute" bottom="15px">
            <PadBox padding={{ paddingLeft: "20px" }}>
              <Typography variant="body2">
                Selected Rows {props.selectedItems}
              </Typography>
            </PadBox>
          </Box>
        )}
      </AgGridStyleProvider>
    );
  }
) as AgGridType;

AgGrid.displayName = "AgGrid";

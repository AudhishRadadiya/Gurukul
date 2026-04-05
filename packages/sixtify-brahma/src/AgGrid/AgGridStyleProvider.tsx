import type { StyledComponent } from "@emotion/styled";
import type { BoxProps } from "@mui/material";
import { Box, styled } from "@mui/material";

export const AgGridStyleProvider: StyledComponent<BoxProps> = styled(Box)(
  () => ({
    width: "100%",
    height: "100%",
    position: "relative",

    "& .ag-paging-panel": {
      display: "flex",
      gap: "8px",
      padding: "8px",
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    "& .ag-paging-panel >  .ag-paging-page-size .ag-wrapper": {
      minWidth: "unset",
      maxWidth: "80px",
      width: "100%",
    },

    "& .ag-paging-page-size": {
      width: "100%",
    },

    "& .ag-paging-page-summary-panel": {
      fontSize: "14px",
      whiteSpace: "nowrap",
    },

    "& .ag-picker-field": {
      width: "100%",
      justifyContent: "flex-end",
    },

    "& .ag-paging-button": {
      minWidth: "15px",
    },

    "& .ag-paging-row-summary-panel": {
      whiteSpace: "nowrap",
    },

    "@media (max-width: 768px)": {
      "& .ag-paging-panel": {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        height: "60px",
        margin: 0,
      },
      "& .ag-paging-button, & .ag-paging-page-summary-panel": {
        fontSize: "12px",
      },
      "& .ag-paging-page-size": {
        display: "none",
      },
      "& .ag-paging-row-summary-panel": {
        margin: 0,
      },
    },
  })
);

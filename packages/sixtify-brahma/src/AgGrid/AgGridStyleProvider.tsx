import type { StyledComponent } from "@emotion/styled";
import type { BoxProps } from "@mui/material";
import { Box, styled } from "@mui/material";

export const AgGridStyleProvider: StyledComponent<BoxProps> = styled(Box)(
  ({ theme }) => ({
    width: "100%",
    height: "100%",
    position: "relative",

    "& .ag-paging-panel": {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      padding: "8px",
    },

    "& .ag-paging-page-summary-panel": {
      fontSize: "14px",
    },

    "& .ag-paging-button": {
      minWidth: "28px",
    },

    [theme.breakpoints.down("sm")]: {
      "& .ag-paging-panel": {
        flexDirection: "row",
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

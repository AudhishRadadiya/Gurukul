import { Box, useTheme } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useGetDeviceType } from "../utils";

export const ContentBox = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  const { layout } = useGetDeviceType();

  const { iron, butterflyBlue } = theme.palette.app.color;

  return (
    <Box
      sx={{
        background: iron[600],
        border: `1px solid ${butterflyBlue[300]}`,
        borderRadius: layout === "mobile" ? "0px" : "6px",
        height: "100%",
        width: "100%",
        padding: layout === "mobile" ? "8px" : "5px",
      }}
    >
      {children}
    </Box>
  );
};

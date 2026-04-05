import { Box, useTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

export const ContentBox = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  return (
    <Box
      sx={{
        background: iron[600],
        border: `1px solid ${butterflyBlue[300]}`,
        borderRadius: "6px",
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

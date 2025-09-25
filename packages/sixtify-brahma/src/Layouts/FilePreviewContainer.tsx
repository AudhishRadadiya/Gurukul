import { Box } from "@mui/material";
import type { ReactNode } from "react";

type FilePreviewContainerProps = Readonly<{
  children: ReactNode;
  height?: string | number;
}>;

export function FilePreviewContainer({
  children,
  height = 630,
}: FilePreviewContainerProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <Box sx={{ width: "100%", height }}>{children}</Box>
    </Box>
  );
}

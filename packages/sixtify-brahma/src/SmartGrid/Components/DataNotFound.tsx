import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";

type DataNotFoundProps = {
  message?: string;
};

export const DataNotFound = ({
  message = "No data found",
}: DataNotFoundProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      sx={{ background: "transparent", pointerEvents: "none" }}
    >
      <Typography variant="subtitle1" color={slate[500]} textAlign="center">
        {message}
      </Typography>
    </Stack>
  );
};

export const MemoizedDataNotFound = React.memo(DataNotFound);

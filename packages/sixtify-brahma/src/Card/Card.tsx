import { Box, Stack, Typography, useTheme } from "@mui/material";
import type { PropsWithChildren, ReactNode } from "react";
import { PadBox } from "../PadBox";

type CardProps = PropsWithChildren<{
  heading?: ReactNode;
  action?: ReactNode;
}>;

export function Card({ heading, children, action }: Readonly<CardProps>) {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  return (
    <Box bgcolor={lightBlue[50]} flex={1} sx={{ borderRadius: "5px" }}>
      <PadBox padding={{ padding: 2 }}>
        <Stack gap="10px">
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">{heading}</Typography>

            <Box>{action}</Box>
          </Stack>

          {children}
        </Stack>
      </PadBox>
    </Box>
  );
}

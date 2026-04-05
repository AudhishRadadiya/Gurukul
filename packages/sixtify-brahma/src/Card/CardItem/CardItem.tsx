import { Stack, type StackProps, Typography } from "@mui/material";
import type { ReactNode } from "react";

type CardItemProps = StackProps &
  Readonly<{
    label: ReactNode;
    value?: ReactNode;
  }>;

export function CardItem({ label, value, ...props }: CardItemProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={{ xs: "0px", md: "10px" }}
      {...props}
    >
      {typeof label === "string" ? (
        <Stack gap="10px" width="40%">
          <Typography variant="body1" sx={{ fontWeight: 500 }} flex={1} noWrap>
            {label} :
          </Typography>
        </Stack>
      ) : (
        <> {label} :</>
      )}

      {value}
    </Stack>
  );
}

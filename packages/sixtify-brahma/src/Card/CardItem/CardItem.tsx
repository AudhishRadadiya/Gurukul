import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type CardItemProps = Readonly<{
  label: ReactNode;
  value?: ReactNode;
}>;

export function CardItem({ label, value }: CardItemProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap="5px"
    >
      {typeof label === "string" ? (
        <Typography
          variant="body1"
          sx={{ fontWeight: 500 }}
          flex={1}
          maxWidth="400px"
        >
          {label} :
        </Typography>
      ) : (
        <> {label} :</>
      )}

      {value}
    </Stack>
  );
}

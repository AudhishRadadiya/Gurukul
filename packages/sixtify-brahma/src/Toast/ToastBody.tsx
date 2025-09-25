import { Stack, Typography, useTheme } from "@mui/material";
import type { ToastBody as ToastBodyType } from "./types";

export type ToastBodyProps = Readonly<ToastBodyType>;

export function ToastBody({ title, description }: ToastBodyProps) {
  const {
    palette: {
      app: { color },
    },
  } = useTheme();

  return (
    <Stack gap="4px">
      <Typography fontWeight={500} color="black" variant="body1">
        {title}
      </Typography>

      {description && (
        <Typography color={color.slate[900]} variant="body2">
          {description}
        </Typography>
      )}
    </Stack>
  );
}

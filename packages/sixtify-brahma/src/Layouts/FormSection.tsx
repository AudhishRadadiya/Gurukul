import { Stack, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";
import { PadBox } from "../PadBox";
import { useGetDeviceType } from "../utils";

export const FormSection = ({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) => {
  const { layout } = useGetDeviceType();

  return (
    <Stack gap="15px">
      {title && (
        <Typography fontWeight={700} variant="h5">
          {title}
        </Typography>
      )}

      <PadBox padding={{ padding: layout === "mobile" ? "10px" : "15px" }}>
        <Stack gap="15px">{children}</Stack>
      </PadBox>
    </Stack>
  );
};

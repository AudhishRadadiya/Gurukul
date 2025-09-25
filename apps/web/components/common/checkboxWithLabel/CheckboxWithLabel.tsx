import { CheckBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type CheckboxWithLabelProps<T extends FieldValues> = {
  control: Control<T>;
  fontSize?: number;
  gap?: string;
  label: string;
  name: Path<T>;
  size?: "small" | "medium";
};

export const CheckboxWithLabel = <T extends FieldValues>({
  control,
  fontSize = 15,
  gap = "10px",
  label,
  name,
  size = "small",
}: CheckboxWithLabelProps<T>) => {
  return (
    <Stack direction="row" gap={gap} alignItems="center">
      <CheckBox name={name} control={control} size={size} />

      <Typography fontSize={fontSize}>{label}</Typography>
    </Stack>
  );
};

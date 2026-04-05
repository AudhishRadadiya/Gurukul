import { CheckBox } from "@codezee/sixtify-brahma";
import type { StackProps } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";

type CheckboxWithLabelProps<T extends FieldValues> = {
  control: Control<T>;
  fontSize?: number;
  gap?: string;
  label: string;
  name: Path<T>;
  size?: "small" | "medium";
} & StackProps;

export const CheckboxWithLabel = <T extends FieldValues>({
  control,
  fontSize = 15,
  gap = "10px",
  label,
  name,
  size = "small",
  ...props
}: CheckboxWithLabelProps<T>) => {
  return (
    <Stack {...props} direction="row" gap={gap} alignItems="center">
      <CheckBox name={name} control={control} size={size} />

      <Typography fontSize={fontSize}>{label}</Typography>
    </Stack>
  );
};

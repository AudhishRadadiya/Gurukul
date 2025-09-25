// components/CheckboxRow.tsx
import type { CheckBoxProps } from "@codezee/sixtify-brahma";
import { CheckBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

export type CheckboxRowProps<P extends FieldValues> = CheckBoxProps<P> & {
  label: string;
};

export function CheckboxRow<P extends FieldValues>({
  control,
  label,
  name,
  ...restCheckBoxProps
}: CheckboxRowProps<P>) {
  return (
    <Stack direction="row" gap="10px" alignItems="center">
      <Typography fontSize={15}>{t(label)}</Typography>
      <CheckBox name={name} control={control} {...restCheckBoxProps} />
    </Stack>
  );
}

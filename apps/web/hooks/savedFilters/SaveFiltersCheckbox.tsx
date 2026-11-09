import { CheckBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import type { ChangeEvent } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type SaveFiltersCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  disabled: boolean;
  name: Path<T>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const SaveFiltersCheckbox = <T extends FieldValues>({
  control,
  disabled,
  name,
  onChange,
}: SaveFiltersCheckboxProps<T>) => {
  return (
    <Stack direction="row" gap="6px" alignItems="center">
      <CheckBox
        size="small"
        name={name}
        control={control}
        onChange={onChange}
        disabled={disabled}
      />

      <Typography fontSize={14}>{t("save.filters.label")}</Typography>
    </Stack>
  );
};

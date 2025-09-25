import Checkbox, {
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import type { ChangeEvent } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { BoxStyled, CheckStyled } from "./CheckBox.styled";
import { Skeleton } from "./Skeleton";

export type CheckBoxProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<Omit<MuiCheckboxProps, "checked">, keyof ControllerRenderProps<P>> & {
    loading?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  };

export function CheckBox<P extends FieldValues>({
  name,
  rules,
  control,
  defaultValue,
  size,
  loading = false,
  ...restCheckBoxProps
}: CheckBoxProps<P>) {
  const {
    field: { value = false, ...restField },
  } = useController({ name, control, defaultValue, rules });

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Checkbox
      icon={<BoxStyled size={size} />}
      checkedIcon={<CheckStyled size={size} />}
      checked={value}
      {...restField}
      {...restCheckBoxProps}
    />
  );
}

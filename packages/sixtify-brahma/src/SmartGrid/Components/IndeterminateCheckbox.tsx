import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { Box, Checkbox, type CheckboxProps, useTheme } from "@mui/material";
import type { ChangeEvent } from "react";

type IndeterminateCheckboxProps = {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & Omit<CheckboxProps, "checked" | "disabled" | "indeterminate" | "onChange">;

export const IndeterminateCheckbox = ({
  checked,
  disabled,
  indeterminate,
  onChange,
  ...rest
}: IndeterminateCheckboxProps) => {
  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      indeterminate={indeterminate}
      onChange={onChange}
      disableRipple
      checkedIcon={
        <CheckBoxRoundedIcon
          fontSize="medium"
          htmlColor={butterflyBlue[900]}
          sx={{
            borderRadius: "4px",
            fontSize: "20px",
            marginLeft: "-2px",
          }}
        />
      }
      icon={
        <Box
          sx={{
            border: "1px solid",
            borderColor: iron[800],
            borderRadius: "2px",
            height: 13,
            width: 13,
          }}
        />
      }
      {...rest}
    />
  );
};

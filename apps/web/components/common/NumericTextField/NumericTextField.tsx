import { Tooltip } from "@codezee/sixtify-brahma";
import {
  getDefaultTextFieldSx,
  getDefaultInputLabelProps,
} from "@codezee/sixtify-brahma/src/FormFields/commonStyles";
import { InfoOutlined } from "@mui/icons-material";
import {
  InputLabel,
  Stack,
  TextField as MuiTextField,
  type StackProps,
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import type { ReactNode } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import {
  NumericFormat,
  type NumericFormatProps,
  type NumberFormatValues,
} from "react-number-format";

import { Skeleton } from "./Skeleton";

export type NumericTextFieldProps<P extends FieldValues> =
  UseControllerProps<P> &
    Omit<
      MuiTextFieldProps,
      "value" | "onChange" | keyof ControllerRenderProps<P>
    > &
    Omit<
      NumericFormatProps<typeof MuiTextField>,
      "value" | "onValueChange" | "customInput"
    > & {
      containerProps?: StackProps;
      decimalScale?: number;
      error?: boolean;
      fixedDecimalScale?: boolean;
      helperText?: ReactNode;
      infoMessage?: ReactNode;
      label?: string;
      loading?: boolean;
      minValue?: number;
      removeDecimalScale?: boolean;
      styling?: "custom" | "default";
      thousandSeparator?: boolean;
      thousandsGroupStyle?: "thousand" | "lakh" | "wan";
    };

export function NumericTextField<P extends FieldValues>({
  containerProps,
  control,
  decimalScale = 2,
  defaultValue,
  disabled,
  error: errorProp,
  fixedDecimalScale = false,
  helperText: helperTextProp,
  infoMessage,
  label = "",
  loading = false,
  minValue,
  name,
  placeholder = "",
  removeDecimalScale,
  required,
  rules,
  styling = "default",
  thousandSeparator = false,
  thousandsGroupStyle = "lakh",
  ...inputFieldProps
}: NumericTextFieldProps<P>) {
  const {
    allowNegative: allowNegativeProp,
    isAllowed: isAllowedProp,
    ...restInputFieldProps
  } = inputFieldProps;

  const {
    field: { onChange, value, ...restField },
    fieldState: { error },
  } = useController({ control, defaultValue, name, rules });

  if (loading) {
    return <Skeleton label={label} styling={styling} />;
  }

  return (
    <Stack {...containerProps} gap="5px">
      {label && styling === "custom" && (
        <Stack direction="row">
          <InputLabel
            sx={{ fontSize: { md: "16px", xs: "14px" } }}
            required={required}
            disabled={disabled}
          >
            {label}
          </InputLabel>

          {infoMessage && (
            <Tooltip toolTipLabel={infoMessage}>
              <InfoOutlined sx={{ fontSize: 13 }} />
            </Tooltip>
          )}
        </Stack>
      )}

      <NumericFormat
        customInput={MuiTextField}
        decimalScale={removeDecimalScale ? 0 : decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        thousandSeparator={thousandSeparator}
        thousandsGroupStyle={thousandsGroupStyle}
        value={value ?? ""}
        onValueChange={(values: { floatValue: number | undefined }) => {
          onChange(values.floatValue ?? null);
        }}
        allowNegative={
          allowNegativeProp ??
          (minValue !== undefined ? minValue < 0 : undefined)
        }
        isAllowed={(values: NumberFormatValues) => {
          if (isAllowedProp && !isAllowedProp(values)) {
            return false;
          }

          if (minValue === undefined) {
            return true;
          }

          if (values.floatValue === undefined) {
            return true;
          }

          return values.floatValue >= minValue;
        }}
        disabled={disabled}
        required={required}
        fullWidth
        placeholder={styling === "default" ? placeholder : placeholder || label}
        label={styling === "default" ? label : undefined}
        sx={getDefaultTextFieldSx(styling)}
        InputLabelProps={getDefaultInputLabelProps(styling)}
        error={errorProp ?? Boolean(error)}
        helperText={helperTextProp ?? error?.message}
        {...restField}
        {...restInputFieldProps}
      />
    </Stack>
  );
}

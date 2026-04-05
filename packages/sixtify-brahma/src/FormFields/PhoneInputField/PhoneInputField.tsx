/* eslint-disable sonarjs/no-nested-conditional */
import { InputLabel, Stack, Typography, useTheme } from "@mui/material";
import {
  useController,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import type { PhoneInputProps } from "react-phone-input-2";
import PhoneInput from "react-phone-input-2";
import { Skeleton } from "./Skeleton";

export type PhoneInputFieldProps<P extends FieldValues> =
  UseControllerProps<P> &
    Omit<PhoneInputProps, keyof ControllerRenderProps<P>> & {
      label?: string;
      loading?: boolean;
      rows?: number;
      required?: boolean;
      error?: boolean;
      helperText?: string;
    };

export function PhoneInputField<P extends FieldValues>({
  control,
  name,
  defaultValue,
  rules,
  label,
  disabled = false,
  required,
  rows,
  loading = false,
  placeholder = "",
  error,
  helperText,
  ...phoneInputProps
}: PhoneInputFieldProps<P>) {
  const theme = useTheme();

  const { iron, red } = theme.palette.app.color;

  const {
    field: { value, onChange, ...restField },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  if (loading) {
    return <Skeleton label={label} rows={rows} />;
  }

  return (
    <Stack gap="4px">
      <Stack gap="5px">
        {label && (
          <InputLabel
            sx={{ fontSize: { xs: "14px", md: "16px" } }}
            required={required}
            disabled={disabled}
          >
            {label}
          </InputLabel>
        )}

        <PhoneInput
          country="in"
          enableSearch={true}
          disabled={disabled}
          placeholder={placeholder || label}
          onChange={(phone) => {
            onChange(phone);
          }}
          value={value}
          containerStyle={{
            width: "100%",
            border: error
              ? `1px solid ${red[900]}`
              : disabled
                ? `1px solid ${iron[700]}`
                : `1px solid ${iron[800]}`,
            borderRadius: "4px",
          }}
          inputStyle={{
            width: "100%",
            paddingTop: "19px",
            paddingBottom: "19px",
            fontSize: "16px",
            border: "none",
            opacity: 1,
            color: disabled ? iron[100] : "revert-layer",
            background: disabled ? iron[50] : "revert-layer",
          }}
          buttonStyle={{
            border: "none",
          }}
          inputProps={{ ...restField }}
          {...phoneInputProps}
        />
      </Stack>

      {error && (
        <Typography
          variant="caption"
          sx={{
            color: "red",
            whiteSpace: "pre",
            textWrap: "wrap",
          }}
        >
          {helperText}
        </Typography>
      )}
    </Stack>
  );
}

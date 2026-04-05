import {
  Box,
  FormControlLabel,
  InputLabel,
  RadioGroup,
  Stack,
  type StackOwnProps,
  type StackProps,
  type SxProps,
} from "@mui/material";
import Radio, { type RadioProps as MuiRadioProps } from "@mui/material/Radio";
import type { ReactNode } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Skeleton } from "./Skeleton";

type Options = {
  values: boolean | string | number;
  label?: ReactNode;
  disabled: boolean;
  direction?: StackOwnProps["direction"];
};

export type RadioGroupFieldProps<P extends FieldValues> =
  UseControllerProps<P> &
    Omit<Omit<MuiRadioProps, "checked">, keyof ControllerRenderProps<P>> & {
      label?: string;
      options: Options[];
      loading?: boolean;
      required?: boolean;
      direction?: StackOwnProps["direction"];
      sx?: SxProps;
      isHorizontal?: boolean;
      containerProps?: StackProps;
      type?: string | number;
    };

export function RadioGroupField<P extends FieldValues>({
  name,
  rules,
  label,
  control,
  options,
  defaultValue,
  size = "small",
  color = "secondary",
  type,
  loading = false,
  required = false,
  direction = "row",
  sx = {},
  containerProps,
  isHorizontal = false,
  ...restRadioButtonProps
}: RadioGroupFieldProps<P>) {
  const {
    field: { value, onChange, ...restField },
  } = useController({ name, control, defaultValue, rules });

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Stack
      direction={isHorizontal ? "row" : "column"}
      alignItems={isHorizontal ? "center" : undefined}
      gap={isHorizontal ? 1 : "5px"}
    >
      {label && (
        <InputLabel
          sx={{
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "unset",
            fontSize: { xs: "14px", md: "16px" },
          }}
          required={required}
          disabled={restRadioButtonProps.disabled}
        >
          {label}
        </InputLabel>
      )}

      <RadioGroup
        name={name}
        value={value}
        onChange={(_, event) => {
          if (event === "true") {
            onChange(true);
          } else if (event === "false") {
            onChange(false);
          } else if (type === "number") {
            onChange(Number(event));
          } else {
            onChange(event);
          }
        }}
      >
        <Stack
          gap={direction === "column" ? "5px" : "10px"}
          direction={direction}
          {...containerProps}
        >
          {options?.map(({ label, values, disabled }, index) => {
            return (
              // eslint-disable-next-line sonarjs/no-array-index-key
              <Box key={index}>
                <FormControlLabel
                  value={values}
                  control={
                    <Radio
                      {...restField}
                      {...restRadioButtonProps}
                      color={color}
                      size={size}
                    />
                  }
                  disabled={disabled}
                  label={label}
                  sx={sx}
                />
              </Box>
            );
          })}
        </Stack>
      </RadioGroup>
    </Stack>
  );
}

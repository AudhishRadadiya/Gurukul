import { TextField, type TextFieldProps } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

type DebouncedInputProps = {
  debounce?: number;
  inputFontSize?: string;
  inputHeight?: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  value: string;
} & Omit<TextFieldProps, "onChange" | "value" | "type">;

export const DebouncedInput = ({
  debounce = 500,
  inputFontSize = "14px",
  inputHeight = "10px",
  onChange,
  type = "text",
  value: initialValue,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = useState(initialValue);

  const [debouncedValue] = useDebounceValue(value, debounce);

  // Sync local state when initialValue changes from parent
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, initialValue]);

  return (
    <TextField
      {...props}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search.."
      sx={{
        "& .MuiInputAdornment-root": {
          margin: 0,
        },
        "& .MuiInputBase-input": {
          fontSize: inputFontSize,
          height: inputHeight,
          padding: "4px 8px",
        },
        "& input[type='date']::-webkit-calendar-picker-indicator": {
          position: "absolute",
          right: 8,
          zIndex: 2,
        },
        width: props?.style?.width,
      }}
    />
  );
};

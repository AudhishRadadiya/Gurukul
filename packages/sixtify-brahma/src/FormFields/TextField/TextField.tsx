import {
  InputLabel,
  TextField as MuiTextField,
  Stack,
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import type { KeyboardEvent } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldError,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Skeleton } from "./Skeleton";

export type AllowedCharacterType =
  | "string"
  | "string-number"
  | "string-number-special";

export type LetterCase = "uppercase" | "lowercase" | "mixed";

const characterTypeMessages: Record<AllowedCharacterType, string> = {
  string: "Only alphabetic characters are allowed.",
  "string-number": "Only letters and numbers are allowed.",
  "string-number-special": "Special characters are allowed.",
};

export type TextFieldProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<MuiTextFieldProps, keyof ControllerRenderProps<P>> & {
    label?: string;
    loading?: boolean;
    rows?: number;
    isCapitalize?: boolean;
    isTrimStartDisabled?: boolean;
    characterType?: AllowedCharacterType;
    letterCase?: LetterCase;
    setError?: (
      name: keyof P,
      error: FieldError | { type: string; message?: string }
    ) => void;
    maxLength?: number;
  };

export function TextField<P extends FieldValues>({
  control,
  name,
  defaultValue,
  label = "",
  rules,
  type,
  required,
  disabled,
  loading = false,
  placeholder = "",
  isCapitalize = false,
  isTrimStartDisabled = false,
  rows,
  characterType = "string-number-special",
  letterCase = "mixed",
  setError,
  maxLength,
  ...inputFieldProps
}: TextFieldProps<P>) {
  const {
    field: { value, onChange, ...restField },
    fieldState: { error },
  } = useController({ name, control, defaultValue, rules });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "-" && type === "number") {
      event.preventDefault();
    }
  };

  const getCharacterRegex = (type: AllowedCharacterType) => {
    switch (type) {
      case "string":
        return /^[A-Za-z\s]*$/;

      case "string-number":
        return /^[A-Za-z0-9\s]*$/;

      // TODO: add new case "latin-alnum-special" leer...
      case "string-number-special":
        return /^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\n\r]*$/;

      default:
        return /^[\s\S]*$/;
    }
  };

  const cleanInput = (input: string) => {
    let result = input;

    const regex = getCharacterRegex(characterType);

    if (!regex.test(result)) {
      result = result
        .split("")
        .filter((char) => regex.test(char))
        .join("");
    }

    if (letterCase === "uppercase") {
      result = result.toUpperCase();
    } else if (letterCase === "lowercase") {
      result = result.toLowerCase();
    }

    return result;
  };

  if (loading) {
    return <Skeleton label={label} rows={rows} />;
  }

  return (
    <Stack gap="10px">
      {label && <InputLabel required={required}>{label}</InputLabel>}

      <MuiTextField
        disabled={disabled}
        required={required}
        fullWidth
        onKeyDown={handleKeyDown}
        placeholder={placeholder || label}
        type={type}
        inputProps={{
          min: 0,
          maxLength,
        }}
        error={Boolean(error)}
        helperText={error?.message}
        onChange={(event) => {
          let value = event.target.value || null;

          if (typeof value === "string" && value.trim() === "") {
            value = null;
          } else if (!isTrimStartDisabled && typeof value === "string") {
            value = value.trimStart();
          }

          const cleanedVal = value && cleanInput(value);

          if (value !== cleanedVal) {
            const errorMessage = characterTypeMessages[characterType];

            if (setError) {
              setError(name, { type: "manual", message: errorMessage });

              return;
            }
          }

          if (value && type === "number") {
            onChange(Number(value));
          } else if (isCapitalize) {
            onChange(cleanedVal ? cleanedVal.toUpperCase() : null);
          } else {
            onChange(cleanedVal);
          }
        }}
        value={typeof value === "string" ? value.trimStart() : (value ?? "")}
        {...restField}
        {...inputFieldProps}
      />
    </Stack>
  );
}

import {
  InputLabel,
  TextField as MuiTextField,
  Stack,
  type TextFieldProps as MuiTextFieldProps,
  type StackProps,
} from "@mui/material";
import type { KeyboardEvent, ReactNode } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldError,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

import { InfoOutlined } from "@mui/icons-material";

import { Tooltip } from "../../Tooltip";
import {
  getDefaultInputLabelProps,
  getDefaultTextFieldSx,
} from "../commonStyles";
import { Skeleton } from "./Skeleton";

export type AllowedCharacterType =
  | "string-dots-hyphens"
  | "string"
  | "string-hyphens"
  | "string-number"
  | "string-number-special"
  | "any-character"
  | "string-special"
  | "string-special-all"
  | "custom";

export type LetterCase = "uppercase" | "lowercase" | "mixed";

export const characterTypeMessages: Record<AllowedCharacterType, string> = {
  string: "Only alphabetic characters are allowed.",
  "string-dots-hyphens": "Only letters, dots, and hyphens are allowed.",
  "string-hyphens": "Only letters and hyphens are allowed.",
  "string-number": "Only letters and numbers are allowed.",
  "string-number-special": "Special characters are allowed.",
  "string-special":
    "Only letters, accents, apostrophes, and hyphens are allowed.",
  "any-character": "All characters are allowed.",
  "string-special-all": "Only letters and Special characters are allowed",
  custom: "Please enter a valid input",
};

export type TextFieldProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<MuiTextFieldProps, keyof ControllerRenderProps<P>> & {
    label?: string;
    loading?: boolean;
    rows?: number;
    isCapitalize?: boolean;
    isTrimStartDisabled?: boolean;
    letterCase?: LetterCase;
    setError?: (
      name: keyof P,
      error: FieldError | { type: string; message?: string }
    ) => void;
    containerProps?: StackProps;
    maxLength?: number;
    styling?: "custom" | "default";
    infoMessage?: ReactNode;
    characterType?: AllowedCharacterType;
    regexExpression?: {
      message: string | null;
      regex: RegExp;
    };
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
  letterCase = "uppercase",
  setError,
  maxLength,
  containerProps,
  styling = "default",
  infoMessage,
  regexExpression = {
    message: null,
    regex: /^[\s\S]*$/,
  },
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

      case "string-hyphens":
        return /^[A-Za-z-]*$/;

      case "string-number":
        return /^[A-Za-z0-9\s]*$/;

      case "string-dots-hyphens":
        return /^[A-Za-z.-]*$/;

      // TODO: add new case "latin-alnum-special" leer...
      case "string-number-special":
        return /^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\n\r]*$/;

      case "any-character":
        return /^[\s\S]*$/;

      case "string-special":
        return /^[\p{L}\p{M}’'\-\s]+$/u;

      case "string-special-all":
        return /^[^\d]+$/;

      case "custom":
        return regexExpression.regex;

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

  const { message } = regexExpression;

  const errorMessage = !message
    ? characterTypeMessages[characterType]
    : message;

  if (loading) {
    return <Skeleton label={label} rows={rows} styling={styling} />;
  }

  return (
    <Stack {...containerProps} gap="5px">
      {label && styling === "custom" && (
        <Stack direction="row">
          <InputLabel
            sx={{ fontSize: { xs: "14px", md: "16px" } }}
            required={required}
            disabled={disabled}
          >
            {label}
          </InputLabel>

          {infoMessage && (
            <Tooltip toolTipLabel={infoMessage}>
              <InfoOutlined
                sx={{
                  fontSize: 13,
                }}
              />
            </Tooltip>
          )}
        </Stack>
      )}

      <MuiTextField
        disabled={disabled}
        required={required}
        fullWidth
        onKeyDown={handleKeyDown}
        placeholder={styling === "default" ? placeholder : placeholder || label}
        type={type}
        label={styling === "default" ? label : undefined}
        sx={getDefaultTextFieldSx(styling)}
        InputLabelProps={getDefaultInputLabelProps(styling)}
        inputProps={{
          min: 0,
          maxLength,
        }}
        error={Boolean(error)}
        helperText={error?.message}
        onChange={(event) => {
          const input = event.target;

          const { selectionStart, selectionEnd } = input;

          let value = event.target.value || null;

          if (typeof value === "string" && value.trim() === "") {
            value = null;
          } else if (!isTrimStartDisabled && typeof value === "string") {
            value = value.trimStart();
          }

          const cleanedVal = value && cleanInput(value);

          if (value !== cleanedVal) {
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

          if (type == "string") {
            requestAnimationFrame(() => {
              input.setSelectionRange(selectionStart, selectionEnd);
            });
          }
        }}
        value={typeof value === "string" ? value.trimStart() : (value ?? "")}
        {...restField}
        {...inputFieldProps}
      />
    </Stack>
  );
}

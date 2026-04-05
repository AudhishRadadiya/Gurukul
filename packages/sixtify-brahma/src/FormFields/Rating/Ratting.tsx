import {
  FormHelperText,
  InputLabel,
  Rating as MuiRating,
  Stack,
} from "@mui/material";
import { useController, type FieldValues } from "react-hook-form";
import { RatingSkeleton } from "./Skeleton";
import type { RatingProps } from "./types";

export function Rating<P extends FieldValues & { required?: boolean }>({
  control,
  name,
  defaultValue,
  label = "",
  rules,
  disabled,
  loading = false,
  direction = "column",
  required = false,
  ...ratingProps
}: RatingProps<P>) {
  const {
    field: { value, onChange, ...restField },
    fieldState: { error },
  } = useController({ name, control, defaultValue, rules });

  if (loading) {
    return <RatingSkeleton label={label} />;
  }

  return (
    <>
      <Stack
        gap="5px"
        direction={direction}
        alignItems={direction === "row" ? "center" : "flex-start"}
      >
        {label && (
          <InputLabel
            sx={{
              minWidth: direction === "row" ? "120px" : "auto",
              marginBottom: direction === "row" ? 0 : "auto",
            }}
            required={required}
          >
            {label}
          </InputLabel>
        )}

        <MuiRating
          disabled={disabled}
          value={value ?? null}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          {...restField}
          {...ratingProps}
        />
      </Stack>

      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </>
  );
}

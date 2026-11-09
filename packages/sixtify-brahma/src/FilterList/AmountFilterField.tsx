import { Box, Stack } from "@mui/material";
import type { Control, FieldErrors, FieldValues } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Autocomplete, TextField } from "../FormFields";
import type { FilterListType } from "./FilterTypeWrapper";
import _get from "lodash/get";

type AmountFilterFieldProps = {
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  filter: FilterListType;
};

const getAmountFieldError = (
  errors: FieldErrors<FieldValues>,
  parentKey: string,
  fieldKey: string
) => {
  const parentErrors = errors[parentKey];

  const fieldError = _get(parentErrors, fieldKey, null);

  return fieldError;
};

export const AmountFilterField = ({
  control,
  errors,
  filter,
}: AmountFilterFieldProps) => {
  const { key, amountFilterKeys } = filter;

  if (!amountFilterKeys) {
    return null;
  }

  const { operatorKey, fromAmountKey, toAmountKey, betweenOperatorValue } =
    amountFilterKeys;

  const operator = useWatch({ control, name: `${key}.${operatorKey}` });

  const isBetween = operator === betweenOperatorValue;

  const operatorError = getAmountFieldError(errors, key, operatorKey);

  const fromAmountError = getAmountFieldError(errors, key, fromAmountKey);

  const toAmountError = getAmountFieldError(errors, key, toAmountKey);

  return (
    <Stack gap="8px" width="100%">
      <Stack
        direction={isBetween ? "column" : "row"}
        alignItems={isBetween ? "stretch" : "center"}
        gap="8px"
        width="100%"
      >
        <Box sx={{ flex: isBetween ? 1 : 2, minWidth: 0 }}>
          <Autocomplete
            disableClearable
            disabled={filter.isDisabled}
            name={`${key}.${operatorKey}`}
            control={control}
            options={filter.options ?? []}
            placeholder={`Select ${operatorKey}`}
            error={!!operatorError}
            helperText={operatorError?.message as string}
            sx={{ width: "100%" }}
          />
        </Box>

        {!isBetween && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              type="number"
              disabled={filter.isDisabled}
              name={`${key}.${fromAmountKey}`}
              control={control}
              placeholder="Amount"
              error={!!fromAmountError}
              helperText={fromAmountError?.message as string}
            />
          </Box>
        )}
      </Stack>

      {isBetween && (
        <Stack direction="row" gap="8px" width="100%">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              type="number"
              disabled={filter.isDisabled}
              name={`${key}.${fromAmountKey}`}
              control={control}
              placeholder="From Amount"
              error={!!fromAmountError}
              helperText={fromAmountError?.message as string}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              type="number"
              disabled={filter.isDisabled}
              name={`${key}.${toAmountKey}`}
              control={control}
              placeholder="To Amount"
              error={!!toAmountError}
              helperText={toAmountError?.message as string}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

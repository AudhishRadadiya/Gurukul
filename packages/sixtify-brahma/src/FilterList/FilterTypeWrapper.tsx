import { ListItemButton, Stack, Typography } from "@mui/material";
import type { Control, FieldValues } from "react-hook-form";
import { SwitchField } from "../FormFields/SwitchField";

export type FilterComponentType =
  | "autoComplete"
  | "text"
  | "date"
  | "dateRange"
  | "checkbox"
  | "radio"
  | "switch"
  | "amountFilter";

type AmountFilterKeys = {
  betweenOperatorValue: string;
  fromAmountKey: string;
  operatorKey: string;
  toAmountKey: string;
};

export type AmountFilterValues = {
  fromAmount: number | null;
  toAmount: number | null;
  operator: string | null;
};

export type AmountFilterCurrentValue = {
  fromAmount: number | null;
  operator: string | null;
  toAmount: number | null;
};

export type FilterCurrentValue =
  | string
  | string[]
  | AmountFilterCurrentValue
  | null;

type Options = readonly {
  label: string;
  value: string | number;
  disabled?: boolean;
  avatar?: string;
  employee_code?: string;
  punch_code?: string;
}[];

export type FilterListType = {
  amountFilterKeys?: AmountFilterKeys;
  amountFilterValues?: AmountFilterValues;
  employeeAutocomplete?: boolean;
  isDefaultCurrentDate?: boolean;
  isDisabled?: boolean;
  key: string;
  label: string;
  menuInfo?: string;
  monthYearFormat?: boolean;
  multiSelect?: boolean;
  options?: Options;
  required?: boolean;
  type: FilterComponentType;
  value: string;
};
type FilterTypeWrapperProps = {
  filter: FilterListType;
  control: Control<FieldValues>;
};
export const FilterTypeWrapper = ({
  filter,
  control,
}: FilterTypeWrapperProps) => {
  const getFilterByType = (type: FilterComponentType) => {
    return (
      <Stack
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2">{filter.label}</Typography>

        {type === "switch" ? (
          <SwitchField control={control} name={filter.key} />
        ) : (
          <Typography variant="body2">{filter.menuInfo}</Typography>
        )}
      </Stack>
    );
  };

  return <ListItemButton>{getFilterByType(filter.type)}</ListItemButton>;
};

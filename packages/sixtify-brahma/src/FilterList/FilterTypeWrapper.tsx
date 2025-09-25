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
  | "switch";

type Options = readonly {
  label: string;
  value: string | number;
  disabled?: boolean;
  avatar?: string;
  employee_code?: string;
  punch_code?: string;
}[];

export type FilterListType = {
  label: string;
  isDisabled?: boolean;
  key: string;
  value: string;
  type: FilterComponentType;
  menuInfo?: string;
  options?: Options;
  multiSelect?: boolean;
  required?: boolean;
  monthYearFormat?: boolean;
  isDefaultCurrentDate?: boolean;
  employeeAutocomplete?: boolean;
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

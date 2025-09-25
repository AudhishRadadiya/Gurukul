import { useTheme } from "@mui/material";
import type { Control, FieldErrors, FieldValues } from "react-hook-form";
import {
  Autocomplete,
  DatePicker,
  DateRangePicker,
  TextField,
} from "../FormFields";
import type { FilterPopupComponentType } from "./FilterPopupWrapper";
import type { FilterListType } from "./FilterTypeWrapper";

type EmployeeOption = {
  label: string;
  employee_code?: string;
  punch_code?: string;
};

type GetFilterPopupComponentArgs = {
  selectedFilter: FilterListType;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  setIsPopupOpen?: (isOpen: boolean) => void;
};

export function getFilterPopupComponent({
  selectedFilter,
  control,
  errors,
  setIsPopupOpen,
}: GetFilterPopupComponentArgs): FilterPopupComponentType {
  const theme = useTheme();

  const { sapphireBlue, black } = theme.palette.app.color;

  const errorSelectedKey = errors[selectedFilter.key];

  return {
    autoComplete: selectedFilter.options && (
      <Autocomplete
        disableClearable
        multiple={selectedFilter.multiSelect ?? false}
        placeholder={`Select ${selectedFilter.label}`}
        name={`${selectedFilter.key}`}
        disabled={selectedFilter.isDisabled}
        shouldCloseOnSelect={selectedFilter.multiSelect ?? false}
        control={control}
        options={selectedFilter.options ?? []}
        onOpen={() => setIsPopupOpen?.(true)}
        onClose={() => setIsPopupOpen?.(false)}
        sx={{
          maxHeight: "250px",
          overflowY: "auto",
          width: "100%",
          "& .MuiAutocomplete-tag": {
            backgroundColor: sapphireBlue[300],
            color: black[900],
          },
        }}
        {...(selectedFilter.employeeAutocomplete && {
          isShowEmployeeData: true,
          getOptionLabel: (option: EmployeeOption | string) => {
            if (typeof option === "string") {
              return option;
            }

            return `${option.label} (${option.employee_code}) - ${option.punch_code}`;
          },
        })}
        error={!!errorSelectedKey}
        helperText={errorSelectedKey?.message as string}
      />
    ),
    text: (
      <TextField
        name={selectedFilter.key}
        control={control}
        disabled={selectedFilter.isDisabled}
        placeholder={selectedFilter.label}
        error={!!errorSelectedKey}
        helperText={errorSelectedKey?.message as string}
      />
    ),
    date: (
      <DatePicker
        name={selectedFilter.key}
        control={control}
        disabled={selectedFilter.isDisabled}
        error={!!errorSelectedKey}
        helperText={errorSelectedKey?.message as string}
        {...(selectedFilter.monthYearFormat && {
          format: "MMM yyyy",
          views: ["year", "month"],
        })}
      />
    ),
    dateRange: (
      <DateRangePicker
        name={selectedFilter.key}
        control={control}
        disabled={selectedFilter.isDisabled}
        error={!!errorSelectedKey}
        helperText={errorSelectedKey?.message as string}
      />
    ),
  };
}

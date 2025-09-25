import { Stack, Typography, type PopoverProps } from "@mui/material";
import { type PropsWithChildren } from "react";
import type { Control, FieldErrors, FieldValues } from "react-hook-form";
import { SwitchField } from "../FormFields";
import { PadBox } from "../PadBox";
import { DateRangePickerPopUp } from "./DateRangePickerPopUp";
import { FilterPopup } from "./FilterPopup";
import type { FilterListType } from "./FilterTypeWrapper";
import { getFilterPopupComponent } from "./GetFilterPopupComponent";

type FilterPopupWrapperProp = PropsWithChildren<PopoverProps> & {
  filterItem: FilterListType;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  currentFilterValue?: string | string[] | null;
  onApply: () => void;
  reset?: () => void;
};

type FilterDateRangePickerWrapperProp = PropsWithChildren<PopoverProps> & {
  filterItem: FilterListType;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  onApply: () => void;
};

export type FilterPopupComponentType = {
  autoComplete?: JSX.Element;
  text: JSX.Element;
  date: JSX.Element;
  checkbox?: JSX.Element;
  dateRange?: JSX.Element;
  switch?: JSX.Element;
  radio?: JSX.Element;
};

export const FilterPopupWrapper = ({
  open,
  anchorEl,
  filterItem,
  onClose,
  control,
  errors,
  onApply,
  currentFilterValue,
  reset,
}: FilterPopupWrapperProp) => {
  return (
    <FilterPopup
      title={filterItem.label}
      required={filterItem.required}
      filterItem={filterItem}
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      onApply={onApply}
      currentFilterValue={currentFilterValue}
      reset={reset}
      showFooter
      showDivider
      background
    >
      <PadBox padding={{ padding: "10px" }}>
        {
          getFilterPopupComponent({
            selectedFilter: filterItem,
            control,
            errors,
          })[filterItem.type]
        }

        {filterItem.type === "switch" && (
          <Stack
            key={filterItem.key}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: "10px 5px 10px 20px", margin: "auto" }}
          >
            <Typography variant="body2">{filterItem.label}</Typography>

            <SwitchField control={control} name={filterItem.key} />
          </Stack>
        )}
      </PadBox>
    </FilterPopup>
  );
};

export const FilterPopUpDateRangeWrapper = ({
  open,
  anchorEl,
  filterItem,
  onClose,
  control,
  errors,
  onApply,
}: FilterDateRangePickerWrapperProp) => {
  return (
    <DateRangePickerPopUp
      title={filterItem.label}
      required={filterItem.required}
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      onApply={onApply}
      showFooter
      showDivider
      background
    >
      <PadBox padding={{ padding: "10px" }}>
        {
          getFilterPopupComponent({
            selectedFilter: filterItem,
            control,
            errors,
          })[filterItem.type]
        }
      </PadBox>
    </DateRangePickerPopUp>
  );
};

import type { SelectProps as MuiSelectProps } from "@mui/material";
import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowDropDownIcon, ClearIcon } from "@mui/x-date-pickers";
import { useMemo, useRef, useState } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EditIconAction } from "../../Actions";
import { toasts } from "../../Toast";
import { BoxStyled, CheckStyled } from "../CheckBox/CheckBox.styled";
import {
  getDefaultFormControlSx,
  getDefaultInputLabelSx,
} from "../commonStyles";
import { GroupHeader, StyledFormControl } from "./Select.styled";
import type { OnAction } from "../../utils/types";

export type SelectOption = {
  heading?: string;
  label: string;
  value: string | number;
  disabled?: boolean;
  employee_code?: string;
  avatar?: string | null;
  punch_code?: string;
};

export type SelectProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<
    MuiSelectProps,
    keyof ControllerRenderProps<P> | "multiple" | "value" | "onChange"
  > & {
    required?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    placeholder?: string;
    multiple?: boolean;
    options?: SelectOption[];
    loading?: boolean;
    isShowAvatar?: boolean;
    onAction?: OnAction;
    isShowSelectAll?: boolean;
    maxLimit?: number;
    renderOption?: (option: SelectOption, selected: boolean) => JSX.Element;
    maxDisplayItems?: number;
    disableClearable?: boolean;
    setOnFinalChange?: boolean;
    styling?: "custom" | "default";
  };

export function Select<P extends FieldValues>({
  control,
  defaultValue,
  name,
  required = false,
  label,
  multiple = false,
  disabled = false,
  options = [],
  rules,
  loading = false,
  helperText,
  error,
  placeholder = "",
  isShowSelectAll = true,
  isShowAvatar = false,
  onAction,
  renderOption,
  maxLimit,
  maxDisplayItems = 2,
  disableClearable = required ? true : false,
  setOnFinalChange = false,
  styling = "custom",
  ...restProps
}: SelectProps<P>) {
  const {
    field: { onChange, value, ...restField },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  const { t } = useTranslation();

  const theme = useTheme();

  const { slate, iron } = theme.palette.app.color;

  const disabledColor = disabled ? iron[900] : "revert-layer";

  const [pendingValue, setPendingValue] = useState<
    string | number | (string | number)[] | null
  >(null);

  const hasPendingChange = useRef(false);

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allValues = options
        .filter((option) => !option.disabled)
        .map((option) => option.value);

      onChange(allValues);
    } else {
      onChange([]);
    }
  };

  const isAllSelected = useMemo(() => {
    if (!multiple || !isShowSelectAll || !Array.isArray(value)) {
      return false;
    }

    const selectableOptions = options.filter((option) => !option.disabled);

    return value.length === selectableOptions.length;
  }, [multiple, isShowSelectAll, options, value]);

  const selectedOptions = useMemo(() => {
    if (!multiple || !Array.isArray(value)) {
      return [];
    }

    return options.filter((option) => value.includes(option.value));
  }, [multiple, options, value]);

  const renderValue = (selected: unknown) => {
    if (!multiple) {
      const selectedOption = options.find(
        (option) => option.value === selected
      );

      const placeholderText = () => {
        if (selectedOption) {
          return selectedOption.label;
        }

        if (styling === "default" && label) {
          return "";
        }

        return placeholder;
      };

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isShowAvatar && selectedOption?.avatar && (
            <Avatar
              src={selectedOption.avatar ?? ""}
              sx={{ width: 20, height: 20 }}
            />
          )}

          <Typography
            variant="body2"
            color={disabledColor}
            sx={{
              "-webkit-text-fill-color": disabledColor,
            }}
            noWrap
          >
            {placeholderText()}
          </Typography>
        </Box>
      );
    }

    if (!Array.isArray(selected) || selected.length === 0) {
      const shouldShowPlaceholder =
        styling !== "default" || !label || placeholder;

      return (
        <Typography
          sx={{
            "-webkit-text-fill-color": disabledColor,
          }}
          color={disabledColor}
          variant="body2"
          noWrap
        >
          {shouldShowPlaceholder ? placeholder : ""}
        </Typography>
      );
    }

    const visibleItems = selectedOptions.slice(0, maxDisplayItems);

    const overflowCount = selectedOptions.length - maxDisplayItems;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          overflow: "hidden",
        }}
      >
        {visibleItems.map((option) => (
          <Typography
            key={option.value}
            variant="body2"
            noWrap
            color={disabledColor}
            sx={{
              "-webkit-text-fill-color": disabledColor,
              backgroundColor: slate[800],
              padding: "2px 5px",
              borderRadius: "12px",
              fontSize: "12px",
              maxWidth: "120px",
            }}
          >
            {option.label}
          </Typography>
        ))}

        {overflowCount > 0 && (
          <Typography
            variant="body2"
            color={disabledColor}
            sx={{
              "-webkit-text-fill-color": disabledColor,
              backgroundColor: slate[300],
              padding: "2px 5px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            +{overflowCount}
          </Typography>
        )}
      </Box>
    );
  };

  const groupedOptions = useMemo(() => {
    const groups: Record<string, SelectOption[]> = {};

    options.forEach((option) => {
      const groupKey = option.heading ?? "";

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(option);
    });

    return groups;
  }, [options]);

  if (loading) {
    return (
      <Stack gap="10px">
        {label && styling === "custom" && (
          <Skeleton
            width={120}
            height="23px"
            sx={{
              transform: "scale(1)",
            }}
          />
        )}

        <Skeleton
          height="40px"
          sx={{
            transform: "scale(1)",
          }}
        />
      </Stack>
    );
  }

  // eslint-disable-next-line sonarjs/function-return-type
  const getDisplayValue = () => {
    return setOnFinalChange && hasPendingChange.current ? pendingValue : value;
  };

  const renderMenuItems = () => {
    const items: JSX.Element[] = [];

    const displayValue = getDisplayValue();

    if (multiple && isShowSelectAll && options.length > 0) {
      items.push(
        <MenuItem key="select-all" value="select-all">
          <Checkbox
            icon={<BoxStyled size="small" />}
            checkedIcon={<CheckStyled size="small" />}
            indeterminate={
              Array.isArray(displayValue) &&
              displayValue.length > 0 &&
              displayValue.length <
                options.filter(({ disabled }) => !disabled).length
            }
            checked={
              Array.isArray(displayValue) &&
              displayValue.length === options.filter((o) => !o.disabled).length
            }
            sx={{ marginRight: 1 }}
          />
          <ListItemText primary="Select All" />
        </MenuItem>
      );

      items.push(
        <Divider key="divider-select-all" sx={{ margin: "0px !important" }} />
      );
    }

    Object.entries(groupedOptions).forEach(([groupName, groupOptions]) => {
      if (groupName) {
        items.push(
          <GroupHeader key={`group-${groupName}`}>{groupName}</GroupHeader>
        );
      }

      groupOptions.forEach((option) => {
        const isSelected = multiple
          ? Array.isArray(displayValue) && displayValue.includes(option.value)
          : displayValue === option.value;

        items.push(
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {renderOption ? (
              renderOption(option, isSelected)
            ) : (
              <>
                {multiple && (
                  <Checkbox
                    icon={<BoxStyled size="small" />}
                    checkedIcon={<CheckStyled size="small" />}
                    checked={isSelected}
                    sx={{ marginRight: 1 }}
                  />
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isShowAvatar && option.avatar && (
                    <Avatar
                      src={option.avatar}
                      alt={option.label}
                      sx={{ width: 24, height: 24 }}
                    />
                  )}
                  <ListItemText primary={option.label} />
                </Box>
              </>
            )}
          </MenuItem>
        );
      });
    });

    return items;
  };

  return (
    <Stack gap="5px">
      {label && styling === "custom" && (
        <InputLabel
          sx={{ fontSize: { xs: "14px", md: "16px" } }}
          required={required}
          disabled={disabled}
        >
          {label}
        </InputLabel>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        gap="10px"
        alignItems="start"
      >
        <StyledFormControl
          fullWidth
          error={error}
          disabled={disabled}
          required={required}
          sx={
            styling === "default"
              ? {
                  ...getDefaultFormControlSx(styling),
                  "& .MuiOutlinedInput-notchedOutline": {
                    "& legend": {
                      maxWidth: 0,
                      "& span": {
                        padding: "0 5px",
                      },
                    },
                  },
                  "& .MuiInputLabel-root.MuiInputLabel-shrink + .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend":
                    {
                      maxWidth: "100%",
                    },
                }
              : undefined
          }
        >
          {label && styling === "default" && (
            <InputLabel
              id={`${name}-label`}
              sx={getDefaultInputLabelSx(styling)}
            >
              {label}
            </InputLabel>
          )}
          <MuiSelect
            {...restField}
            {...restProps}
            multiple={multiple}
            value={getDisplayValue() ?? (multiple ? [] : "")}
            label={styling === "default" ? label : undefined}
            labelId={
              styling === "default" && label ? `${name}-label` : undefined
            }
            inputProps={{
              "aria-label": styling === "custom" && label ? label : undefined,
            }}
            // eslint-disable-next-line sonarjs/cognitive-complexity
            onChange={(event) => {
              const newValue = event.target.value;

              if (setOnFinalChange) {
                hasPendingChange.current = true;

                if (
                  multiple &&
                  Array.isArray(newValue) &&
                  (newValue as (string | number)[]).includes("select-all")
                ) {
                  setPendingValue(
                    Array.isArray(pendingValue) &&
                      pendingValue.length ===
                        options.filter(({ disabled }) => !disabled).length
                      ? []
                      : options
                          .filter(({ disabled }) => !disabled)
                          .map(({ value }) => value)
                  );
                } else {
                  setPendingValue(newValue);
                }
              } else {
                if (multiple && Array.isArray(newValue)) {
                  const isSelectAllIncluded = (
                    newValue as (string | number)[]
                  ).includes("select-all");

                  if (isSelectAllIncluded) {
                    handleSelectAll(!isAllSelected);

                    return;
                  }

                  if (maxLimit && newValue.length > maxLimit) {
                    toasts.error({
                      title: t("common.select.limitExceed", { maxLimit }),
                    });

                    return;
                  }
                }

                onChange(newValue);
              }
            }}
            onClose={() => {
              if (setOnFinalChange && hasPendingChange.current) {
                onChange(pendingValue);
                hasPendingChange.current = false;
                setPendingValue(null);
              }
            }}
            renderValue={restProps.renderValue ?? renderValue}
            // eslint-disable-next-line sonarjs/no-unstable-nested-components
            IconComponent={(props) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  pr: 2.5,
                }}
              >
                {value &&
                  ((Array.isArray(value) && value.length > 0) ||
                    (!Array.isArray(value) && value !== "")) &&
                  !disableClearable && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(multiple ? [] : "");
                      }}
                    >
                      <ClearIcon sx={{ fontSize: "14px" }} />
                    </IconButton>
                  )}
                <ArrowDropDownIcon {...props} />
              </Box>
            )}
            displayEmpty
            MenuProps={{
              PaperProps: {
                sx: {
                  width: "inherit",
                  maxHeight: 300,
                  "& .MuiList-root": {
                    paddingTop: 0,
                    paddingBottom: 0,
                  },
                },
              },
            }}
          >
            {Object.entries(groupedOptions).length ? (
              renderMenuItems()
            ) : (
              <MenuItem disabled>
                <ListItemText primary="No options" />
              </MenuItem>
            )}
          </MuiSelect>

          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </StyledFormControl>

        {onAction && <EditIconAction disabled={disabled} onClick={onAction} />}
      </Stack>
    </Stack>
  );
}

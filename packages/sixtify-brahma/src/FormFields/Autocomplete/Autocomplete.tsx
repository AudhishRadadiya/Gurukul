import type {
  AutocompleteValue,
  AutocompleteProps as MuiAutocompleteProps,
} from "@mui/material";

import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  Divider,
  InputLabel,
  Autocomplete as MuiAutocomplete,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { Skeleton } from "./Skeleton";

export type Option = {
  heading?: string;
  label: string;
  value: string | number;
  disabled?: boolean;
  employee_code?: string;
  avatar?: string;
  punch_code?: string;
};

export type AutocompleteProps<P extends FieldValues> = UseControllerProps<P> &
  Omit<
    Omit<
      MuiAutocompleteProps<Option, boolean, boolean, boolean>,
      "renderInput"
    >,
    keyof ControllerRenderProps<P>
  > & {
    required?: boolean;
    label?: string;
    helperText?: string;
    error?: boolean;
    withLabel?: boolean;
    placeholder?: string;
    isShowAvatar?: boolean;
    shouldCloseOnSelect?: boolean;
    onAction?: () => void;
    isShowSelectAll?: boolean;
    isShowOptionsOnType?: boolean;
    isShowEmployeeData?: boolean;
    maxLimit?: number;
    renderOption?: (
      props: React.HTMLProps<HTMLLIElement>,
      option: Option,
      state: { selected: boolean }
    ) => JSX.Element;
    getOptionLabel?: (option: string) => string;
    defaultOption?: AutocompleteValue<Option, boolean, boolean, boolean>;
    disableClearable?: boolean;
  };

export function Autocomplete<P extends FieldValues>({
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
  withLabel = false,
  placeholder = "",
  freeSolo,
  isShowOptionsOnType = false,
  isShowSelectAll = true,
  isShowAvatar = false,
  isShowEmployeeData = false,
  shouldCloseOnSelect = false,
  onAction,
  renderOption,
  getOptionLabel,
  maxLimit,
  defaultOption,
  disableClearable = required ? true : false,
  ...restProps
}: AutocompleteProps<P>) {
  const {
    field: { onChange, value, ...restField },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState("");

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allValues = options.map((option) => option.value);

      onChange(allValues);
    } else {
      onChange([]);
    }
  };

  const highlightedOptionRef = useRef<string | number>("");

  const isAllSelected = useMemo(() => {
    return (
      multiple &&
      isShowSelectAll &&
      options.length > 0 &&
      value?.length === options.filter((option) => !option.disabled).length
    );
  }, [multiple, isShowSelectAll, options, value]);

  const memoizedOptions = useMemo(() => {
    return [
      ...(multiple && isShowSelectAll && options.length
        ? [{ label: "Select All", value: "select-all" }]
        : []),
      ...options,
    ];
  }, [multiple, isShowSelectAll, options]);

  const filteredOptions = useMemo(() => {
    if (inputValue.length < 3) {
      return [];
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue]);

  // eslint-disable-next-line sonarjs/function-return-type
  const selectedValue = useMemo(() => {
    if (multiple && freeSolo) {
      return (
        value?.map((val: string | number) => {
          const selectedOption = options.find((option) => option.value === val);

          return selectedOption ? selectedOption.label : val.toString();
        }) || []
      );
    } else if (withLabel) {
      return options.find((option) => option.value === value?.value) ?? null;
    } else if (multiple) {
      return options.filter((option) => value?.includes(option.value));
    } else if (!options.find((option) => option.value === value) && freeSolo) {
      return value;
    } else if (defaultOption) {
      return defaultOption;
    }

    return options.find((option) => option.value === value) || null;
  }, [multiple, options, value, defaultOption]);

  const {
    palette: {
      app: { color },
    },
  } = useTheme();

  const StyledPaper = styled(Paper)(({ theme }) => ({
    "& .MuiAutocomplete-listbox": {
      maxHeight: 200,
      overflowY: "auto",
      marginTop: "10px",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.secondary.main,
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: color.lightBlue[100],
      },
      "& .MuiAutocomplete-option": {
        fontSize: "14px", // Change this to your desired font size
      },
    },
  }));

  const GroupHeader = styled("div")(({ theme }) => ({
    position: "sticky",
    padding: "4px 10px",
    fontSize: "16px",
    fontWeight: 500,
    color: theme.palette.app.color.butterflyBlue[900],
    backgroundColor: theme.palette.app.color.butterflyBlue[500],
  }));

  const GroupItems = styled("ul")({
    padding: 0,
  });

  if (loading) {
    return <Skeleton label={label} />;
  }

  return (
    <Stack gap="10px">
      {label && <InputLabel required={required}>{label}</InputLabel>}

      <Stack
        direction="row"
        justifyContent="space-between"
        gap="10px"
        alignItems="start"
      >
        <MuiAutocomplete
          PopperComponent={Popper}
          PaperComponent={StyledPaper}
          sx={{
            "& .MuiAutocomplete-tag": {
              backgroundColor: color.slate[700],
              color: "black",
            },
            width: "100%",
          }}
          onHighlightChange={(event, option) => {
            if (option) {
              if (highlightedOptionRef.current != option.value) {
                highlightedOptionRef.current = option.value;
              }
            }
          }}
          disableCloseOnSelect={shouldCloseOnSelect}
          disabled={disabled}
          freeSolo={freeSolo}
          {...restProps}
          {...restField}
          disableClearable={disableClearable}
          renderTags={(value: Option[], getTagProps) =>
            value.map((option: Option, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });

              const label = typeof option === "string" ? option : option.label;

              let avatarContent = "";

              let avatar = undefined;

              if (isShowAvatar) {
                if (!option.avatar) {
                  const initials = option.label
                    .split(" ")
                    .map((word) => word[0]?.toUpperCase())
                    .join("");

                  avatarContent = `${initials}`;
                }
                avatar = option.avatar ? (
                  <Avatar src={option.avatar} alt={option.label} />
                ) : (
                  <Avatar>{avatarContent}</Avatar>
                );
              }

              return (
                <Chip
                  avatar={avatar}
                  label={label}
                  key={key}
                  {...tagProps}
                  disabled={option.disabled || disabled}
                />
              );
            })
          }
          renderOption={(props, option, { selected }) => {
            if (renderOption) {
              return renderOption(props, option, { selected });
            }

            const { label, avatar, employee_code, punch_code, value } = option;

            const { key, ...optionProps } = props;

            const isSelectAll = value === "select-all";

            return (
              <li key={key} {...optionProps}>
                <Stack gap="5px">
                  <Stack direction="row" gap="10px" alignItems="center">
                    {multiple && (
                      <Checkbox
                        icon={<BoxStyled size="small" />}
                        checkedIcon={<CheckStyled size="small" />}
                        indeterminate={
                          !isAllSelected && selectedValue?.length && isSelectAll
                            ? true
                            : false
                        }
                        checked={isAllSelected ? true : selected}
                        sx={{
                          marginRight: "8px",
                          ".MuiCheckbox-indeterminate": {
                            borderColor: color.butterflyBlue[900],
                          },
                        }}
                      />
                    )}

                    {!isSelectAll && isShowEmployeeData ? (
                      <>
                        <Avatar
                          sx={{ width: 30, height: 30 }}
                          src={avatar}
                          alt={label}
                        />
                        <Box>
                          <Typography>
                            {`${label} (${employee_code ?? "-"})`}
                          </Typography>

                          <Typography variant="body2" color={color.iron[800]}>
                            {punch_code ?? "-"}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Typography>{label}</Typography>
                    )}
                  </Stack>

                  {isSelectAll && <Divider sx={{ width: "280px" }} />}
                </Stack>
              </li>
            );
          }}
          renderInput={(params) => {
            let startAdornment = params.InputProps.startAdornment;

            if (!multiple && selectedValue?.avatar && getOptionLabel) {
              startAdornment = (
                <Box width="20px" marginLeft="10px">
                  <Avatar
                    src={selectedValue.avatar}
                    alt={selectedValue.label}
                    sx={{ width: 24, height: 24 }}
                  />
                </Box>
              );
            }

            return (
              <TextField
                {...params}
                placeholder={placeholder || `Select ${label}`}
                error={error}
                helperText={helperText}
                InputProps={{
                  ...params.InputProps,
                  startAdornment,
                }}
                onChange={(e) => {
                  if (isShowOptionsOnType) {
                    setInputValue(e.target.value);
                  }
                }}
              />
            );
          }}
          multiple={multiple}
          options={isShowOptionsOnType ? filteredOptions : memoizedOptions}
          isOptionEqualToValue={(option, value) =>
            freeSolo ? false : option.value === value.value
          }
          getOptionLabel={(option) => {
            if (getOptionLabel) {
              return getOptionLabel(option);
            }

            if (typeof option === "string") {
              return option;
            }

            return option.label;
          }}
          value={selectedValue}
          // eslint-disable-next-line sonarjs/cognitive-complexity
          onChange={(_, newValue) => {
            if (!newValue) {
              setInputValue("");
            }

            if (withLabel) {
              return onChange(newValue);
            }

            if (
              multiple &&
              Array.isArray(newValue) &&
              maxLimit &&
              newValue.length > maxLimit
            ) {
              toasts.error({
                title: t("common.autocomplete.limitExceed", { maxLimit }),
              });

              return;
            }

            if (multiple && isShowSelectAll && Array.isArray(newValue)) {
              const isSelectAllIncluded = newValue.some(
                (option) =>
                  typeof option !== "string" && option?.value === "select-all"
              );

              if (isSelectAllIncluded) {
                handleSelectAll(!isAllSelected);

                return;
              }
            }

            if (multiple && freeSolo) {
              if (Array.isArray(newValue)) {
                // eslint-disable-next-line sonarjs/function-return-type
                const values = newValue.map((option) => {
                  return typeof option === "string" ? option : option.value;
                });

                return onChange(values);
              }

              return onChange(value || []);
            }

            if (typeof newValue === "string") {
              return onChange(newValue ?? null);
            }

            if (Array.isArray(newValue)) {
              // eslint-disable-next-line sonarjs/function-return-type
              const values = newValue.map((option) => {
                if (typeof option === "string") {
                  return newValue;
                }

                return option.value;
              });

              return onChange(values);
            }

            onChange(newValue ? newValue.value : null);
          }}
          groupBy={(option) => option.heading ?? ""}
          renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
          getOptionDisabled={(option) => !!option.disabled}
          onBlur={() => {
            setInputValue("");
          }}
        />

        {onAction && <EditIconAction disabled={disabled} onClick={onAction} />}
      </Stack>
    </Stack>
  );
}

import type {
  AutocompleteValue,
  AutocompleteProps as MuiAutocompleteProps,
  StackProps,
} from "@mui/material";
import {
  Avatar,
  Box,
  Checkbox,
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
import { alpha, styled } from "@mui/material/styles";
import _isFunction from "lodash/isFunction";
import { useMemo, useRef, useState } from "react";
import {
  useController,
  type ControllerRenderProps,
  type FieldError,
  type FieldValues,
  type PathValue,
  type UseControllerProps,
  type UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EditIconAction } from "../../Actions";
import { toasts } from "../../Toast";
import { Tooltip } from "../../Tooltip";
import type { OnAction } from "../../utils/types";
import { BoxStyled, CheckStyled } from "../CheckBox/CheckBox.styled";
import {
  getDefaultInputLabelProps,
  getDefaultTextFieldSx,
} from "../commonStyles";
import type { AllowedCharacterType, LetterCase } from "../TextField";
import { characterTypeMessages } from "../TextField";
import { StyledChipV2 } from "./ChipV2.styled";
import { Skeleton } from "./Skeleton";
import { Tags } from "./Tags";

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
    onAction?: OnAction;
    isShowSelectAll?: boolean;
    isShowOptionsOnType?: boolean;
    autoFocus?: boolean;
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
    characterType?: AllowedCharacterType;
    setError?: (
      name: keyof P,
      error: FieldError | { type: string; message?: string }
    ) => void;
    letterCase?: LetterCase;
    createOptionOnType?: boolean;
    setValue?: UseFormSetValue<P>;
    containerProps?: StackProps;
    styling?: "custom" | "default";
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
  autoFocus = false,
  defaultOption,
  characterType = "string-number-special",
  letterCase = "mixed",
  setError,
  createOptionOnType = false,
  disableClearable = required ? true : false,
  containerProps,
  setValue,
  limitTags = 0,
  styling = "default",
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
    const disabledOptions = options.filter((option) => option.disabled);

    const disabledValues = disabledOptions.map((option) => option.value);

    if (isSelected) {
      const allValues = options.map((option) => option.value);

      onChange(allValues);
    } else {
      onChange(disabledValues);
    }
  };

  const highlightedOptionRef = useRef<string | number>("");

  const isAllSelected = useMemo(() => {
    return (
      multiple &&
      isShowSelectAll &&
      options.length > 0 &&
      value?.length === options.length
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

  useMemo(() => {
    if (_isFunction(setValue) && required && options.length === 1 && !value) {
      setValue(name, options[0]?.value as PathValue<P, typeof name>, {
        shouldDirty: true,
      });
    }
  }, [required, options, value]);

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
      maxHeight: 150,
      overflowY: "auto",
      marginTop: "0px",
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
        fontSize: "14px",
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

  const getCharacterRegex = (type: AllowedCharacterType) => {
    switch (type) {
      case "string":
        return /^[A-Za-z\s]*$/;

      case "string-number":
        return /^[A-Za-z0-9\s]*$/;

      case "string-number-special":
        return /^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\n\r]*$/;

      default:
        return /^[\s\S]*$/;
    }
  };

  const validateAndTransformInput = (
    input: string
  ): { isValid: boolean; cleanedValue: string; errorMessage?: string } => {
    let transformedValue = input;

    if (!transformedValue) {
      return { isValid: true, cleanedValue: "" };
    }

    const regex = getCharacterRegex(characterType);

    if (!regex.test(transformedValue)) {
      return {
        isValid: false,
        cleanedValue: transformedValue,
        errorMessage: characterTypeMessages[characterType],
      };
    }

    if (letterCase === "uppercase") {
      transformedValue = input.toUpperCase();
    } else if (letterCase === "lowercase") {
      transformedValue = input.toLowerCase();
    }

    return { isValid: true, cleanedValue: transformedValue };
  };

  if (loading) {
    return <Skeleton label={label} styling={styling} />;
  }

  return (
    <Stack gap="5px" {...containerProps}>
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
        <MuiAutocomplete
          PopperComponent={Popper}
          PaperComponent={StyledPaper}
          sx={{
            "& .MuiAutocomplete-tag": {
              backgroundColor: alpha(color.iron[700], 0.6),
              color: color.black[900],
              borderRadius: "50px",
              padding: "0",
            },
            "& .MuiChip-deleteIcon": {
              color: alpha(color.iron[800], 0.7),
              "&:hover": { color: color.iron[800], transition: "100ms ease" },
              borderRadius: "50%",
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
          renderTags={(value: Option[], getTagProps) => {
            const visibleTags = limitTags ? value.slice(0, limitTags) : value;

            const hiddenCount = value.length - visibleTags.length;

            const hiddenTags = limitTags ? value.slice(limitTags) : value;

            return (
              <Stack
                flexWrap="wrap"
                flexDirection="row"
                gap={0.2}
                maxHeight={150}
                alignItems="center"
                sx={{
                  overflowY: "auto",
                }}
              >
                <Tags
                  disabled={disabled}
                  getTagProps={getTagProps}
                  isShowAvatar={isShowAvatar}
                  tags={visibleTags}
                  startIndex={0}
                />

                {hiddenCount > 0 && (
                  <Tooltip
                    toolTipLabel={
                      <Stack
                        maxHeight="200px"
                        alignItems="start"
                        overflow="auto"
                      >
                        <Tags
                          disabled={disabled}
                          getTagProps={getTagProps}
                          isShowAvatar={isShowAvatar}
                          tags={hiddenTags}
                          startIndex={limitTags}
                        />
                      </Stack>
                    }
                  >
                    <StyledChipV2 label={`+${hiddenCount}`} />
                  </Tooltip>
                )}
              </Stack>
            );
          }}
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

                          {punch_code && (
                            <Typography variant="body2" color={color.iron[800]}>
                              {punch_code}
                            </Typography>
                          )}
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

            const getPlaceholder = () => {
              if (styling === "default") {
                return placeholder;
              }

              return placeholder || `Select ${label}`;
            };

            return (
              <TextField
                {...params}
                placeholder={getPlaceholder()}
                label={styling === "default" ? label : undefined}
                required={styling === "default" ? required : undefined}
                error={error}
                autoFocus={autoFocus}
                helperText={helperText}
                sx={getDefaultTextFieldSx(styling)}
                InputLabelProps={getDefaultInputLabelProps(styling)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment,
                }}
                onChange={(e) => {
                  const rawValue = e.target.value;

                  const { isValid, cleanedValue, errorMessage } =
                    validateAndTransformInput(rawValue);

                  if (!isValid && setError && errorMessage) {
                    setError(name, { type: "manual", message: errorMessage });

                    return;
                  } else if (setError) {
                    setError(name, { type: "", message: "" });
                  }

                  if (!multiple && freeSolo && createOptionOnType) {
                    onChange(cleanedValue);
                  } else if (!cleanedValue) {
                    onChange(null);
                  }

                  if (isShowOptionsOnType) {
                    setInputValue(cleanedValue);
                  }
                }}
                onKeyDown={(e) => {
                  const regex = getCharacterRegex(characterType);

                  if (!regex.test(e.key)) {
                    e.preventDefault();

                    if (setError) {
                      setError(name, {
                        type: "manual",
                        message: characterTypeMessages[characterType],
                      });
                    }
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
              const { cleanedValue } = validateAndTransformInput(newValue);

              return onChange(cleanedValue ?? null);
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
          renderGroup={(params) => {
            if (!params.group) {
              return <Box>{params.children}</Box>;
            }

            return (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            );
          }}
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

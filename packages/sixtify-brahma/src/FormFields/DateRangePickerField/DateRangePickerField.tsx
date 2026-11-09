import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import type { SxProps, Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { DateTime } from "luxon";
import { useCallback, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useController } from "react-hook-form";

import { useGetDeviceType } from "../../utils";
import { getDefaultInputLabelProps } from "../commonStyles";
import { DateRangePicker } from "../DateRangePicker";
import { getFormFieldStyleConfig } from "../utils/helper";

import { Skeleton } from "./Skeleton";

import type { TextFieldProps } from "@mui/material/TextField";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import type { SizeType } from "../../utils";

function formatPreview(start: string, end: string, compact = false): string {
  const fmt = (iso: string) =>
    DateTime.fromISO(iso).toFormat(compact ? "dd MMM yy" : "dd MMM yyyy");

  return `${fmt(start)} – ${fmt(end)}`;
}

function isCompleteRange(value: unknown): value is [string, string] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "string" &&
    typeof value[1] === "string" &&
    value[0].length > 0 &&
    value[1].length > 0
  );
}

function getPopoverAnchorOrigin(isMobile: boolean) {
  return {
    vertical: "bottom" as const,
    horizontal: isMobile ? ("center" as const) : ("left" as const),
  };
}

function getPopoverTransformOrigin(isMobile: boolean) {
  return {
    vertical: "top" as const,
    horizontal: isMobile ? ("center" as const) : ("left" as const),
  };
}

function getInputReadOnlyStyle(
  disabled: boolean,
  minWidth?: string | number,
  isMobile = false
): CSSProperties {
  return {
    cursor: disabled ? "not-allowed" : "pointer",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ...(isMobile ? {} : { minWidth: minWidth ?? "205px" }),
  };
}

export type PopupToggleStatus = "open" | "closed";

export type DateRangePickerFieldProps<P extends FieldValues> =
  UseControllerProps<P> & {
    required?: boolean;
    disabled?: boolean;
    showPresets?: boolean;
    placeholder?: string;
    size?: SizeType;
    loading?: boolean;
    onPickerToggle?: (status: PopupToggleStatus) => void;
    maxInputDays?: number;
    TextFieldProps?: Omit<
      TextFieldProps,
      | "value"
      | "onClick"
      | "label"
      | "required"
      | "disabled"
      | "ref"
      | "endAdornment"
    >;
  };

export function DateRangePickerField<P extends FieldValues>({
  control,
  defaultValue,
  disabled = false,
  name,
  required = false,
  showPresets,
  placeholder = "Select date range",
  loading = false,
  size,
  rules,
  onPickerToggle,
  TextFieldProps: textFieldProps,
  maxInputDays = 365,
}: DateRangePickerFieldProps<P>) {
  const { isDesktop, isMobile } = useGetDeviceType();

  const anchorRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const {
    field: { value },
    fieldState: { error },
  } = useController({ name, control, defaultValue, rules });

  const [start, end] = isCompleteRange(value) ? value : [null, null];

  const { inputHeight, inputFontSize } = getFormFieldStyleConfig(size);

  const preview = start && end ? formatPreview(start, end, isMobile) : "";

  const resolvedFullWidth = textFieldProps?.fullWidth ?? true;

  const resolvedWidth =
    textFieldProps?.style?.width ?? (isMobile ? "100%" : "270px");

  const resolvedMinWidth = textFieldProps?.inputProps?.style?.minWidth;

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setOpen(true);
      onPickerToggle?.("open");
    }
  }, [disabled]);

  const handleClose = (
    _event: unknown,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick") {
      setOpen(false);
      onPickerToggle?.("closed");
    }
  };

  if (loading) {
    return <Skeleton size={size} />;
  }

  const compactPopoverPaperSx: SxProps<Theme> = {
    boxSizing: "border-box",
    maxHeight: "calc(100vh - 16px)",
    maxWidth: "calc(100vw - 16px)",
    overflowX: "hidden",
    overflowY: "auto",
    width: isMobile ? "calc(100vw - 16px)" : "min(420px, calc(100vw - 24px))",
  };

  return (
    <>
      <TextField
        {...textFieldProps}
        ref={anchorRef}
        required={required}
        disabled={disabled}
        value={preview}
        placeholder={placeholder}
        onClick={handleOpen}
        error={!!error}
        helperText={error?.message ?? textFieldProps?.helperText}
        fullWidth={resolvedFullWidth}
        style={{ ...textFieldProps?.style, width: resolvedWidth }}
        sx={{
          "& .MuiInputBase-root": {
            height: `${inputHeight}px !important`,
            fontSize: inputFontSize,
          },
          ...(isMobile && {
            "& .MuiInputAdornment-root": {
              marginRight: "4px",
            },
            "& .MuiOutlinedInput-input": {
              paddingLeft: "4px",
              paddingRight: "10px",
            },
          }),
        }}
        InputLabelProps={getDefaultInputLabelProps("default", size)}
        inputProps={{
          ...textFieldProps?.inputProps,
          readOnly: true,
          style: getInputReadOnlyStyle(disabled, resolvedMinWidth, isMobile),
        }}
        InputProps={{
          ...textFieldProps?.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <CalendarMonthIcon
                fontSize="small"
                color={disabled ? "disabled" : "action"}
              />
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={getPopoverAnchorOrigin(isMobile)}
        transformOrigin={getPopoverTransformOrigin(isMobile)}
        disableAutoFocus
        disableEnforceFocus
        marginThreshold={isMobile ? 8 : 16}
        sx={{
          zIndex: ({ zIndex: { modal } }) => modal,
          ...(!isDesktop && { "& .MuiPaper-root": compactPopoverPaperSx }),
        }}
      >
        <DateRangePicker
          name={name}
          control={control}
          defaultValue={
            isCompleteRange(value) ? (value as P[typeof name]) : defaultValue
          }
          showPresets={showPresets}
          maxInputDays={maxInputDays}
        />
      </Popover>
    </>
  );
}

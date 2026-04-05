import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { format, isValid, parseISO } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { StyleDateRangeWrapper } from "./StyleDateRangeWrapper";

type ValueProps = {
  firstDate: Date | null;
  lastDate: Date | null;
};

type DateRangeInputProps = {
  initialValue?: string[];
  onApply: (dates: string[]) => void;
  width: string | number;
};

const parseDateString = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = parseISO(value);

  return isValid(parsed) ? parsed : null;
};

export const DateRangeInput = ({
  initialValue,
  onApply,
  width,
}: DateRangeInputProps) => {
  const anchorRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);

  const defaultDate = useMemo(() => new Date(), []);

  const [range, setRange] = useState(() => [
    {
      endDate: defaultDate,
      key: "selection" as const,
      startDate: defaultDate,
    },
  ]);

  const [value, setValue] = useState<ValueProps>({
    firstDate: null,
    lastDate: null,
  });

  const startDate = value.firstDate && format(value.firstDate, "dd/MM/yyyy");

  const endDate = value.lastDate && format(value.lastDate, "dd/MM/yyyy");

  const displayValue =
    startDate && endDate
      ? // eslint-disable-next-line sonarjs/no-nested-conditional
        startDate === endDate
        ? startDate
        : `${startDate} - ${endDate}`
      : "";

  useEffect(() => {
    if (initialValue && initialValue.length > 0) {
      const [initialStart, initialEnd = initialValue[0]] = initialValue;

      const start = parseDateString(initialStart);

      const end = parseDateString(initialEnd);

      if (start && end) {
        setValue({ firstDate: start, lastDate: end });
        setRange([
          {
            endDate: end,
            key: "selection",
            startDate: start,
          },
        ]);

        return;
      }
    }

    setValue({ firstDate: null, lastDate: null });
    setRange([
      {
        endDate: defaultDate,
        key: "selection",
        startDate: defaultDate,
      },
    ]);
  }, [defaultDate, initialValue]);

  const handleApply = () => {
    const selection = range[0];

    const start = selection?.startDate ?? null;

    const end = selection?.endDate ?? null;

    if (!start || !end) {
      onApply([]);
      setValue({ firstDate: null, lastDate: null });
      setOpen(false);

      return;
    }

    setValue({ firstDate: start, lastDate: end });
    setOpen(false);

    const startStr = format(start, "yyyy-MM-dd");

    const endStr = format(end, "yyyy-MM-dd");

    onApply([startStr, endStr]);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(false);
    setValue({ firstDate: null, lastDate: null });
    setRange([
      {
        endDate: defaultDate,
        key: "selection",
        startDate: defaultDate,
      },
    ]);
    onApply([]);
  };

  return (
    <div>
      <TextField
        inputRef={anchorRef}
        value={displayValue}
        placeholder="dd/mm/yyyy"
        onClick={() => setOpen(true)}
        fullWidth
        InputProps={{
          endAdornment: displayValue && (
            <InputAdornment position="end" style={{ padding: "0px" }}>
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{
                  p: 0.5,
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
        }}
        sx={{
          "& .MuiInputAdornment-root": {
            margin: 0,
          },
          "& .MuiInputBase-input": {
            fontSize: "14px",
            height: "10px",
            padding: "4px 4px",
          },
          "& input[type='date']::-webkit-calendar-picker-indicator": {
            position: "absolute",
            right: 8,
            zIndex: 2,
          },
          width,
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <StyleDateRangeWrapper>
          <DateRange
            ranges={range}
            onChange={(ranges) => {
              const selectedRange = ranges.selection;

              setRange([
                {
                  endDate: selectedRange?.endDate ?? defaultDate,
                  key: "selection",
                  startDate: selectedRange?.startDate ?? defaultDate,
                },
              ]);
            }}
            moveRangeOnFirstSelection={false}
            retainEndDateOnFirstSelection={false}
          />
        </StyleDateRangeWrapper>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "12px", height: "22px", minWidth: "40px" }}
            disableElevation
            onClick={handleApply}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </div>
  );
};
